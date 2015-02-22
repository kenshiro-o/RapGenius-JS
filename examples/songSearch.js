var geniusClient = require("../src/geniusClient");

geniusClient.searchSong("Liquid Swords", "GZA", function(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    console.log("Songs that matched the search query were found" +
      "[songs-found=%d, first-song-name=%s]", songs.length, songs[0].name);
  }
});