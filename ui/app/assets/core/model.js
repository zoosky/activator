/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['webjars!knockout', './router', 'commons/settings', 'plugins/tutorial/tutorial', 'widgets/log/log'], function(ko, router, settings, Tutorial, log) {
  // Model for the whole app view; created in two parts
  // so that this first part is available during construction
  // of the second part.
  return {
    plugins: null, // filled in by init
    router: router,
    tutorial: new Tutorial(),
    snap: {
      test: function(a,b,c,d){
        console.log(">>>>",a,b,c,d);
      },
      activeWidget: ko.observable(""),
      navigationOpened: ko.observable( settings.get("app.navigationOpened", true) ),
      pannelOpened: ko.observable( settings.get("app.pannelOpened", false) ),
      pannelShape: ko.observable( settings.get("app.pannelShape", "right1") ),
      pageTitle: ko.observable(),
      // TODO load last value from somewhere until we get a message from the iframe
      signedIn: ko.observable(false),
      app: {
        name: ko.observable(window.serverAppModel.name ? window.serverAppModel.name : window.serverAppModel.id),
        hasAkka: ko.observable(false),
        hasPlay: ko.observable(false),
        hasConsole: ko.observable(false)
      },
      toggleNavigation: function(){
        this.snap.navigationOpened(!this.snap.navigationOpened());
        settings.set("app.navigationOpened", this.snap.navigationOpened());
      },
      togglePannel: function(){
        this.snap.pannelOpened(!this.snap.pannelOpened());
        settings.set("app.pannelOpened", this.snap.pannelOpened());
      }
    },
    logModel: new log.Log(),
    // This is the initialization of the application...
    init: function(plugins) {
      var self = this;
      self.widgets = [];
      self.plugins = plugins;
      // TODO - initialize plugins in a better way perhaps...
      $.each(self.plugins.list, function(idx,plugin) {
        self.router.registerRoutes(plugin.routes);
        $.each(plugin.widgets, function(idx, widget) {
          self.widgets.push(widget);
        });
      });
      self.router.init();
      ko.applyBindings(self, window.body);
    }
  };
});
