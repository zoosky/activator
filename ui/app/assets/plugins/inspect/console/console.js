/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(["text!./console.html", "css!./console.css", "core/pluginapi", "./connection", './overview', './entity/actors', './entity/requests', "commons/utils"], function(template, css, api, Connection, Overview, Actors, Requests) {

  var ko = api.ko;

  var Console = api.Class(api.Widget, {
    id: 'console-widget',
    template: template,
    init: function(args) {
      var self = this;

      this.connected = ko.observable(false);
      this.crumbs = ko.observableArray([]);
      this.defaultTime = { "startTime": "", "endTime": "", "rolling": "10minutes" };
      Connection.init(self.defaultTime);

      this.navigation = new Overview();
      this.views = {
        'actors': { 'contents': new Actors() },
        'requests': { 'contents': new Requests() }
      };
      this.viewer = ko.computed(function() {
        return self.updateView(self.crumbs());
      });

      api.events.subscribe(
        function(event) {
          return event.type == "AtmosStarted" || event.type == "RunStopped";
        },
        function(event) {
          if (event.type == "AtmosStarted") {
            self.atmosStarted();
          } else if (event.type == "RunStopped") {
            if (self.connected()) self.runStopped();
          }
        }
      );
    },
    atmosStarted: function() {
      var self = this;
      Connection.open(consoleWsUrl, function() {
        self.connected(true);
      });
    },
    runStopped: function() {
      Connection.close();
      this.connected(false);
    },
    route: function(path) {
      this.crumbs(path);
    },
    updateView: function(path) {
      name = path[0];
      view = this.views[name];
      if (view) this.navigation.active(name);
      modules = view ? [ this.navigation, view.contents ] : [ this.navigation ]
      Connection.updateModules(modules);
      return view;
    }
  });

  return Console;
});
