/**
 * KindaPlayer is a simple HTML/CSS based music-player
 *
 * http://github.com/MadRabbit/kinda-player
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
/**
 * KindaPlayer main class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var KindaPlayer = new Class(Observer, {
  extend: {
    EVENTS: $w('play pause resume stop finish load error loading playing select mute unmute jump volume_change'),
    
    Options: {
      controls:     'prev play stop next mute list volume',
      
      showFx:       'fade',
      showDuration: 400,
      
      scrollFx:     true,    // a marker if it show the scrolling fx in the currrent title
      
      size:         'full',  // 'full' || 'mini'
      volume:        100,
      minVolume:      20,
      maxVolume:     150,
      
      useID3:       true,   // will overwrite the titles when ID3 tags available
      loop:         true,   // automatically go the the next position when finished
      loopDealy:    4000,   // delay in ms between songs in a loop
      
      showPlaylist: true,    // show or not the playlist by default
      
      popupLinks:   'a[rel^=kinda-player]',       // css-rule for hijackable links
      albumLinks:   'a[rel^=kinda-player-album]', // css-rule for hijackable links of albums
      
      autoplay:     false   // automatically start playing popup-players
    },
    
    i18n: {
      prev:   'Previous Song',
      next:   'Next Song',
      play:   'Play/Pause',
      stop:   'Stop',
      mute:   'Mute/Unmute',
      volume: 'Volume',
      list:   'Toggle playlist',
      close:  'Close the player'
    },
    
    ready: false,
    index: []
  },
  
  /**
   * Basic constructor
   *
   * @param mixed a string url, or an array of urls
   * @param Object options
   */
  initialize: function(source, options) {
    this.$super(options);
    this.element = this.build();
    this.setPlaylist(source);
    
    // we need to keep the index of players coz SoundManager might be ain't ready
    KindaPlayer.index.push(this);
  },
  
  /**
   * Inserts this player element into the given one
   *
   * @param mixed element reference
   * @param String optional position
   * @return KindaPlayer this
   */
  insertTo: function(element, position) {
    this.element
      .removeClass('kinda-player-popup')
      .insertTo(element, position);
    return this;
  },
  
  /**
   * Shows the player at the given element
   *
   * @param mixed element reference
   * @return KindaPlayer this
   */
  showAt: function(element) {
    if (KindaPlayer.popup && KindaPlayer.popup !== this) KindaPlayer.popup.hide();
    
    this.element
      .addClass('kinda-player-popup')
      .addClass('kinda-player-nolist')
      .insertTo(document.body)
      .moveTo($(element).position())
      .show(this.options.showFx, {
        duration: this.options.showDuration
      });
    
    this.listEl.hide();
    
    return KindaPlayer.popup = this;
  },
  
  /**
   * Hides the player popup
   *
   * @return KindaPlayer this
   */
  hide: function() {
    if (this.element.hasClass('kinda-player-popup') && this.element.visible()) {
      this.stop().element.hide(this.options.showFx, {
        duration: this.options.showDuration
      });
      KindaPlayer.popup = null;
    }
    
    return this;
  }
  
});


