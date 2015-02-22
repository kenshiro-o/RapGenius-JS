var geniusClient = require("../src/geniusClient.js");

geniusClient.searchArtist("GZA", function(err, artist){
  if(err){
    console.log("Error: " + err);
  }else{
    console.log("Artist found [name=%s, link=%s, popular-songs=%d]",
      artist.name, artist.link, artist.popularSongs.length);

  }
});