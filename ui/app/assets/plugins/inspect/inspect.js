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

      this.runningWithAtmos = ko.computed(function() {
        return build.run.haveActiveTask() && build.run.atmosLink() != '' && model.signedIn();
      }, this);
      this.runningWithoutAtmosButEnabled = ko.computed(function() {
        return build.run.haveActiveTask() && build.run.atmosLink() == '' && model.signedIn() && settings.build.runInConsole();
      }, this);
      this.runningWithoutAtmosBecauseDisabled = ko.computed(function() {
        return build.run.haveActiveTask() && build.run.atmosLink() == '' && model.signedIn() && !settings.build.runInConsole();
      }, this);
      this.notSignedIn = ko.computed(function() {
        return !model.signedIn();
      }, this);
      this.notRunningAndSignedInAndAtmosEnabled = ko.computed(function() {
        return !build.run.haveActiveTask() && settings.build.runInConsole() && model.signedIn();
      }, this);
      this.notRunningAndSignedInAndAtmosDisabled = ko.computed(function() {
        return !build.run.haveActiveTask() && !settings.build.runInConsole() && model.signedIn();
      }, this);

    },
    route: function(path) {
      this.consoleWidget.route(path);
    },
    restartWithAtmos: function(self) {
      settings.build.runInConsole(true);
      build.restartTask('run');
    },
    restartWithoutAtmos: function(self) {
      settings.build.runInConsole(false);
      build.restartTask('run');
    },
    enableAtmos: function(self) {
      settings.build.runInConsole(true);
    },
    disableAtmos: function(self) {
      settings.build.runInConsole(false);
    },
    showLogin: function(self) {
      $('#user').addClass("open");
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
