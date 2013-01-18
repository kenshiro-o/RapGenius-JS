function RapArtist(name, link) {
  this.name = name;
  this.link = link;
}

RapArtist.prototype = {
  name: "",
  link: "",
  popularSongs: [],
  songs: []
};

RapArtist.prototype.addPopularSong = function (rapSong) {
  this.popularSongs.push(rapSong);
};

RapArtist.prototype.addSong = function (rapSong) {
  this.songs.push(rapSong);
};


module.exports = RapArtist;