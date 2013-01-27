var cheerio = require("cheerio"),
  RapLyrics = require("../model/RapLyrics"),
  StringUtils = require("../util/StringUtils");

function parseLyricsHTML(html){
  //TODO Perform some further validation
  try{
    var $ = cheerio.load(html);
    var lyricsContainer = $(".lyrics_container", "#main");
    if(lyricsContainer.length <= 0){
      return new Error("Unable to parse lyrics: lyrics_container does not exist!");
    }
    var rapLyrics = null;

    //We definitely have some lyrics down there...
    lyricsContainer.each(function(index, container){
      var lyricsElems = $(container).find(".lyrics");
      var sections = [];
      var currentSection = {name: "[Empty Section]", lyrics: ""};

      lyricsElems.each( function(i, lyricElem){
        var fn = function(elem){
          if(elem.type === "text"){
            var parsed = StringUtils.removeWhiteSpacesAndNewLines(elem.data);
            //Check if this is a section
            if(/^\[.*\]$/.test(parsed)){
              currentSection = {name: parsed, lyrics: ""};
              sections.push(currentSection);
            }else{
              parsed += parsed.length > 0 ? " " : "";
              currentSection.lyrics += parsed;

              //Check if the first lyrics do not belong to a section
              //This means they belong to the empty section
              if(sections.length === 0){
                sections.push(currentSection);
              }
            }
          }else if(elem.type === "tag" && elem.name === "br"){
            currentSection.lyrics += "\n";
          }else if(elem.type === "tag" && elem.name === "a"){
            elem.children.forEach(fn);
          }
        };
        lyricElem.children.forEach(fn);
      });
      rapLyrics = new RapLyrics(sections);
    });
    return rapLyrics;
  }catch(e){
    console.log("An error occurred while trying to parse the lyrics: [html=" + html + "], :\n" + e);
    return new Error("Unable to parse lyrics from RapGenius");
  }
}

module.exports.parseLyricsHTML = parseLyricsHTML;