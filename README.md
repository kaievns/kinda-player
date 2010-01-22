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

    var player = new KindaPlayer('/that/url.mp3', {
      controls: ['start', 'stop']
    });
    
    var player = new KindaPlayer([
      'url1.mp3',
      'url2.mp3',
      'url3.mp3'
    ]);
    
Automatic links processing with popups

    <a href="/that/url.mp3" rel="kinda-player">Play me!</a>

You also can create albums of links

    <a href="track1.mp3" rel="kinda-player-album">Track 1</a>
    <a href="track2.mp3" rel="kinda-player-album">Track 2</a>
    <a href="track3.mp3" rel="kinda-player-album">Track 3</a>


## Options

<table>
  <tr><th>Name</th>         <th>Default</th><th>Description</th></tr>
  <tr><td>controls</td>     <td>'prev play stop next mute list'</td><td>the list and order of the control buttons</td></tr>
  <tr><td>showFx</td>       <td>'fade'</td> <td>popup version visual effect</td></tr>
  <tr><td>showDuration</td> <td>400</td>    <td>popup version visual effect duration</td></tr>
  <tr><td>scrollFx</td>     <td>true</td>   <td>marker if it should show a scrolling fx on the title</td></tr>
  <tr><td>size</td>         <td>'full'</td> <td>'full' or 'mini'</td></tr>
  <tr><td>volume</td>       <td>100</td>    <td>initial sound volume</td></tr>
  <tr><td>useID3</td>       <td>true</td>   <td>will overwrite the titles when ID3 tags available</td></tr>
  <tr><td>loop</td>         <td>true</td>   <td>automatically go the the next position when finished</td></tr>
  <tr><td>loopDealy</td>    <td>4000</td>   <td>delay in ms between songs in a loop</td></tr>
  <tr><td>showPlaylist</td> <td>true</td>   <td>show or not the playlist by default</td></tr>
  <tr><td>popupLinks</td>   <td>'a[rel^=kinda-player]'</td>       <td>css-rule for hijackable links</td></tr>
  <tr><td>albumLinks</td>   <td>'a[rel^=kinda-player-album]'</td><td>css-rule for hijackable links of albums</td></tr>
  <tr><td>autoplay</td>     <td>false</td>  <td>automatically start playing popup-players</td></tr>
</table>

## Events

This player works with the following events

* play
* pause
* resume
* stop
* finish
* load
* error
* loading
* playing
* select
* mute
* unmute
* jump

You can work with them in any standard way of [how RightJS deal with events](http://rightjs.org/tutorials/uniformed-events-handling)

## Building the source

To build the source I use [FrontCompiler](http://github.com/MadRabbit/frontcompiler) the Ruby based
JavaScript compression tool. Therefore you need to have Ruby environment and the [FrontCompiler](http://gemcutter.org/gems/front-compiler)
installed. After that just say

    rake build

And grab the build at the `build/` directory

## License

This project uses the [SoundManager2](http://github.com/scottschiller/SoundManager2)
project engine and released under terms of modified BSD-license

