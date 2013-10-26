/**
 * Simple model objects representing the rap lyrics
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
 * RapLyrics represents a collection of sections,
 * which in turn contain a collection of verses
 */
function RapLyrics(id){
  this.songId = id;
  this.sections = [];
}

RapLyrics.prototype = {
  songId: -1,
  sections: null
};

RapLyrics.prototype.addSection = function(section){
  this.sections.push(section);
};

RapLyrics.prototype.getFullLyrics = function (withSectionNames){
  var fullLyrics = "";
  this.sections.forEach(function(section){
    fullLyrics += ((withSectionNames) ? section.name + "\n" : "" );
    section.verses.forEach(function(verses){
      fullLyrics += verses.content;
    });
  });

  return fullLyrics;
};

RapLyrics.prototype.addExplanations = function(explanations){
  this.sections.forEach(function(section){
    section.verses.forEach(function(verse){
      var explanation = explanations[verse.id];
      if(explanation){
        verse.explanation = explanation;
      }
    });
  });
};


module.exports.RapLyrics = RapLyrics;