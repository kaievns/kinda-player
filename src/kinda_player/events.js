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