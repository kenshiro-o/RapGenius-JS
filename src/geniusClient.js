var superAgent = require("superagent"),
  SongParser = require("./parsers/SongsParser"),
  ArtistParser = require("./parsers/ArtistParser"),
  LyricsParser = require("./parsers/LyricsParser")
  Constants = require("./constants/Constants");

var GENIUS_URL = "http://genius.com";
var GENIUS_ARTIST_URL = "http://genius.com/artists/";
var GENIUS_SONG_EXPLANATION_URL = GENIUS_URL + "/annotations/for_song_page";


function searchSong(query, artist, callback) {
  //TODO perform input validation

  // type = type.toLowerCase();
  // var type2Urls = Constants.Type2URLs[ type];
  // if (!type2Urls){
  //     process.nextTick(function(){
  //        callback("Unrecognized type in song search [type=" + type + "]");
  //     });
  //     return;
  // }

  superAgent.get("http://genius.com/search")
    .query({q: query + artist})
    .set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .end(function (res) {
      if (res.ok) {
        var result = SongParser.parseSongHTML(res.text);
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
    // type = type.toLowerCase();
    // var type2Urls = Constants.Type2URLs[ type];
    // if (!type2Urls){
    //     process.nextTick(function(){
    //         callback("Unrecognized type in artist search [type=" + type + "]");
    //     });
    //     return;
    // }

    superAgent.get("http://genius.com/artists/" + artist)
    .set("Accept", "text/html")
    .end(function (res) {
        debugger;
        if (res.ok) {
        var result = ArtistParser.parseArtistHTML(res.text);
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
  // type = type.toLowerCase();
  // var type2Urls = Constants.Type2URLs[ type];
  // if (!type2Urls){
  //   process.nextTick(function(){
  //     callback("Unrecognized type in song lyrics search [type=" + type + "]");
  //   });
  //   return;
  // }

  var url = /^http/.test(link) ? link : "http://genius.com" + link;
  superAgent.get(url)
    .set("Accept", "text/html")
    .end(function(res){
      if(res.ok){
        var result = LyricsParser.parseLyricsHTML(res.text);
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

function searchLyricsExplanation(songId, callback){
  //Check whether the URL is fully defined or relative

  // type = type.toLowerCase();
  // var type2Urls = Constants.Type2URLs[ type];
  // if (!type2Urls){
  //   process.nextTick(function(){
  //     callback("Unrecognized type in song lyrics search [type=" + type + "]");
  //   });
  //   return;
  // }

  superAgent.get("http://genius.com/annotations/for_song_page")
    .set("Accept", "text/html")
    .query({song_id: songId})
    .end(function(res){
      if(res.ok){
        var explanations = LyricsParser.parseLyricsExplanationJSON(JSON.parse(res.text));
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

function searchLyricsAndExplanations(link, callback){
  var lyrics = null;
  var lyricsCallback = function(err, cur_lyrics){
    if(err){
      return callback(err);
    }else{
      lyrics = cur_lyrics;
      console.log("SongID: " + lyrics.songId)
      searchLyricsExplanation(lyrics.songId, explanationsCallback);
    }
  };

  var explanationsCallback = function(err, explanations){
    if(err){
      return callback(err);
    }else{
      return callback(null, {lyrics: lyrics, explanations: explanations});
    }
  };

  searchSongLyrics(link, lyricsCallback);
}

module.exports.searchSong = searchSong;
module.exports.searchArtist = searchArtist;
module.exports.searchSongLyrics = searchSongLyrics;
module.exports.searchLyricsExplanation = searchLyricsExplanation;
module.exports.searchLyricsAndExplanations = searchLyricsAndExplanations;