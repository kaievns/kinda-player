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
