/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define([
  "core/plugins",
  "text!templates/inspect.html",
  "css!./inspect",
  "css!widgets/navigation/menu"
], function(
  plugins,
  template
) {

  var links = [
    {
      id: 'system',
      title: "System",
      plugin: ("plugins/inpsect/console/system")
    },
    {
      id: 'actors',
      title: "Actors",
      plugin: ("plugins/inpsect/console/actors")
    },
    {
      id: 'requests',
      title: "Requests",
      plugin: ("plugins/inpsect/console/requests")
    },
    {
      id: 'deviations',
      title: "Deviations",
      plugin: ("plugins/inpsect/console/deviations")
    },
    {
      id: 'rest',
      title: "Rest console",
      plugin: ("plugins/inpsect/console/rest")
    }
  ]

  var page = ko.observable();
  var login = function() {
    return logged(true);
  };



// define(['main/pluginapi', './console/console', './console/connection', 'text!./inspect.html', 'css!./inspect.css'], function(api, Console, Connection, template){
//     var ko = api.ko;

//     var inspectConsole = api.PluginWidget({
//         id: 'inspect-console-widget',
//         template: template,
//         init: function() {
//             this.consoleWidget = new Console();
//             this.reset = function() {
//                 Connection.send({
//                     "commands": [
//                         {
//                             "module": "lifecycle",
//                             "command": "reset"
//                         }
//                     ]
//                 });
//             };
//         },
//         route: function(path) {
//             this.consoleWidget.route(path);
//         }
//     });

//     return api.Plugin({
//         id: 'inspect',
//         name: "Inspect",
//         icon: "C",
//         url: "#inspect",
//         routes: {
//             'inspect': function(path) {
//                 api.setActiveWidget(inspectConsole);
//                 inspectConsole.route(path.rest);
//             }
//         },
//         widgets: [inspectConsole]
//     });





  var InspectState = {
    links: links,
    page: page
  }

  return {
    render: function(url) {
      var $inspect = $(template)[0];
      ko.applyBindings(InspectState, $inspect);
      $("#wrapper").replaceWith($inspect);
    },

    route: plugins.memorizeUrl(function(url, breadcrumb) {
      var all = [['inspect/', "Inspect"]];
      switch (url.parameters[0]) {
        case "":
          return breadcrumb(all);
        default:
          return breadcrumb(all);
      }
    })
  }

});
