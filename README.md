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
    
    new KindaPlayer([
      'url1.mp3',
      'url2.mp3',
      'url3.mp3'
    ]);
    
Automatic links processing with popups

    <a href="/that/url.mp3" title="The Music" rel="kinda-player">Play me!</a>


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
</table>


## License

This project uses the [SoundManager2](http://github.com/scottschiller/SoundManager2)
project engine and released under terms of modified BSD-license

