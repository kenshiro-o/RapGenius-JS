var rapgeniusClient = require("../src/geniusClient.js");

rapgeniusClient.searchArtist("GZA", "rap", function(err, artist){
  if(err){
    console.log("Error: " + err);
  }else{
    console.log("Rap artist found [name=%s, link=%s, popular-songs=%d]",
      artist.name, artist.link, artist.popularSongs.length);

  }
});

//Example for a rock artist
rapgeniusClient.searchArtist("Bruce Springsteen", "rock", function(err, artist){
  if(err){
    console.log("Error: " + err);
  }else{
    console.log("Rap artist found [name=%s, link=%s, popular-songs=%d]",
      artist.name, artist.link, artist.popularSongs.length);
  }
});