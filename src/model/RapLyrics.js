/**
 * Simple model object representing the rap lyrics
 */

function RapLyrics(sections){
  this.sections = sections;
}

RapLyrics.prototype = {
  sections: []
};

RapLyrics.prototype.getFullLyrics = function (withSectionNames){
  var fullLyrics = "";
  this.sections.forEach(function(section){
    fullLyrics +=  ((withSectionNames) ? section.name : "" ) + section.lyrics;
  });

  return fullLyrics;
};

module.exports = RapLyrics;