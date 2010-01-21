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
      
    if (!KindaPlayer.ready)
      element.addClass('kinda-player-waiting');
    
    return element;
  },
  
  // builds the player box
  buildBox: function() {
    this.boxEl = $E('div', {'class': 'kinda-player-box'});
    
    this.boxEl.insert([
      this.buildStatus(),
      this.buildButtons()
    ]);
    
    return this.boxEl;
  },
  
  // builds the loading/playing status bar
  buildStatus: function() {
    this.statusTextEl = $E('div', {'class': 'kinda-player-status-text'});
    this.statusPlayEl = $E('div', {'class': 'kinda-player-status-play'});
    this.statusLoadEl = $E('div', {'class': 'kinda-player-status-load'});
    
    return $E('div', {'class': 'kinda-player-status'})
      .insert([this.statusLoadEl, this.statusPlayEl, this.statusTextEl]);
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
  
  // builds the playlist element
  buildList: function() {
    return this.listEl = $E('ul', {'class': 'kinda-player-list'});
    
    
    
    return this.listEl;
  },
  
  // repopulates the playlist
  rebuildList: function() {
    this.listEl.clean();
    
    this.playlist.each(function(song) {
      this.listEl.insert($E('li', { html: song.title }));
    }, this);
    
    return this;
  }
});
