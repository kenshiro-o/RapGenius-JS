var vows = require("vows"),
    geniusClient = require("./../src/geniusClient"),
    assert = require("assert");
    util = require("util"),
    Song = require("./../src/model/Song"),
    Artist = require("./../src/model/Artist"),
    Lyrics = require("./../src/model/Lyrics");

vows.describe("Search checks").addBatch({
  "when searching for a given rock song":{
      topic: function(){
        geniusClient.searchSong("Born To Run", "rock", this.callback);
      },

      "A valid response body is returned": function(err, response){
          assert.ok(!err);
          assert.ok(!(response instanceof Error));
          assert.ok(response instanceof Array);
          assert.ok(response[0] instanceof Song);
          assert.ok(response[0].name);
          assert.ok(response[0].artists);
          assert.ok(response[0].link);
      }
  },
    "when searching a valid rock artist's name": {
        topic: function () {
            geniusClient.searchArtist("Bruce Springsteen", "rock", this.callback);
        },

        "A valid response body is returned": function (err, response) {
            assert.ok(!err);
            assert.ok(!(response instanceof Error));
            assert.ok(response instanceof Artist);
            assert.ok(response.popularSongs.length > 0);
            assert.ok(response.songs.length > 0);
            assert.deepEqual(response.name, "Bruce Springsteen");
            assert.deepEqual(response.link.toUpperCase(), "http://rock.rapgenius.com/artists/Bruce-Springsteen".toUpperCase());
        }
    },

  "When searching for the lyrics of given song":{
    topic: function(){
      geniusClient.searchSongLyrics("/Bruce-springsteen-born-to-run-lyrics", "rock", this.callback);
    },

    "The parsed lyrics are returned in an object": function(err, response){
      assert.ok(!err);
      assert.ok(!(response instanceof Error));
      assert.ok(response instanceof Lyrics.Lyrics);
      assert.deepEqual(response.songId, 75426);
      assert.deepEqual(response.songTitle, "Born to Run");
      assert.deepEqual(response.mainArtist, "Bruce Springsteen");
      assert.deepEqual(response.producingArtists, []);
      assert.deepEqual(response.featuringArtists, []);
      assert.ok(response.sections.length > 0);
      assert.deepEqual(response.sections[0].name, "[Empty Section]");
      assert.ok(/^In the day we sweat it out in the streets of a.*/.test(response.sections[0].verses[0].content));
    }
  }


}).run();
