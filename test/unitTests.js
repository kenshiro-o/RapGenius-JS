var StringUtils = require("./../src/util/StringUtils"),
    RapLyrics = require("./../src/model/RapLyrics"),
    vows = require("vows"),
    assert = require("assert");

vows.describe("Unit tests").addBatch({
  "When trimming a non string": {
    topic: function () {
      return StringUtils.trim({a: 2});
    },

    "Empty String is returned": function (topic) {
      assert.deepEqual(topic, "");
    }
  },

  "When trimming null": {
    topic: function () {
      return StringUtils.trim(null);
    },

    "Empty String is returned": function (topic) {
      assert.deepEqual(topic, "");
    }
  },

  "When trimming string ' ABC    '": {
    topic: function () {
      return StringUtils.trim(" ABC    ");
    },

    "The string 'ABC' is returned": function (topic) {
      assert.deepEqual(topic, "ABC");
    }
  },

  "When trimming string 'ABC '": {
    topic: function () {
      return StringUtils.trim("ABC ");
    },

    "The string 'ABC' is returned": function (topic) {
      assert.deepEqual(topic, "ABC");
    }
  },

  "When trimming string ' ABC'": {
    topic: function () {
      return StringUtils.trim(" ABC");
    },

    "The string 'ABC' is returned": function (topic) {
      assert.deepEqual(topic, "ABC");
    }
  }

}).addBatch({
    "When removing spaces and new lines from non string": {
      topic: function () {
        return StringUtils.removeWhiteSpacesAndNewLines({});
      },

      "An empty string is returned": function (topic) {
        assert.deepEqual(topic, "");
      }
    },

    "When removing spaces and new lines from null": {
      topic: function () {
        return StringUtils.removeWhiteSpacesAndNewLines(null);
      },

      "An empty string is returned": function (topic) {
        assert.deepEqual(topic, "");
      }
    },

    "When removing spaces and new lines from string '\\n  \\n  ABC   \\n '": {
      topic: function () {
        return StringUtils.removeWhiteSpacesAndNewLines("\n  \n  ABC   \n ");
      },

      "The string 'ABC' is returned": function (topic) {
        assert.deepEqual(topic, "ABC");
      }
    }
  }).addBatch({
    "When requesting full lyrics without section name":{
      topic: function(){
        var lyrics1 = "Man these tests put me on mad edge\n" +
                      "Wanna skip'em but gotta keep my pledge\n";
        var lyrics2 = "When I put this hat on to work some node\n" +
                      "I type keyboard bangin' to create some code\n";
        var sections = [];
        sections.push({name: "[Intro-1]\n", lyrics: lyrics1});
        sections.push({name: "[Intro-2]\n", lyrics: lyrics2});

        return new RapLyrics(sections);
      },

      "The full lyrics with no sections are returned" : function(topic){
        assert.ok(topic instanceof RapLyrics);
        var lyrics = "Man these tests put me on mad edge\n" +
                     "Wanna skip'em but gotta keep my pledge\n" +
                     "When I put this hat on to work some node\n" +
                     "I type keyboard bangin' to create some code\n";
        assert.deepEqual(topic.getFullLyrics(false), lyrics);
      }
    },

    "When requesting full lyrics with section name":{
      topic: function(){
        var lyrics1 = "Man these tests put me on mad edge\n" +
                      "Wanna skip'em but gotta keep my pledge\n";
        var lyrics2 = "When I put this hat on to work some node\n" +
                      "I type keyboard bangin' to create some code\n";
        var sections = [];
        sections.push({name: "[Intro-1]\n", lyrics: lyrics1});
        sections.push({name: "[Intro-2]\n", lyrics: lyrics2});

        return new RapLyrics(sections);
      },

      "The full lyrics with no sections are returned" : function(topic){
        assert.ok(topic instanceof RapLyrics);
        var lyrics = "[Intro-1]\n" +
                     "Man these tests put me on mad edge\n" +
                     "Wanna skip'em but gotta keep my pledge\n" +
                     "[Intro-2]\n" +
                     "When I put this hat on to work some node\n" +
                     "I type keyboard bangin' to create some code\n";
        assert.deepEqual(topic.getFullLyrics(true), lyrics);
      }
    }

  }).run();