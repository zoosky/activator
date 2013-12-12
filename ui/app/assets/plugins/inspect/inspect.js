/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['services/application','core/pluginapi', './console/console', 'text!./inspect.html', 'css!./inspect.css'], function(application,api, Console, template){

  var inspectConsole = api.PluginWidget({
    id: 'inspect-console-widget',
    template: template,
    init: function() {
      this.app = application;
      this.consoleWidget = new Console();
    },
    route: function(path) {
      this.consoleWidget.route(path);
    },
    showLogin: function(self) {
      $('#user').addClass("open");
    },
    restartWithAtmos: function(self) {
      self.app.restartWithAtmos();
    },
    restartWithoutAtmos: function(self) {
      self.app.restartWithoutAtmos();
    },
    disableAtmos: function(self) {

    },
    enableAtmos: function(self) {

    }
  });

  return api.Plugin({
    id: 'inspect',
    name: "Inspect",
    icon: "C",
    url: "#inspect",
    routes: {
      'inspect': function(path) {
        api.setActiveWidget(inspectConsole);
        inspectConsole.route(path.rest);
      }
    },
    widgets: [inspectConsole],
    status: inspectConsole.status
  });
});
