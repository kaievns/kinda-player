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
  <tr><td>minVolume</td>    <td>20</td>     <td>minimal sound volume</td></tr>
  <tr><td>maxVolume</td>    <td>150</td>    <td>maximal sound volume</td></tr>
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
* volume_change

You can work with them in any standard way of [how RightJS deal with events](http://rightjs.org/tutorials/uniformed-events-handling)

## API-Reference

<table>
  <tr><th>Method</th><th>Description</th></tr>
  <tr><td>select(index)</td><td>Selects a track out of the playlist</td></tr>
  <tr><td>play(index)</td><td>Starts to play the track</td></tr>
  <tr><td>pause()</td><td>Pauses the playback</td></tr>
  <tr><td>toggle()</td><td>Toggles playback pause</td></tr>
  <tr><td>stop()</td><td>Stops the playback</td></tr>
  <tr><td>next()</td><td>Starts to play the next track</td></tr>
  <tr><td>prev()</td><td>Starts to play the previous track</td></tr>
  <tr><td>mute()</td><td>Toggles the sound</td></tr>
  <tr><td>setVolume(int)</td><td>Sets the sound volume (0..100)</td></tr>
  <tr><td>setPosition(int)</td><td>Sets the playback position in percents (0..100)</td></tr>
  <tr><td>setPlaylist(mixed)</td><td>Sets the playlist tracks</td></tr>
  <tr><td>addToList(url[, title])</td><td>Appends a track to the playlist</td></tr>
  <tr><td>insertTo(element[, position])</td><td>Inserts the player into the given element</td></tr>
  <tr><td>showAt(element)</td><td>Shows the player as a popup at the given element</td></tr>
  <tr><td>hide()</td><td>Hides a popup player</td></tr>
</table>

## Style Adjustments

For the style adjustments reference see the elements structure description inside of
the `src/kinda_player.css` file.

## Dark Theme

To apply the dark theme on the player, just copy the `src/kinda_player_dark.css` file
into your stylesheets directory and include it on your page the usual way


## Building the source

To build the source I use [FrontCompiler](http://github.com/MadRabbit/frontcompiler) the Ruby based
JavaScript compression tool. Therefore you need to have Ruby environment and the [FrontCompiler](http://gemcutter.org/gems/front-compiler)
installed. After that just say

    rake build

And grab the build at the `build/` directory

## License

This project uses the [SoundManager2](http://github.com/scottschiller/SoundManager2)
project engine and released under terms of modified BSD-license

