# KindaPlayer

KindaPlayer is a simple wrapper over the [SoundManager2](http://github.com/scottschiller/SoundManager2)
engine. It is implemented using the [RightJS](http://rightjs.org) JavaScript framework and
has the following features

* Simple, fully HTML/CSS based design
* Easily extensible OOP construction
* Can work as a standalone widget
* Can work as an auto-popup for links
* Follows RightJS UI conventions

## Examples

Pragmatical usage

    new KindaPlayer('/that/url.mp3', {
      controls: ['start', 'stop']
    });
    
Automatic links processing with popups

    <a href="/that/url.mp3" title="The Music" rel="kinda-player">Play me!</a>


## Options

Name         | Default                         | Description
-------------|---------------------------------|----------------------------------------
controls     | 'prev play stop next mute list' | the list and order of the control buttons
showFx       | 'fade'                          | popup version visual effect
showDuration | 400                             | popup version visual effect duration
size         | 'full'                          | 'full' or 'mini'
volume       | 100                             | initial sound volume
useID3       | true                            | will overwrite the titles when ID3 tags available
loop         | true                            | automatically go the the next position when finished
loopDealy    | 4000                            | delay in ms between songs in a loop
showPlaylist | null                            | null for auto, or true|false to enforce


## License

This project uses the [SoundManager2](http://github.com/scottschiller/SoundManager2)
project engine and released under terms of modified BSD-license

