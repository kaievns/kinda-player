/**
 * Here is where we are connecting all the stuff together
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
KindaPlayer.include((function() {
  var old_initialize = KindaPlayer.prototype.initialize;
  
  var find_index_for_element = function(element) {
    return element.parent().subNodes('li').indexOf(element);
  };
  
  var find_index_for_event = function(event) {
    if (event.target && event.target.tagName == 'LI') {
      return find_index_for_element(event.target);
    }
    return null;
  };
  
  
return {
  
  /**
   * Wrappint up the original constructor and connecting events in here
   *
   */
  initialize: function() {
    old_initialize.apply(this, arguments);
    
    // catching the playlist clicks
    this.listEl.on({
      click: function(event) {
        var index = find_index_for_event.call(this, event);
        if (index !== null) this.select(index);
      }.bind(this),
      
      dblclick: function(event) {
        var index = find_index_for_event.call(this, event);
        if (index !== null) this.play(index);
      }.bind(this)
    });
    
    // connecting the buttons
    this.prevButton.onClick(this.prev.bind(this));
    this.nextButton.onClick(this.next.bind(this));
    this.playButton.onClick(this.toggle.bind(this));
    this.stopButton.onClick(this.stop.bind(this));
    this.muteButton.onClick(this.mute.bind(this));
    this.listButton.onClick(this.toggleList.bind(this));
    
    // connecting the internal events
    this.on({
      select: function(index) {
        this.liById(index).radioClass('kinda-player-list-selected');
      },
      
      play: function() {
        this.element.addClass('kinda-player-playing');
      },
      
      pause: function() {
        this.element.removeClass('kinda-player-playing');
      },
      
      stop: function() {
        this.element.removeClass('kinda-player-playing');
      },
      
      finish: function() {
        if (this.options.loop) this.next();
      },
      
      mute: function() {
        this.element.addClass('kinda-player-muted');
      },
      
      unmute: function() {
        this.element.removeClass('kinda-player-muted');
      }
    });
    
    // selecting the first item by default
    this.select(0);
  },
  
  fire: function(name, index) {
    return this.$super(name, isNumber(index) ? index : this.current);
  },
  
// protected
  
  toggleList: function() {
    var visible = this.listEl.visible();
    this.listEl[visible ? 'hide' : 'show']('slide');
    this.element[visible ? 'addClass' : 'removeClass']('kinda-player-nolist');
  },
  
  // returns the playlist item element by its index
  liById: function(index) {
    return this.listEl.subNodes('li')[index];
  }
  
  
  
}})());