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

* comming
* soon


## License

This project uses the [SoundManager2](http://github.com/scottschiller/SoundManager2)
project flash engine and released under terms of modified BSD-license

