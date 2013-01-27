var superAgent = require("superagent"),
  RapSongParser = require("./parsers/RapSongsParser"),
  RapArtistParser = require("./parsers/RapArtistParser"),
  RapLyricsParser = require("./parsers/RapLyricsParser");

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


function searchSongLyrics(link, callback){
  //Check whether the URL is fully defined or relative
  var url = /^http/.test(link) ? link : RAP_GENIUS_URL + link;
  superAgent.get(url)
    .set("Accept", "text/html")
    .end(function(res){
      if(res.ok){
        var result = RapLyricsParser.parseLyricsHTML(res.text);
        if(result instanceof  Error){
          return callback(result);
        }else{
          return callback(null, result);
        }
      }else{
        console.log("An error occurred while trying to access lyrics[url=%s, status=%s]", url, res.status);
        return callback(new Error("Unable to access the page for lyrics [url=" + link + "]"));
      }
    });
}

module.exports.searchSong = searchSong;
module.exports.searchArtist = searchArtist;
module.exports.searchSongLyrics = searchSongLyrics;