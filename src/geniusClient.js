var superAgent = require("superagent"),
  RapSongParser = require("./parsers/SongsParser"),
  RapArtistParser = require("./parsers/ArtistParser"),
  RapLyricsParser = require("./parsers/LyricsParser")
  Constants = require("./constants/Constants");

var RAP_GENIUS_URL = "http://rapgenius.com";
var RAP_GENIUS_ARTIST_URL = "http://rapgenius.com/artists/";
var RAP_GENIUS_SONG_EXPLANATION_URL = RAP_GENIUS_URL + "/annotations/for_song_page";


function searchSong(query, type, callback) {
  //TODO perform input validation

  type = type.toLowerCase();
  var type2Urls = Constants.Type2URLs[ type];
  if (!type2Urls){
      process.nextTick(function(){
         callback("Unrecognized type in song search [type=" + type + "]");
      });
      return;
  }

  superAgent.get(type2Urls.search_url)
    .query({q: query})
    .set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .end(function (res) {
      if (res.ok) {
        var result = RapSongParser.parseSongHTML(res.text, type);
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

function searchArtist(artist, type, callback) {
  //TODO perform input validation
    type = type.toLowerCase();
    var type2Urls = Constants.Type2URLs[ type];
    if (!type2Urls){
        process.nextTick(function(){
            callback("Unrecognized type in artist search [type=" + type + "]");
        });
        return;
    }

    superAgent.get(type2Urls.artist_url + artist)
    .set("Accept", "text/html")
    .end(function (res) {
        debugger;
        if (res.ok) {
        var result = RapArtistParser.parseArtistHTML(res.text, type);
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


function searchSongLyrics(link, type, callback){
  //Check whether the URL is fully defined or relative
  type = type.toLowerCase();
  var type2Urls = Constants.Type2URLs[ type];
  if (!type2Urls){
    process.nextTick(function(){
      callback("Unrecognized type in song lyrics search [type=" + type + "]");
    });
    return;
  }

  var url = /^http/.test(link) ? link : type2Urls.base_url + link;
  superAgent.get(url)
    .set("Accept", "text/html")
    .end(function(res){
      if(res.ok){
        var result = RapLyricsParser.parseLyricsHTML(res.text, type);
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

function searchLyricsExplanation(songId, type, callback){
  //Check whether the URL is fully defined or relative

  type = type.toLowerCase();
  var type2Urls = Constants.Type2URLs[ type];
  if (!type2Urls){
    process.nextTick(function(){
      callback("Unrecognized type in song lyrics search [type=" + type + "]");
    });
    return;
  }

  superAgent.get(type2Urls.annotations_url)
    .set("Accept", "text/html")
    .query({song_id: songId})
    .end(function(res){
      if(res.ok){
        var explanations = RapLyricsParser.parseLyricsExplanationJSON(JSON.parse(res.text));
        if(explanations instanceof Error){
          return callback(explanations);
        }else{
          return callback(null, explanations);
        }
      }else{
        console.log("An error occurred while trying to get lyrics explanation[song-id=%s, status=%s]", songId, res.status);
        return callback(new Error("Unable to access the page for lyrics [url=" + songId + "]"));
      }
    });
}

function searchLyricsAndExplanations(link, type, callback){
  var lyrics = null;
  var lyricsCallback = function(err, rapLyrics){
    if(err){
      return callback(err);
    }else{
      lyrics = rapLyrics;
      searchLyricsExplanation(lyrics.songId, type, explanationsCallback);
    }
  };

  var explanationsCallback = function(err, explanations){
    if(err){
      return callback(err);
    }else{
      return callback(null, {lyrics: lyrics, explanations: explanations});
    }
  };

  searchSongLyrics(link, type, lyricsCallback);
}

module.exports.searchSong = searchSong;
module.exports.searchArtist = searchArtist;
module.exports.searchSongLyrics = searchSongLyrics;
module.exports.searchLyricsExplanation = searchLyricsExplanation;
module.exports.searchLyricsAndExplanations = searchLyricsAndExplanations;