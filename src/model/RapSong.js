/**
 * Simple model class for a RapSong
 */

function RapSong(name, artists, link) {
  this.name = name;
  this.artists = artists;
  this.link = link;
}

RapSong.prototype = {
  name: "",
  artists: "",
  link: "",
  lyrics: null
}

module.exports = RapSong;