/**
 * This module contains the UI builder
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
KindaPlayer.include({
  
// protected
  
  build: function() {
    var element = $E('div', { 'class': 'kinda-player' })
      .insert([ this.buildBox(), this.buildList() ]);
    
    if (this.options.size == 'mini')
      element.addClass('kinda-player-mini');
      
    if (!this.options.showPlaylist)
      element.addClass('kinda-player-nolist');
      
    if (!KindaPlayer.ready)
      element.addClass('kinda-player-waiting');
      
    this.closeButton = $E('div', {
      html: '&times;', 'class': 'kinda-player-button-close', title: KindaPlayer.i18n.close
    }).insertTo(element, 'top').onClick(this.hide.bind(this));
    
    return element;
  },
  
  // builds the player box
  buildBox: function() {
    this.boxEl = $E('div', {'class': 'kinda-player-box'});
    
    this.boxEl.insert([
      this.buildStatus(),
      this.buildButtons(),
      this.buildVolume()
    ]);
    
    return this.boxEl;
  },
  
  // builds the loading/playing status bar
  buildStatus: function() {
    this.statusLineEl = $E('div', {'class': 'kinda-player-status-line'});
    this.statusLoadEl = $E('div', {'class': 'kinda-player-status-load'});
    this.statusPlayEl = $E('div', {'class': 'kinda-player-status-play'});
    this.statusTextEl = $E('div', {'class': 'kinda-player-status-text'});
    this.statusTimeEl = $E('div', {'class': 'kinda-player-status-time'});
    
    if (this.options.scrollFx)
      this.scrollingFx(this.statusTextEl);
    
    return this.statusEl = $E('div', {'class': 'kinda-player-status'})
      .insert([this.statusTextEl, this.statusTimeEl,
        this.statusLineEl.insert([this.statusLoadEl, this.statusPlayEl])]
      );
  },
  
  // builds the navigation buttons block
  buildButtons: function() {
    this.prevButton = $E('input', {type: 'button', value: '', 'class': 'kinda-player-button-prev', title: KindaPlayer.i18n.prev});
    this.nextButton = $E('input', {type: 'button', value: '', 'class': 'kinda-player-button-next', title: KindaPlayer.i18n.next});
    this.playButton = $E('input', {type: 'button', value: '', 'class': 'kinda-player-button-play', title: KindaPlayer.i18n.play});
    this.stopButton = $E('input', {type: 'button', value: '', 'class': 'kinda-player-button-stop', title: KindaPlayer.i18n.stop});
    this.muteButton = $E('input', {type: 'button', value: '', 'class': 'kinda-player-button-mute', title: KindaPlayer.i18n.mute});
    this.listButton = $E('input', {type: 'button', value: '', 'class': 'kinda-player-button-list', title: KindaPlayer.i18n.list});
    
    
    
    return $E('div', {'class': 'kinda-player-buttons'})
      .insert($w(this.options.controls).map(function(name) {
        return this[name+'Button'];
      }, this).compact())
  },
  
  // builds the volume control bar
  buildVolume: function() {
    this.volumeControl = $E('div', {'class': 'kinda-player-volume-control'});
    this.volumeBar     = $E('div', {'class': 'kinda-player-volume-bar', title: KindaPlayer.i18n.volume});
    
    this.updateVolumeBar(this.options.volume);
    
    return this.volumeControl.insert([
      $E('div', {'class': 'kinda-player-volume-bar-bg'}),
      this.volumeBar
    ]);
  },
  
  // builds the playlist element
  buildList: function() {
    return this.listEl = $E('ul', {'class': 'kinda-player-list'});
  },
  
  // repopulates the playlist
  rebuildList: function() {
    this.listEl.clean();
    
    this.playlist.each(function(song) {
      this.listEl.insert($E('li', { html: song.title }));
    }, this);
    
    [this.prevButton, this.nextButton].each(this.playlist.length < 2 ? 'disable' : 'enable');
    
    return this;
  },
  
  // creates a simple scrolling fx for the element
  scrollingFx: function(element) {
    (function() {
      if (!element.scroll_direction) element.scroll_direction = 1;
      var current_scroll = element.scrollLeft;
      var new_scroll     = current_scroll + element.scroll_direction * 1;
      
      element.scrollLeft = new_scroll;
      
      if (element.scrollLeft == current_scroll) {
        element.scroll_direction *= -1;
      }
      
    }).periodical(400);
  },
  
  // updates the volume-bar size
  updateVolumeBar: function(value) {
    var options = this.options;
    this.volumeBar.style.width = ((value - options.minVolume) / (options.maxVolume - options.minVolume) * 100).round() + '%';
  }
});



/**
 * This module contains the code related to the playlist navigation
 * and playback controls
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
KindaPlayer.include({
  /**
   * Creats a new playlist
   *
   * USAGE:
   *   setPlaylist('/som/url.mp3');
   *   setPlaylist(['file1.mp3', 'file2.mp3']);
   *   setPlaylist({
   *     'file1.mp3': "File one title",
   *     'file2.mp3': "File two title"
   *   });
   *
   * @param mixed playlist items
   * @return KindaPlayer this
   */
  setPlaylist: function(source) {
    this.playlist = [];

    if (isString(source)) source = [source];
    
    if (isArray(source)) {
      for (var i=0; i < source.length; i++)
        this.addToList(source[i]);
    } else if (isHash(source)) {
      for (var addr in source)
        this.addToList(addr, source[addr]);
    }
    
    return this;
  },
  
  /**
   * Adds an item to the playlist
   *
   * @param String file url address
   * @param String optional title
   * @return KindaPlayer this
   */
  addToList: function(url, title) {
    if (!this.playlist) this.playlist = [];
    
    this.playlist.push(this.initSound({
      id:    'p'+KindaPlayer.index.length + '_'+ url.replace(/[^a-z0-9]/g, '_'),
      url:   url,
      title: title || decodeURIComponent(url.split('/').last())
    }));
    
    return this.rebuildList();
  },
  
  /**
   * Selects the item out of the playlist
   *
   * @param Integer playlist index
   * @return KindaPlayer this
   */
  select: function(index) {
    if (this.playlist[index]) {
      var prev_index   = this.current;
      this.current     = index;
      this.currentItem = this.playlist[index];
      
      if (prev_index != index)
        this.fire('select');
    }
    
    return this;
  },
  
  /**
   * Starts playing the song by the index at the playlist
   *
   * @param Integer index
   * @return KindaPlayer this
   */
  play: function(index) {
    if (this.playing) this.playing.sound.stop();
    
    var item = this.select(index).currentItem;
    if (item && item.sound) {
      var event = 'play';
      
      this.setVolume(this.options.volume);
      
      if (item.sound.paused) {
        item.sound.resume();
        event = 'resume';
      } else {
        item.sound.setPosition(0);
        item.sound.play();
      }
      
      this.playing = item;
      this.fire(event);
    }
    
    return this;
  },
  
  /**
   * Pauses a playing song
   *
   * @return KindaPlayer this
   */
  pause: function() {
    if (this.playing) {
      this.playing.sound.pause();
      this.playing = false;
      this.fire('pause');
    }
    return this;
  },
  
  /**
   * Toggles the play/pause state on the current item
   *
   * @return KindaPlayer this
   */
  toggle: function() {
    return this.playing ? this.pause() : this.play(this.current || 0);
  },
  
  /**
   * Stops the current playback
   *
   * @return KindaPlayer this
   */
  stop: function() {
    if (this.playing) {
      this.playing.sound.stop();
      this.playing = false;
      this.fire('stop');
    }
    return this;
  },
  
  /**
   * starts to play the next song on the list
   *
   * @return KindaPlayer this
   */
  next: function() {
    return this.play((defined(this.current) && this.playlist[this.current+1]) ? this.current+1 : 0);
  },
  
  /**
   * Starts to play the previous song on the list
   *
   * @return KindaPlayer this
   */
  prev: function() {
    return this.play((defined(this.current) && this.playlist[this.current-1]) ? this.current-1 : this.playlist.length-1);
  },
  
  /**
   * Mutes/unmutes the player
   *
   * @return KindaPlayer this
   */
  mute: function() {
    var item = this.currentItem;
    if (item) {
      var event = item.sound.muted ? 'unmute' : 'mute';
      item.sound[event]();
      this.fire(event);
    }
    
    return this;
  },
  
  /**
   * Sets the volume
   *
   * @param Integer volume 0..100
   * @return KindaPlayer this
   */
  setVolume: function(volume) {
    if (isNumber(volume) && this.currentItem) {
      var options = this.options, item = this.currentItem, old_volume = options.volume;
      
      if (volume < options.minVolume) volume = options.minVolume;
      if (volume > options.maxVolume) volume = options.maxVolume;
      
      if (item.sound) {
        old_volume = item.sound.volume;
        item.sound.setVolume(volume);
      }
      
      options.volume = volume;
      this.updateVolumeBar(volume);
      
      if (old_volume != volume) {
        this.fire('volume_change', volume);
      }
    }
    
    return this;
  },
  
  /**
   * Sets the current track position
   *
   * @param Integer position 0..100
   * @return KindaPlayer this
   */
  setPosition: function(position) {
    if (isNumber(position) && this.currentItem) {
      if (position < 0)   position = 0;
      if (position > 100) position = 100;
      
      var track = this.currentItem.sound;
      var duration = track.loaded ? track.duration : track.durationEstimate;
      
      if (duration !== undefined)
        track.setPosition(duration * position);
      
      this.fire('jump', position);
    }
    
    return this;
  },
  
  
  
