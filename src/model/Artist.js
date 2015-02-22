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

Artist.prototype.addPopularSong = function (song) {
  this.popularSongs.push(song);
};

Artist.prototype.addSong = function (song) {
  this.songs.push(song);
};


module.exports = Artist;