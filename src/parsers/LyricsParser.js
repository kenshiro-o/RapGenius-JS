var cheerio = require("cheerio"),
    Lyrics = require("../model/Lyrics"),
    StringUtils = require("../util/StringUtils");

function parseLyricsHTML(html, type) {
    try {
        var $ = cheerio.load(html);

        //Let's extract main and featured artists
        var mainArtist = $(".song_header .song_title_and_artists .text_artist > a", "#main").text().replace(/^\s+|\s+$/g, '')
        var songTitle = $(".song_header .song_title_and_artists .text_title", "#main").text();

        //trimming song title string
        songTitle = songTitle.replace("\n", "");
        songTitle = songTitle.replace(/^\s+|\s+$/g, '');

        var ftList = [];
        var featured = $(".role_artists > .featured_artists > a", "#main");
        featured.each(function (index, featuringArtist) {
            var ftArtistName = $(featuringArtist).text();
            ftList.push(ftArtistName);
        });

        var prodList = [];
        var producers = $(".song_header .producer_artists > a", "#main");
        producers.each(function (index, producingArtist) {
            var prodArtist = $(producingArtist).text();
            prodList.push(prodArtist);
        });

        var lyricsContainer = $(".lyrics_container", "#main");
        if (lyricsContainer.length <= 0) {
            return new Error("Unable to parse lyrics: lyrics_container does not exist!");
        }
        var rapLyrics = null;

      var currentSection = new Lyrics.Section("[Empty Section]");

        //We definitely have some lyrics down there...
        lyricsContainer.each(function (index, container) {
            //The lyrics class holds the paragraphs that contain the lyrics
            var lyricsElems = $(container).find(".lyrics");
            var songId = parseInt($(lyricsElems.first()).attr("data-id"));
            rapLyrics = new Lyrics.Lyrics(songId, 10);
            rapLyrics.songTitle = songTitle;
            rapLyrics.mainArtist = mainArtist;
            rapLyrics.featuringArtists = ftList;
            rapLyrics.producingArtists = prodList;

            var currentVerses = null;

            //Parsing function  - what really does the job
            var parserFunc = function (index, paragraphElem) {
                var paragraphParser = function (paragraphContent) {
                    if (paragraphContent.type === "text") {
                        var parsed = StringUtils.removeWhiteSpacesAndNewLines(paragraphContent.data);

                        //check if parsed content is a section
                        if (/^\[.*\]$/.test(parsed)) {
                            currentSection = new Lyrics.Section(parsed);
                            rapLyrics.addSection(currentSection);
                        } else {
                            //Not a section name, therefore this must be text
                            //However we only want to add non empty strings
                            var parsedNotEmpty = parsed.length > 0;

                            if (!currentVerses && parsedNotEmpty) {
                                //Add verses to section
                                currentVerses = new Lyrics.Verses(-1);
                                currentSection.addVerses(currentVerses);
                            }
                            //Now add content to verses object
                            if (parsedNotEmpty) {
                                currentVerses.addContent(parsed);
                            }
                        }
                    } else if (paragraphContent.type === "tag" && paragraphContent.name === "br") {
                        if (currentVerses) {
                            currentVerses.addContent("\n");
                        }
                    } else if (paragraphContent.type === "tag" && paragraphContent.name === "a") {
                        //We have stumbled upon an annotate lyrics block
                        var lyricsId = parseInt($(paragraphContent).attr("data-id"), 10);
                        currentVerses = new Lyrics.Verses(lyricsId);
                        currentSection.addVerses(currentVerses);

                        //We now recursively process the text that is inside the <a> tag as it contains the lyrics
                        paragraphContent.children.forEach(paragraphParser);
                    }

                };

                paragraphElem.children.forEach(paragraphParser);

            };

            //All lyrics are now contained in paragraphs
            lyricsElems.find("p").each(parserFunc);

        });
      if (rapLyrics.sections.length === 0){
        rapLyrics.addSection(currentSection);
      }
      return rapLyrics;
    } catch (e) {
        console.log("An error occurred while trying to parse the lyrics: [html=" + html + "], :\n" + e);
        return new Error("Unable to parse lyrics from RapGenius");
    }
}


function parseLyricsExplanationJSON(lyricsJson) {
    try {
        var explanations = {};
        var keys = Object.keys(lyricsJson);
        keys.forEach(function (id) {
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