// protected
  
  /**
   * Initalizes the sound-manager interface for the position
   *
   * @param Object playlist position
   * @return Object playlist position
   */
  initSound: function(item) {
    if (KindaPlayer.ready) {
      
      var callback_wrap = function(player, name, item) {
        if (item)  player.fire(name, player.playlist.indexOf(item));
      };
      
      item.sound = soundManager.createSound({
        id:           item.id,
        url:          item.url,
        ondataerror:  callback_wrap.curry(this, 'error',   item),
        onfinish:     callback_wrap.curry(this, 'finish',  item),
        onload:       callback_wrap.curry(this, 'load',    item),
        onpause:      callback_wrap.curry(this, 'pause',   item),
        onplay:       callback_wrap.curry(this, 'play',    item),
        onresume:     callback_wrap.curry(this, 'resume',  item),
        onstop:       callback_wrap.curry(this, 'stop',    item),
        whileloading: callback_wrap.curry(this, 'loading', item),
        whileplaying: callback_wrap.curry(this, 'playing', item),
        onid3:        this.updateID3.bind(this,            item)
      });
    }
    
    return item;
  },
  
  
  updateID3: function(item) {
    var index = this.playlist.indexOf(item);
    var id3   = item.sound.id3;
    var title = id3.songname;
    
    if (title && id3.artist)
      title += " by "+id3.artist;
    
    item.title = title;
    
    this.listEl.subNodes('li')[index].update(title);
    if (index === this.current) this.statusTextEl.update(title);
  }
  
});



