/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['commons/utils', 'webjars!knockout', 'commons/settings'],
    function(utils, ko, settings) {
  var navigationOpened = settings.observable("app.navigationOpened", true);

  var navigation = utils.Singleton({
    init: function() {
      this.navigationOpened = navigationOpened;
      this.sneak = ko.observable(false);
      this.sneakTimer = 0;
    },
    toggle: function() {
      navigationOpened(!navigationOpened());
      this.sneak(navigationOpened());
    },
    sneakOn: function() {
      if (!navigationOpened()) {
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
