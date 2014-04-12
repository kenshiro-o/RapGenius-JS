var rapgeniusClient = require("../src/geniusClient");

var lyricsSearchCb = function(err, lyricsAndExplanations){
  if(err){
    console.log("Error: " + err);
  }else{
    //Printing lyrics with section names
    var lyrics = lyricsAndExplanations.lyrics;
    var explanations = lyricsAndExplanations.explanations;
    console.log("Found lyrics for song [title=%s, main-artist=%s, featuring-artists=%s, producing-artists=%s]",
      lyrics.songTitle, lyrics.mainArtist, lyrics.featuringArtists, lyrics.producingArtists);
    console.log("**** LYRICS *****\n%s", lyrics.getFullLyrics(true));

    //Now we can embed the explanations within the verses
    lyrics.addExplanations(explanations);
    var firstVerses = lyrics.sections[0].verses[0];
    console.log("\nVerses:\n %s \n\n *** This means ***\n%s", firstVerses.content, firstVerses.explanation);
  }
};

var searchCallback = function(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    if(songs.length > 0){
      //We have some songs
      rapgeniusClient.searchLyricsAndExplanations(songs[0].link, "rap", lyricsSearchCb);
    }
  }
};

rapgeniusClient.searchSong("Liquid Swords", "rap", searchCallback);