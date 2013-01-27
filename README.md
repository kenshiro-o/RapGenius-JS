# RapGenius-JS

  rapgenius-js is a simple client that enables you to query RapGenius(wwww.rapgenius.com) and retrieve
information about rap artists and songs.

## Rationale

  This project was created because RapGenius do currently not support a node.js API.

## Installation

  $ npm install rapgenius-js

## Usage

  The API is very simple to use and currently enables you to perform the following:

1. Search for an artist:

```js
var geniusClient = require("geniusClient");

geniusClient.searchArtist("GZA", function(err, artist){
  if(err){
    console.log("Error: " + err);
  }else{
    console.log("Rap artist found [name=%s, link=%s, popular-songs=%d]",
                artist.name, artist.link, artist.popularSongs.length);

  }
});
```

2. Search for a song:

```js
var geniusClient = require("geniusClient");

geniusClient.searchSong("Liquid Swords", function(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    console.log("Songs that matched the search query were found" +
                "[songs-found=%d, first-song-name=%s"", songs.length, songs[0].name);
  }
});
```

3. Search for the lyrics of a song:

```js
var geniusClient = require("geniusClient");

var lyricsSearchCb = function(err, lyrics){
    if(err){
      console.log("Error: " + err);
    }else{
      //Printing lyrics with section names
      console.log("**** LYRICS *****\n%s", lyrics.getFullLyrics(true));
    }
};


var searchCallback = function(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    if(songs.length > 0){
      //We have some songs
      geniusClient.searchSongLyrics(songs[0].link, lyricsSearchCb);
    }
  }
};

geniusClient.searchSong("Liquid Swords", searchCallback);
```


## Additional features

  I will work on the following features when I get the time:
- Refactor code base
- Obtain explanation of song lyrics

## Licence

MIT (Make It Tremendous)