/**
 * Here is where we are connecting all the stuff together
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
KindaPlayer.include((function() {
  var old_initialize = KindaPlayer.prototype.initialize;
  
return {
  
  /**
   * Wrappint up the original constructor and connecting events in here
   *
   */
  initialize: function() {
    old_initialize.apply(this, arguments);
    
    // catching the playlist clicks
    this.listEl.onClick(function(event) {
      var index = this.listEl.subNodes('li').indexOf(event.target);
      if (index > -1) this.play(index);
    }.bind(this));
    
    // statusbar/repositioning clicks
    this.statusLineEl.onClick(function(event) {
      if (this.currentItem) {
        var dims = this.statusLineEl.dimensions();
        this.play().setPosition((event.position().x - dims.left) / dims.width);
      }
    }.bind(this));
    
    // connecting the buttons
    this.prevButton.onClick(this.prev.bind(this));
    this.nextButton.onClick(this.next.bind(this));
    this.playButton.onClick(this.toggle.bind(this));
    this.stopButton.onClick(this.stop.bind(this));
    this.muteButton.onClick(this.mute.bind(this));
    this.listButton.onClick(this.toggleList.bind(this));
    
    // connecting the volume bar
    this.volumeControl.onClick(this.updateVol.bind(this));
    
    // connecting the internal events
    this.on({
      select:  function(index) {
        this.liById(index).radioClass('kinda-player-list-selected');
        if (!this.playing) {
          this.statusTextEl.update(this.currentItem.title);
          this.statusTimeEl.update('0:00/0:00');
        }
      },
      play:    function() {
        this.element.addClass('kinda-player-playing');
        this.statusTextEl.update(this.currentItem.title);
      },
      pause:   function() { this.element.removeClass('kinda-player-playing'); },
      stop:    function() { this.element.removeClass('kinda-player-playing'); },
      finish:  function() {
        this.element.removeClass('kinda-player-playing');
        if (this.options.loop && this.playlist.length > 1)
          this.next.bind(this).delay(this.options.loopDealy);
      },
      mute:    function() { this.element.addClass('kinda-player-muted');      },
      unmute:  function() { this.element.removeClass('kinda-player-muted');   },
      loading: function(index) { this.updateStatus(index) },
      playing: function(index) { this.updateStatus(index) }
    });
    
    // selecting the first item by default
    this.select(0);
  },
  
  fire: function(name, index) {
    return this.$super(name, isNumber(index) ? index : this.current);
  },
  
