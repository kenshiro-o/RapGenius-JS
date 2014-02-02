# RapGenius-JS [![Build Status](https://travis-ci.org/kenshiro-o/RapGenius-JS.png?branch=master)](https://travis-ci.org/kenshiro-o/RapGenius-JS)

  rapgenius-js is a simple client that enables you to query RapGenius(www.rapgenius.com) and retrieve
information about rap and rock artists and songs.

## Rationale

  This project was created because RapGenius do currently not support a node.js API.

## Installation

  $ npm install rapgenius-js

## Usage

  The API is very simple to use and currently enables you to perform the following:

### Model objects

#### Artist
    Artist
      - name: String
      - link: String
      - popularSongs: Array (of String)
      - songs: Array (of String)

#### Song
    Song
      - name: String
      - artists: String
      - link: String

#### Lyrics
    Verses
      - id: int
      - content: String
      - explanation: String

    Section
      - name: String
      - content: String
      - verses: Array (of Verses)

    Lyrics
      - songId: int
      - songTitle: String
      - mainArtist: String
      - featuringArtists: Array (of String)
      - producingArtists: Array (of String)
      - sections: Array (of Section)

### Search for an artist:

```js
var rapgeniusClient = require("rapgenius-js");

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
```

### Search for a song:

```js
var rapgeniusClient = require("rapgenius-js");

rapgeniusClient.searchSong("Liquid Swords", "rap", function(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    console.log("Songs that matched the search query were found" +
                "[songs-found=%d, first-song-name=%s", songs.length, songs[0].name);
  }
});
```

### Search for the lyrics of a song along with their meaning:

```js
var rapgeniusClient = require("rapgenius-js");

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
```


## Additional features

  I will work on the following features when I get the time:
- Refactor code base
- Improve performance

## Licence

MIT (Make It Tremendous)