/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['main/pluginapi', './console/console', 'text!./inspect.html', 'css!./inspect.css'], function(api, Console, template){

  var inspectConsole = api.PluginWidget({
    id: 'inspect-console-widget',
    template: template,
    init: function() {
      this.consoleWidget = new Console();
    },
    route: function(path) {
      this.consoleWidget.route(path);
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
