var cheerio = require("cheerio"),
  CONSTANTS = require("../constants/Constants"),
  RapSong = require("../model/RapSong"),
  StringUtils = require("../util/StringUtils");

function parseSongHTML(html) {
  //TODO Check we are dealing with proper HTML
  //or something that looks like HTML, otherwise throw an error
  try {
    var $ = cheerio.load(html);
    var songs = $(".song_link", "#main");

    var rapSongArray = new Array(songs.length);

    songs.each(function (index, song) {
      var link = CONSTANTS.RAP_GENIUS_URL + $(this).attr("href");
      var elem = $(this).find(".title_with_artists");

      //Remove all unwanted characters
      var songAndArtists = StringUtils.removeWhiteSpacesAndNewLines(elem.text());
      var indexOfHyphen = songAndArtists.indexOf("–");

      var artists = StringUtils.trim(songAndArtists.substring(0, indexOfHyphen));
      var songName = StringUtils.trim(songAndArtists.substring(indexOfHyphen + 1, songAndArtists.length));

      rapSongArray[index] = new RapSong(songName, artists, link);
    });

    return rapSongArray;
  } catch (e) {
    console.log("An error occured while trying to parse the songs: [html=" + html + "]");
    return new Error("Unable to parse song search results from RapGenius");
  }
}

module.exports.parseSongHTML = parseSongHTML;
