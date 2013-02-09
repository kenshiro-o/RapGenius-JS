function RapArtist(name, link) {
  this.name = name;
  this.link = link;
  this.popularSongs = [];
  this.songs = [];
}

RapArtist.prototype = {
  name: "",
  link: "",
  popularSongs: null,
  songs: null
};

RapArtist.prototype.addPopularSong = function (rapSong) {
  this.popularSongs.push(rapSong);
};

RapArtist.prototype.addSong = function (rapSong) {
  this.songs.push(rapSong);
};


module.exports = RapArtist;