// protected
  
  // returns the playlist item element by its index
  liById: function(index) {
    return this.listEl.subNodes('li')[index];
  },
  
  // toggles the playlist visibility status
  toggleList: function() {
    var visible = this.listEl.visible();
    this.listEl[visible ? 'hide' : 'show']('slide');
    this.element[visible ? 'addClass' : 'removeClass']('kinda-player-nolist');
  },
  
  // updates the status bar
  updateStatus: function(index) {
    if (index === this.current) {
      var track = this.playlist[index].sound;
      var duration = track.loaded ? track.duration : track.durationEstimate;
      var position = track.position;
      
      this.statusPlayEl.style.width = (position / duration * 100).round() + '%';
      this.statusLoadEl.style.width = (track.bytesLoaded / track.bytesTotal * 100).round() + '%';
      
      this.statusTimeEl.update(this.formatTime(position) + '/' + this.formatTime(duration));
    }
  },
  
  // formats the time
  formatTime: function(ms) {
    var time = (ms / 1000).round(), seconds = time % 60;
    return (time/60).floor() + ":" + (seconds > 9 ? '' : '0') + seconds;
  },
  
  updateVol: function(event) {
    var options = this.options, bar_dims = this.volumeControl.dimensions();
    var value = (event.position().x - bar_dims.left) / bar_dims.width;
    
    this.setVolume(options.minVolume + (options.maxVolume - options.minVolume) * value);
  }
  
  
  
}})());


/**
 * The sound-manager scripts on-ready hook
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */

soundManager.onready(function() {
  KindaPlayer.ready = true;
  KindaPlayer.index.each(function(player) {
    player.playlist.each(function(item) {
      player.initSound(item);
    });
    player.element.removeClass('kinda-player-waiting');
  })
});


