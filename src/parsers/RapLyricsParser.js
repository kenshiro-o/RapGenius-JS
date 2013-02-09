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
//      var currentSection = {name: "[Empty Section]", lyrics: ""};
      var currentSection = new RapLyrics.Section("[Empty Section]");
      var currentVerses = null;

      //Always add the empty section
      sections.push(currentSection);

      lyricsElems.each( function(i, lyricElem){
        rapLyrics = new RapLyrics.RapLyrics( parseInt($(lyricElem).attr("data-id"), 10));
        var fn = function(elem){
          if(elem.type === "text"){
            var parsed = StringUtils.removeWhiteSpacesAndNewLines(elem.data);


            //Check if parsed content is a section
            if(/^\[.*\]$/.test(parsed)){
              //Add previous section if not
              currentSection = new RapLyrics.Section(parsed);
              rapLyrics.addSection(currentSection);
            }else{
              parsed += parsed.length > 0 ? " " : "";

              if(!currentVerses){
                currentVerses = new RapLyrics.Verses(-1);
                currentSection.addVerses(currentVerses);
              }

              currentVerses.addContent(parsed);
            }
          }else if(elem.type === "tag" && elem.name === "br"){
            if(!currentVerses){
              currentVerses = new RapLyrics.Verses(-1);
              currentSection.addVerses(currentVerses);
            }

            currentVerses.addContent("\n");
          }else if(elem.type === "tag" && elem.name === "a"){
            //This is a new block of verses with explanation
            currentVerses = new RapLyrics.Verses(parseInt($(elem).attr("data-id"), 10));
            currentSection.addVerses(currentVerses);

            elem.children.forEach(fn);
          }
        };
        lyricElem.children.forEach(fn);
      });
    });
    return rapLyrics;
  }catch(e){
    console.log("An error occurred while trying to parse the lyrics: [html=" + html + "], :\n" + e);
    return new Error("Unable to parse lyrics from RapGenius");
  }
}


function parseLyricsExplanationJSON(lyricsJson){
  try {
    var explanations = {};
    var keys = Object.keys(lyricsJson);
    keys.forEach(function(id){
      var html = lyricsJson[id];
      var $ = cheerio.load(html);
      var bodyText = $(".body_text", ".annotation_container").text();
      explanations[id] = StringUtils.removeWhiteSpacesAndNewLines(bodyText);
    });

    return explanations;
  } catch (e) {
    console.log("An error occurred while trying to parse the lyrics explanations [lyrics-explanations=" + lyricsJson +
                "]: \n" + e);
    return new Error("Unable to extract lyrics explanations");
  }
}

module.exports.parseLyricsHTML = parseLyricsHTML;
module.exports.parseLyricsExplanationJSON = parseLyricsExplanationJSON;