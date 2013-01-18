var StringUtils = require("./../src/util/StringUtils"),
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


  }).run();