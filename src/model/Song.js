/**
 * Simple model class for a song
 */

function Song(name, artists, link) {
  this.name = name;
  this.artists = artists;
  this.link = link;
}

Song.prototype = {
  name: "",
  artists: "",
  link: "",
  lyrics: null
}

module.exports = Song;