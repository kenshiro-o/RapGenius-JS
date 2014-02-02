var vows = require("vows"),
    geniusClient = require("./../src/geniusClient"),
    assert = require("assert");
    util = require("util"),
    Song = require("./../src/model/Song"),
    Artist = require("./../src/model/Artist"),
    Lyrics = require("./../src/model/Lyrics");


vows.describe("Search checks").addBatch({
  "when searching for a given song": {
    topic: function () {
      geniusClient.searchSong('Liquid Swords', "rap", this.callback);
    },

    "A valid response body is returned": function (err, response) {
      //Make sure we receive something

      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof Array);
      assert.ok(response[0] instanceof Song);
      assert.ok(response[0].name);
      assert.ok(response[0].artists);
      assert.ok(response[0].link);
    }

  },
  "when searching one of the artist's name": {
    topic: function () {
      geniusClient.searchArtist("The Genius", "rap", this.callback);
    },

    "A valid response body is returned": function (err, response) {
      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof Artist);
      assert.ok(response.popularSongs.length > 0);
      assert.ok(response.songs.length > 0);
      assert.deepEqual(response.name, "GZA");
      assert.deepEqual(response.link.toUpperCase(), "http://rapgenius.com/artists/Gza".toUpperCase());
    }
  },
  "when searching one artist's real name": {
    topic: function () {
      geniusClient.searchArtist("GZA", "rap", this.callback);
    },

    "A valid response body is returned": function (err, response) {
      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof Artist);
      assert.ok(response.popularSongs.length > 0);
      assert.ok(response.songs.length > 0);
      assert.deepEqual(response.name, "GZA");
      assert.deepEqual(response.link.toUpperCase(), "http://rapgenius.com/artists/Gza".toUpperCase());
    }
  },
  "when searching an artist that does not exist": {
    topic: function () {
      geniusClient.searchArtist("opu8psdjchlk", "rap", this.callback);
    },

    "An error object is returned": function (err, response) {
      assert.ok(err);
    }
  },
  "When searching for the lyrics of given song":{
    topic: function(){
      geniusClient.searchSongLyrics("/Raekwon-knowledge-god-lyrics", "rap", this.callback);
    },

    "The parsed lyrics are returned in an object": function(err, response){
      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof Lyrics.Lyrics);
      assert.deepEqual(response.songId, 3681);
      assert.deepEqual(response.songTitle, "Knowledge God");
      assert.deepEqual(response.mainArtist, "Raekwon");
      assert.deepEqual(response.producingArtists, ["RZA"]);
      assert.deepEqual(response.featuringArtists, []);
      assert.ok(response.sections.length > 0);
      assert.deepEqual(response.sections[0].name, "[Intro]");
    }
  },

  "when searching for the meaning of a song's lyrics":{
    topic: function(){
      geniusClient.searchLyricsExplanation(3681, "rap", this.callback);
    },

    "An explanation object is returned": function(err, response){
      assert.ok(!err);
      assert.ok(response[107258]) ;
      assert.deepEqual(response[310425], "Really though, why would anyone try to fuck with them?");
    }
  },

  "when searching for a song's lyrics and their meaning":{
    topic: function(){
      geniusClient.searchLyricsAndExplanations("/Raekwon-knowledge-god-lyrics", "rap", this.callback);
    },

    "A returned tuple of lyrics and explanations is returned": function(err, response){
      assert.ok(!err);
      assert.ok(response.lyrics instanceof Lyrics.Lyrics);
      assert.deepEqual(response.explanations[310425], "Really though, why would anyone try to fuck with them?");
    }
  },
  "When searching for the lyrics of a song that does not exist":{
    topic: function(){
      geniusClient.searchSongLyrics("/DOES-NOT-EXIST-LYRICS", "rap", this.callback);
    },

    "An error is returned": function(err, response){
      assert.ok(err);
      assert.ok(!(err instanceof Lyrics.Lyrics));
      assert.ok(err instanceof Error);
    }
  }
}).run();

