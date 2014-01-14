/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['webjars!knockout', './router', 'commons/settings', 'plugins/tutorial/tutorial', 'widgets/log/log', 'services/build', './keyboard', './omnisearch'],
    function(ko, router, settings, Tutorial, log, build, keyboard, omnisearch) {

  settings.register("app.navigationOpened", true);
  settings.register("app.panelOpened", false);
  settings.register("app.panelShape", "right1");

  // Model for the whole app view; created in two parts
  // so that this first part is available during construction
  // of the second part.
  return {
    plugins: null, // filled in by init
    router: router,
    tutorial: new Tutorial(),
    settings: settings,
    snap: {
      // TODO this needs to be removed after it's no longer used
      // in application.scala.html
      testCallBinding: function(a,b,c,d){
      },
      activeWidget: ko.observable(""),
      navigationSneak: ko.observable( false ),
      navigationSneakTimer: 0,
      panelDropdownActive: ko.observable(false),
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
        settings.app.navigationOpened(!settings.app.navigationOpened());
        this.snap.navigationSneak(settings.app.navigationOpened());
      },
      sneakNavigationOn: function(){
        if (!settings.app.navigationOpened()) {
          this.snap.navigationSneak(true);
        }
      },
      sneakNavigationShow: function(){
        clearTimeout(this.snap.navigationSneakTimer);
      },
      sneakNavigationHide: function(){
        var navigationSneak = this.snap.navigationSneak;
        this.snap.navigationSneakTimer = setTimeout(function(){
          navigationSneak(false);
        } ,500);
      },
      togglePanel: function(){
        settings.app.panelOpened(!settings.app.panelOpened());
      },
      togglePanelShape: function(data, event){
        settings.app.panelShape(event.target.dataset.panelShape);
        this.snap.panelDropdownActive( false );
      },
      togglePanelDropdown: function(data, event){
        event.stopPropagation();
        this.snap.panelDropdownActive(!this.snap.panelDropdownActive());
      }
    },
    // make this available in knockout bindings
    omnisearch: omnisearch,
    logModel: new log.Log(),
    // This is the initialization of the application...
    init: function(plugins) {
      var self = this;
      self.widgets = [];
      self.plugins = plugins;

      var openSearch = function(e, ctx) {
        omnisearch.openSearch();
        return true;
      };

      var globalKeybindings = [
        [ 'ctrl-k', openSearch, { preventDefault: true } ]
      ];

      // scope '' is global scope
      keyboard.installBindingsInScope('', globalKeybindings);

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
