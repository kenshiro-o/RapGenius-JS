var StringUtils = require("./../src/util/StringUtils"),
  Lyrics = require("./../src/model/Lyrics"),
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

        var verse1 = new Lyrics.Verses(0);
        var verse2 = new Lyrics.Verses(0);
        verse1.addContent(lyrics1);
        verse2.addContent(lyrics2);

        var section1 = new Lyrics.Section("[Intro-1]\n");
        var section2 = new Lyrics.Section("[Intro-2]\n");
        section1.addVerses(verse1);
        section2.addVerses(verse2);

        var rapLyrics = new Lyrics.Lyrics(0);
        rapLyrics.addSection(section1);
        rapLyrics.addSection(section2);

        return rapLyrics;
      },

      "The full lyrics with no sections are returned" : function(topic){
        assert.ok(topic instanceof Lyrics.Lyrics);
        var lyrics = "Man these tests put me on mad edge\n" +
                     "Wanna skip'em but gotta keep my pledge\n" +
                     "When I put this hat on to work some node\n" +
                     "I type keyboard bangin' to create some code\n";
        assert.deepEqual(topic.getFullLyrics(false), lyrics);
      }
    },

    "When requesting full lyrics with section names":{
      topic: function(){
        var lyrics1 = "Man these tests put me on mad edge\n" +
                      "Wanna skip'em but gotta keep my pledge\n";
        var lyrics2 = "When I put this hat on to work some node\n" +
                      "I type keyboard bangin' to create some code\n";

        var verse1 = new Lyrics.Verses(0);
        var verse2 = new Lyrics.Verses(0);
        verse1.addContent(lyrics1);
        verse2.addContent(lyrics2);

        var section1 = new Lyrics.Section("[Intro-1]");
        var section2 = new Lyrics.Section("[Intro-2]");
        section1.addVerses(verse1);
        section2.addVerses(verse2);

        var rapLyrics = new Lyrics.Lyrics(0);
        rapLyrics.addSection(section1);
        rapLyrics.addSection(section2);

        return rapLyrics;
      },

      "The full lyrics with no sections are returned" : function(topic){
        assert.ok(topic instanceof Lyrics.Lyrics);
        var lyrics = "[Intro-1]\n" +
                     "Man these tests put me on mad edge\n" +
                     "Wanna skip'em but gotta keep my pledge\n" +
                     "[Intro-2]\n" +
                     "When I put this hat on to work some node\n" +
                     "I type keyboard bangin' to create some code\n";
        assert.deepEqual(topic.getFullLyrics(true), lyrics);
      }
    },

    "When adding explanation to lyrics": {
      topic: function(){
        var lyrics1 = "Man these tests put me on mad edge\n" +
                      "Wanna skip'em but gotta keep my pledge\n";
        var lyrics2 = "When I put this hat on to work some node\n" +
                      "I type keyboard bangin' to create some code\n";

        var verse1 = new Lyrics.Verses(1);
        var verse2 = new Lyrics.Verses(2);
        verse1.addContent(lyrics1);
        verse2.addContent(lyrics2);

        var section1 = new Lyrics.Section("[Intro-1]\n");
        var section2 = new Lyrics.Section("[Intro-2]\n");
        section1.addVerses(verse1);
        section2.addVerses(verse2);

        var rapLyrics = new Lyrics.Lyrics(0);
        rapLyrics.addSection(section1);
        rapLyrics.addSection(section2);

        var explanations = {"1": "I am talking about these unit tests driving me crazy",
                            "2": "But when I wear my productivity hat, I ship some code quick"};
        rapLyrics.addExplanations(explanations);

        return rapLyrics;
      },

      "The verses contain the explanation": function(lyrics){
        assert.ok(lyrics instanceof Lyrics.Lyrics);
        assert.deepEqual(lyrics.sections[0].verses[0].explanation, "I am talking about these unit tests driving me crazy");
        assert.deepEqual(lyrics.sections[1].verses[0].explanation, "But when I wear my productivity hat, I ship some code quick");
      }
    }

  }).run();