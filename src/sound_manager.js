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