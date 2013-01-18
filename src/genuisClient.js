var superAgent = require("superagent"),
  RapSongParser = require("./parsers/RapSongsParser"),
  RapArtistParser = require("./parsers/RapArtistParser");

var RAP_GENIUS_URL = "http://rapgenius.com";
var RAP_GENIUS_URL_SEARCH_URL = RAP_GENIUS_URL + "/search";
var RAP_GENIUS_ARTIST_URL = "http://rapgenius.com/artists/";


function searchSong(query, callback) {
  //TODO perform input validation
  superAgent.get(RAP_GENIUS_URL_SEARCH_URL)
    .query({q: query})
    .set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .end(function (res) {
      if (res.ok) {
        var result = RapSongParser.parseSongHTML(res.text);
        if (result instanceof Error) {
          return callback(result);
        } else {
          return callback(null, result)
        }
      } else {
        console.log("Received a non expected HTTP status [status=" + res.status + "]");
        return callback(new Error("Unexpected HTTP status: " + res.status));
      }
    });
}

function searchArtist(artist, callback) {
  //TODO perform input validation
  superAgent.get(RAP_GENIUS_ARTIST_URL + artist)
    .set("Accept", "text/html")
    .end(function (res) {
      if (res.ok) {
        var result = RapArtistParser.parseArtistHTML(res.text);
        if (result instanceof Error) {
          return callback(result);
        } else {
          return callback(null, result);
        }
      } else {
        console.log("Received a non expected HTTP status [status=" + res.status + "]");
        return callback(new Error("Unexpected HTTP status: " + res.status));
      }
    });
}


module.exports.searchSong = searchSong;
module.exports.searchArtist = searchArtist;
