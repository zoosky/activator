/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['services/build', 'main/model', 'text!./run.html', 'main/pluginapi', 'commons/settings', 'widgets/log/log', 'css!./run.css'],
    function(build, model, template, api, settings, log, css){

  var ko = api.ko;

  var runConsole = api.PluginWidget({
    id: 'play-run-widget',
    template: template,
    init: function(parameters){
      var self = this

      this.title = ko.observable("Run");
      this.startStopLabel = ko.computed(function() {
        if (build.run.haveActiveTask())
          return "Stop";
        else
          return "Start";
      }, this);

      // Aliases so we can use these in our html template.
      // This is a mess to clean up; we should just alias
      // 'build' or something then refer to these.
      // But doing this to keep changes in one commit smaller.
      // We want to just change the whole 'build' API anyway.
      this.outputLogView = new log.LogView(build.run.outputLog);
      this.playAppLink = build.run.playAppLink;
      this.playAppStarted = build.run.playAppStarted;
      this.atmosLink = build.run.atmosLink;
      this.statusMessage = build.run.statusMessage;
      this.atmosCompatible = build.app.hasConsole;
      this.haveActiveTask = build.run.haveActiveTask;
      this.haveMainClass = build.run.haveMainClass;
      this.currentMainClass = build.run.currentMainClass;
      this.mainClasses = build.run.mainClasses;
      this.rerunOnBuild = settings.build.rerunOnBuild;
      this.restartPending = build.run.restartPending;
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

      this.outputScroll = this.outputLogView.findScrollState();
    },
    update: function(parameters){
    },
    startStopButtonClicked: function(self) {
      debug && console.log("Start or Stop was clicked");
      build.toggleTask('run');
    },
    restartButtonClicked: function(self) {
      debug && console.log("Restart was clicked");
      build.restartTask('run');
    },
    onPreDeactivate: function() {
      this.outputScroll = this.outputLogView.findScrollState();
    },
    onPostActivate: function() {
      this.outputLogView.applyScrollState(this.outputScroll);
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
