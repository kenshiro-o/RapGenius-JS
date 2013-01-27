var vows = require("vows"),
  geniusClient = require("./../src/genuisClient"),
  assert = require("assert");
util = require("util"),
  RapSong = require("./../src/model/RapSong"),
  RapArtist = require("./../src/model/RapArtist"),
  RapLyrics = require("./../src/model/RapLyrics");


vows.describe("Search checks").addBatch({
  "when searching for a given song": {
    topic: function () {
      geniusClient.searchSong('Liquid Swords', this.callback);
    },

    "A valid response body is returned": function (err, response) {
      //Make sure we receive something

      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof Array);
      assert.ok(response[0] instanceof RapSong);
      assert.ok(response[0].name);
      assert.ok(response[0].artists);
      assert.ok(response[0].link);
    }

  },
  "when searching one of the artist's name": {
    topic: function () {
      geniusClient.searchArtist("The Genius", this.callback);
    },

    "A valid response body is returned": function (err, response) {
      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof RapArtist);
      assert.ok(response.popularSongs.length > 0);
      assert.ok(response.songs.length > 0);
      assert.deepEqual(response.name, "GZA");
      assert.deepEqual(response.link.toUpperCase(), "http://rapgenius.com/artists/Gza".toUpperCase());
    }
  },
  "when searching one artist's real name": {
    topic: function () {
      geniusClient.searchArtist("GZA", this.callback);
    },

    "A valid response body is returned": function (err, response) {
      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof RapArtist);
      assert.ok(response.popularSongs.length > 0);
      assert.ok(response.songs.length > 0);
      assert.deepEqual(response.name, "GZA");
      assert.deepEqual(response.link.toUpperCase(), "http://rapgenius.com/artists/Gza".toUpperCase());
    }
  },
  "when searching an artist that does not exist": {
    topic: function () {
      geniusClient.searchArtist("opu8psdjchlk", this.callback);
    },

    "An error object is returned": function (err, response) {
      assert.ok(err);
    }
  },

  "When searching for the lyrics of given song":{
    topic: function(){
      geniusClient.searchSongLyrics("/Raekwon-knowledge-god-lyrics", this.callback);
    },

    "The parsed lyrics are returned in an object": function(err, response){
      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof RapLyrics);
      assert.ok(response.sections.length > 0);
      assert.deepEqual(response.sections[0].name, "[Intro]");
    }
  },

  "When searching for the lyrics of a song that does not exist":{
    topic: function(){
      geniusClient.searchSongLyrics("/DOES-NOT-EXIST-LYRICS", this.callback);
    },

    "An error is returned": function(err, response){
      assert.ok(err);
      assert.ok(!(err instanceof RapLyrics));
      assert.ok(err instanceof Error);

    }
  }
}).run();

