var cheerio = require("cheerio"),
  CONSTANTS = require("../constants/Constants"),
  Song = require("../model/Song"),
  Artist = require("../model/Artist"),
  StringUtils = require("../util/StringUtils");


function parseArtistHTML(html, type) {
  try {
    var urls = CONSTANTS.Type2URLs[type];
    var $ = cheerio.load(html);

    var artistElem = $(".canonical_name", "#main");
    var artistName = "";

    if (artistElem.length <= 0) {
      return new Error("Could not find artist");
    }

    //TODO either find a library that enables be to extract text from text nodes of direct
    // children or improve cheerio API
    artistElem = artistElem[0];

    artistElem.children.forEach(function (childElem) {
      if (childElem.type === "text") {
        artistName += StringUtils.removeWhiteSpacesAndNewLines(childElem.data);
      }
    });

    var artistLink = urls.artist_url + artistName.replace(" ", "-");
    var rapArtist = new Artist(artistName, artistLink);

    var songs = $(".song_list", "#main");
    songs.each(function (index, song) {
      var songLinkElem = $(song).find(".song_link");
      songLinkElem.each(function (i, s) {
        var songLink = urls.base_url + $(s).attr("href");
        var songName = StringUtils.removeWhiteSpacesAndNewLines($(s).children(".title_with_artists").text());
        var rapSong = new Song(songName, artistLink, songLink);

        if (index === 0) {
          //This element represents the favourite songs of the artist
          rapArtist.addPopularSong(rapSong);
        }
        rapArtist.addSong(rapSong);
      });

    });

    return rapArtist;

  } catch (e) {
    console.log("An error occured while trying to parse the artist: [html=" + html + "], error: " + e);
    return new Error("Unable to parse artist details results from RapGenius");
  }
}

module.exports.parseArtistHTML = parseArtistHTML;