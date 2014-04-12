var rapgeniusClient = require("../src/geniusClient");

rapgeniusClient.searchSong("Liquid Swords", "rap", function(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    console.log("Songs that matched the search query were found" +
      "[songs-found=%d, first-song-name=%s]", songs.length, songs[0].name);
  }
});