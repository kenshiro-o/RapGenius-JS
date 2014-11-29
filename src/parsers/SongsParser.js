var cheerio = require("cheerio"),
  CONSTANTS = require("../constants/Constants"),
  Song = require("../model/Song"),
  StringUtils = require("../util/StringUtils");


function parseSongHTML(html, type) {
  //TODO Check we are dealing with proper HTML
  //or something that looks like HTML, otherwise throw an error
  try {
    var urls = CONSTANTS.Type2URLs[type];
    var $ = cheerio.load(html);
    var songs = $(".song_link", "#main");

    var rapSongArray = new Array(songs.length);

    songs.each(function (index, song) {
      var link = $(this).attr("href");
      // Adding the http prefix if the link does not contain it
      if (!/^http/.test(link)){
        link = urls.base_url + link;
      }
      var elem = $(this).find(".title_with_artists");

      var artists = elem.find(".artist_name").text();
      var songName = elem.find(".song_title").text();

      rapSongArray[index] = new Song(songName, artists, link);
    });

    return rapSongArray;
  } catch (e) {
    console.log("An error occured while trying to parse the songs: [html=" + html + "]");
    return new Error("Unable to parse song search results from RapGenius");
  }
}

module.exports.parseSongHTML = parseSongHTML;
