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