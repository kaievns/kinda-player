/**
 * KindaPlayer main class
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
var KindaPlayer = new Class(Observer, {
  extend: {
    EVENTS: $w('play pause resume stop finish load error loading playing select mute unmute jump'),
    
    Options: {
      controls:     'prev play stop next mute list',
      
      showFx:       'fade',
      showDuration: 400,
      
      size:         'full',  // 'full' || 'mini'
      volume:        100,
      
      useID3:       true,   // will overwrite the titles when ID3 tags available
      loop:         true,   // automatically go the the next position when finished
      loopDealy:    4000,   // delay in ms between songs in a loop
      
      showPlaylist: null    // null for auto, or true|false to enforce
    },
    
    i18n: {
      prev: 'Previous Song',
      next: 'Next Song',
      play: 'Play/Pause',
      stop: 'Stop',
      mute: 'Mute/Unmute',
      list: 'Toggle playlist'
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
    this.element.insertTo(element, position);
    return this;
  },
  
  /**
   * Shows the player at the given element
   *
   * @param mixed element reference
   * @return KindaPlayer this
   */
  showAt: function(element) {
    this.element
      .moveTo($(element).position())
      .show(this.options.showFx, {
        duration: this.options.showDuration
      });
    
    return this;
  }
  
});