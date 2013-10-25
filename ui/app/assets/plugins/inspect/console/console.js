/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(["text!./console.html", "css!./console.css", "core/pluginapi", "./connection", "./grid", "./overview", "./utils"], function(template, css, api, Connection, Grid, Overview) {

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

      this.modules = [ { "index": 0, "path": "inspect", "module": new Overview() } ];

      Connection.init(self.defaultTime);
      Grid.init();

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
        self.render();
      });
    },
    runStopped: function(event) {
      Connection.close();
      this.connected(false);
    },
    route: function(path) {
      this.path = path;
      if (this.connected()) this.render();
    },
    render: function() {
      // TODO: proper routing and module loading/unloading based on path
      Grid.render(this.modules);
      Connection.updateModules(this.modules);
    }
  });

  return Console;
});
