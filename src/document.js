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