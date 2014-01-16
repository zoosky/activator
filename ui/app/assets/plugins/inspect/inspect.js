/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['core/pluginapi', './console/console', './console/connection', 'text!./inspect.html', 'css!./inspect.css'], function(api, Console, Connection, template){
  var ko = api.ko;

  var inspectConsole = api.PluginWidget({
    id: 'inspect-console-widget',
    template: template,
    init: function() {
      this.consoleWidget = new Console();
      this.reset = function() {
        Connection.send({
          "commands": [
            {
              "module": "lifecycle",
              "command": "reset"
            }
          ]
        });
      };
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
