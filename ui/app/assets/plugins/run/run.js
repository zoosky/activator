/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['services/application', 'core/model', 'text!./run.html', 'core/pluginapi', 'css!./run.css'], function(application, model, template, api, css){

  var ko = api.ko;
  var sbt = api.sbt;

  var runConsole = api.PluginWidget({
    id: 'play-run-widget',
    template: template,
    init: function(parameters){
      var self = this
      this.app = application;
    },
    update: function(parameters){
    },
    startStopButtonClicked: function(self) {
      if (self.app.haveActiveTask()) {
        // stop
        self.app.restartPending(false);
        self.app.doStop();
      } else {
        // start
        self.app.doRun();
      }
    },
    showLogin: function(self) {
      $('#user').addClass("open");
    }

  });

  return api.Plugin({
    id: 'run',
    name: "Run",
    icon: "▶",
    url: "#run",
    routes: {
      'run': function() { api.setActiveWidget(runConsole); }
    },
    widgets: [runConsole]
  });
});
