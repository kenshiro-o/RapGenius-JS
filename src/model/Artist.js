function Artist(name, link) {
  this.name = name;
  this.link = link;
  this.popularSongs = [];
  this.songs = [];
}

Artist.prototype = {
  name: "",
  link: "",
  popularSongs: null,
  songs: null
};

Artist.prototype.addPopularSong = function (rapSong) {
  this.popularSongs.push(rapSong);
};

Artist.prototype.addSong = function (rapSong) {
  this.songs.push(rapSong);
};


module.exports = Artist;