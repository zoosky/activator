/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['commons/utils', 'webjars!knockout', 'commons/settings'],
    function(utils, ko, settings) {
  settings.register("app.navigationOpened", true);

  var navigation = utils.Singleton({
    init: function() {
      this.sneak = ko.observable(false);
      this.sneakTimer = 0;
    },
    toggle: function() {
      settings.app.navigationOpened(!settings.app.navigationOpened());
      this.sneak(settings.app.navigationOpened());
    },
    sneakOn: function() {
      if (!settings.app.navigationOpened()) {
        this.sneak(true);
      }
    },
    sneakShow: function() {
      clearTimeout(this.sneakTimer);
    },
    sneakHide: function() {
      var self = this;
      self.sneakTimer = setTimeout(function(){
        self.sneak(false);
      }, 500);
    }
  });
  return navigation;
});