/**
 * There are some document level hooks that helps to hijack the links
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
$(document.documentElement).onClick(function(event) {
  var target = $(event.target);
  
  if (target && target.parents().length) {
    if (target.match(KindaPlayer.Options.popupLinks)) {
      event.stop();

      var links = target.match(KindaPlayer.Options.albumLinks) ?
        $$(KindaPlayer.Options.albumLinks) : [target];

      var track_num = links.indexOf(target);

      var playlist  = {};
      links.each(function(link) {
        playlist[link.href] = link.innerHTML;
      });

      var player = new KindaPlayer(playlist)
        .select(track_num).showAt(target);

      if (KindaPlayer.Options.autoplay)
        player.play.bind(player, track_num)
          .delay(KindaPlayer.Options.showDuration + 100);

    } else if (KindaPlayer.popup) {
      var parents = target.parents();

      // if there is a click outside of opened popup we close it
      if (!parents.slice(0, parents.length-2).first('hasClass', 'kinda-player'))
        KindaPlayer.popup.hide();
    }
  } 
});


document.write("<style type=\"text/css\">div.kinda-player,div.kinda-player*{margin:0px;padding:0px;width:auto;height:auto;border:none;background:none;list-style:none}div.kinda-player{width:20em;-moz-border-radius:.24em;-webkit-border-radius:.24em}div.kinda-player-waiting{opacity:0.6;filter:alpha(opacity=60)}div.kinda-player-waiting*{cursor:default !important}div.kinda-player-box,ul.kinda-player-list{border:1px solid #BBB;background:#EEE;padding:.4em;position:relative;-moz-border-radius:.24em;-webkit-border-radius:.24em}div.kinda-player-status{position:relative;margin-bottom:.36em}div.kinda-player-status-line{position:relative;height:.4em;border:1px solid #AAA;-moz-border-radius:.2em;-webkit-border-radius:.2em;cursor:pointer;margin-top:.2em}div.kinda-player-status-play,div.kinda-player-status-load{position:absolute;width:0%;height:100%;background:#CCC;z-index:1;-moz-border-radius:.1em;-webkit-border-radius:.1em}div.kinda-player-status-play{background:#999;z-index:2}div.kinda-player-status-text{white-space:nowrap;overflow:hidden;padding:0 .2em;position:relative;z-index:3;margin-right:5.5em}div.kinda-player-status-time{position:absolute;top:0;right:.2em;white-space:nowrap;z-index:4}div.kinda-player-buttons{position:relative}div.kinda-player-buttons input{display:inline-block;*display:inline;*zoom:1;width:18px;height:18px;margin-right:2px;background-color:#CCC;background-image:url(./images/kinda_player_icons.png);background-repeat:no-repeat;border:1px solid #AAA;-moz-border-radius:.3em;-webkit-border-radius:.3em;cursor:pointer;opacity:0.7;filter:alpha(opacity=70)}div.kinda-player-buttons input:hover{opacity:1;filter:alpha(opacity=100)}div.kinda-player-buttons input:disabled,div.kinda-player-buttons input:disabled:hover{cursor:default;background-color:#BBB;opacity:0.3;filter:alpha(opacity=30)}input.kinda-player-button-prev{background-position:0px center}input.kinda-player-button-next{background-position:-16px center}input.kinda-player-button-play{background-position:-32px center}input.kinda-player-button-stop{background-position:-64px center}input.kinda-player-button-mute{background-position:-111px center}input.kinda-player-button-list{background-position:-80px center}div.kinda-player-muted input.kinda-player-button-mute{background-position:-127px center}div.kinda-player-playing input.kinda-player-button-play{background-position:-48px center}div.kinda-player-nolist input.kinda-player-button-list{background-position:-96px center}input.kinda-player-button-mute,input.kinda-player-button-list{position:absolute;top:0px;right:20px}input.kinda-player-button-list{right:0px}div.kinda-player div.kinda-player-volume-control{position:absolute;right:48px;bottom:.4em;width:32px;height:18px}div.kinda-player div.kinda-player-volume-bar,div.kinda-player div.kinda-player-volume-bar-bg{position:absolute;top:0;left:0;width:0%;height:100%;cursor:pointer;background:url(./images/kinda_player_icons.png)no-repeat -155px center}div.kinda-player div.kinda-player-volume-bar-bg{width:100%;opacity:0.2;filter:alpha(opacity=20)}ul.kinda-player-list{margin:0;padding:0;border-top:none;background-color:#F8F8F8;padding:0 .2em;overflow:hidden}ul.kinda-player-list li{padding:.2em;cursor:pointer;color:#444;white-space:nowrap;overflow:hidden}ul.kinda-player-list li:hover{background:#CCC;color:#000}ul.kinda-player-list li.kinda-player-list-selected{color:#000;font-weight:bold}div.kinda-player-mini div.kinda-player-box{padding:.2em}div.kinda-player-mini div.kinda-player-status{position:relative;margin-left:42px;margin-bottom:0}div.kinda-player-mini div.kinda-player-status-line{margin-top:0}div.kinda-player-mini div.kinda-player-buttons{position:absolute;top:.2em;left:.2em}div.kinda-player-mini div.kinda-player-buttons input{height:2.2em}div.kinda-player-mini input.kinda-player-button-prev,div.kinda-player-mini input.kinda-player-button-next,div.kinda-player-mini input.kinda-player-button-stop,div.kinda-player-mini input.kinda-player-button-list,div.kinda-player-mini div.kinda-player-volume-control,div.kinda-player-mini ul.kinda-player-list{display:none}div.kinda-player-mini input.kinda-player-button-mute{position:relative;right:auto}div.kinda-player-popup{position:absolute;display:none;z-index:9999;-moz-box-shadow:#888 .1em .2em .5em;-webkit-box-shadow:#888 .1em .2em .5em}div.kinda-player-button-close{font-weight:bold;cursor:pointer;width:10px;height:10px;color:#888;float:right;font-size:120%;margin-right:-14px;display:none;text-shadow:#CCC .1em .1em .1em}div.kinda-player-button-close:hover{color:#000}div.kinda-player-popup div.kinda-player-button-close{display:block}</style>");