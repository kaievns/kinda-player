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
