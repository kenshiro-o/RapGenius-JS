/**
 * Simple model objects representing the lyrics
 */


/**
 * Verses are lines from a song
 */
function Verses(id){
  this.id = id;
}

Verses.prototype = {
  id: -1,
  content: "",
  explanation: ""
};

Verses.prototype.addContent = function(content){
  this.content += content;
};


module.exports.Verses = Verses;


/**
 * A section comprises multiple verses
 */
function Section(name){
  this.name = name;
  this.verses = [];
}

Section.prototype = {
  name: "",
  verses: null
};

Section.prototype.addVerses = function(verses){
  this.verses.push(verses);
};


module.exports.Section = Section;


/**
 * Lyrics represents a collection of sections,
 * which in turn contain a collection of verses
 */
function Lyrics(id){
  this.songId = id;
  this.sections = [];
}

Lyrics.prototype = {
  songId: -1,
  songTitle: "",
  mainArtist: "",
  featuringArtists: [],
  producingArtists: [],
  sections: null
};

Lyrics.prototype.addSection = function(section){
  this.sections.push(section);
};

Lyrics.prototype.getFullLyrics = function (withSectionNames){
  var fullLyrics = "";
  this.sections.forEach(function(section, index){
    fullLyrics += ((withSectionNames) ? section.name + "\n" : "" );
    section.verses.forEach(function(verses, index){
      var separation = "";
      //This is to make sure we don't have bits of lyrics that are stuck together
      //as opposed to being separated by a space
      if (/[A-Za-z0-9]/.test(fullLyrics.charAt(fullLyrics.length - 1))){
        separation = " ";
      }
      fullLyrics += separation + verses.content;
    });
  });

  return fullLyrics;
};

Lyrics.prototype.addExplanations = function(explanations){
  this.sections.forEach(function(section){
    section.verses.forEach(function(verse){
      var explanation = explanations[verse.id];
      if(explanation){
        verse.explanation = explanation;
      }
    });
  });
};


module.exports.Lyrics = Lyrics;