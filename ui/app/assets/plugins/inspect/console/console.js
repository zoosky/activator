/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(["text!./console.html", "css!./console.css", "core/pluginapi", "./connection", "./overview", "./utils"], function(template, css, api, Connection, Overview) {

  var ko = api.ko;

  var Console = api.Class(api.Widget, {
    id: 'console-widget',
    template: template,
    init: function(args) {
      var self = this;

      window.debug = true;
      this.connected = ko.observable(false);
      this.path = [];
      this.defaultTime = { "startTime": "", "endTime": "", "rolling": "10minutes" };
      Connection.init(self.defaultTime);

      this.overview = new Overview();
      this.modules = [ this.overview ];
      Connection.updateModules(this.modules);

      api.events.subscribe(function(event) {
        return event.type == "AtmosStarted" || event.type == "RunStopped";
      },
      function(event) {
        if (event.type == "AtmosStarted") {
          self.atmosStarted();
        } else if (event.type == "RunStopped") {
          if (self.connected()) self.runStopped();
        }
      });
    },
    atmosStarted: function(event) {
      var self = this;
      Connection.open(consoleWsUrl, function() {
        self.connected(true);
      });
    },
    runStopped: function(event) {
      Connection.close();
      this.connected(false);
    },
    route: function(path) {
      // TODO: routing and module loading/unloading based on path
      this.path = path;
    }
  });

  return Console;
});
