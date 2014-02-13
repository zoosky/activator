/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['services/build', 'main/model', 'commons/settings', 'main/pluginapi', './console/console', 'text!./inspect.html', 'css!./inspect.css'], function(build, model, settings, api, Console, template){

  var ko = api.ko;

  var inspectConsole = api.PluginWidget({
    id: 'inspect-console-widget',
    template: template,
    init: function() {
      this.consoleWidget = new Console();

      this.atmosLink = build.run.atmosLink;
      this.statusMessage = build.run.statusMessage;
      this.atmosCompatible = build.app.hasConsole;


      this.notRunningAndAtmosEnabled = ko.computed(function(){
        return settings.build.runInConsole();
      });
      this.atmosDisabled = ko.computed(function(){
        return !settings.build.runInConsole();
      });

      this.startStopAtmosLabel = ko.computed(function() {
        return settings.build.runInConsole()?"Disable Inspector":"Enable Inspector";
      });
    },
    route: function(path) {
      this.consoleWidget.route(path);
    },
    startStopAtmosClicked: function() {
      settings.build.runInConsole( !settings.build.runInConsole() );
      if (build.run.haveActiveTask()){
        build.restartTask('run');
      }
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
