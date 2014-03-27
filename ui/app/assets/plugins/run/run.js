/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['services/build', 'main/model', 'text!./run.html', 'main/pluginapi', 'commons/settings', 'widgets/log/log', 'css!./run.css'],
    function(build, model, template, api, settings, LogView, css){

  var instrumentationOptions = [
    { name: "Inspect", id: "inspect" },
    { name: "New Relic", id: "newRelic" }
  ];
  var logView = new LogView(build.run.outputLog);

  var RunState = (function(){
    var self = {};

    self.instrumentationOptions = ko.observableArray(instrumentationOptions);
    self.title = ko.observable("Run");
    self.startStopLabel = ko.computed(function() {
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
    self.outputLogView = logView;
    self.playAppLink = build.run.playAppLink;
    self.playAppStarted = build.run.playAppStarted;
    self.haveActiveTask = build.run.haveActiveTask;
    self.haveMainClass = build.run.haveMainClass;
    self.currentMainClass = build.run.currentMainClass;
    self.mainClasses = build.run.mainClasses;
    self.rerunOnBuild = settings.build.rerunOnBuild;
    self.instrumentation = settings.run.instrumentation;
    self.restartPending = build.run.restartPending;
    self.consoleCompatible = build.app.hasConsole;
    self.statusMessage = build.run.statusMessage;
    self.outputScroll = logView.findScrollState();

    self.update = function(parameters){
    }
    self.startStopButtonClicked = function(self) {
      debug && console.log("Start or Stop was clicked");
      build.toggleTask('run');
    }
    self.restartButtonClicked = function(self) {
      debug && console.log("Restart was clicked");
      build.restartTask('run');
    }
    self.onPreDeactivate = function() {
      RunState.outputScroll = logView.findScrollState();
    }
    self.onPostActivate = function() {
      logView.applyScrollState(RunState.outputScroll);
    }

    return self;
  }());

  return {
    render: function() {
      var $run = $(template)[0];
      ko.applyBindings(RunState, $run);
      return $run;
    },
    beforeRender: RunState.onPostActivate,
    afterRender: RunState.onPreDeactivate,
    route: function(){}
  }
});
