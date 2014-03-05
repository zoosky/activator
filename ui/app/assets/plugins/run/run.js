/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['services/build', 'main/model', 'text!./run.html', 'main/pluginapi', 'commons/settings', 'widgets/log/log', 'css!./run.css'],
    function(build, model, template, api, settings, LogView, css){

  var logView = new LogView(build.run.outputLog);

  var RunState = {
    title: ko.observable("Run"),
    startStopLabel: ko.computed(function() {
      if (build.run.haveActiveTask())
        return "Stop";
      else
        return "Start";
    }, this),

    // Aliases so we can use these in our html template.
    // This is a mess to clean up; we should just alias
    // 'build' or something then refer to these.
    // But doing this to keep changes in one commit smaller.
    // We want to just change the whole 'build' API anyway.
    outputLogView: logView,
    playAppLink: build.run.playAppLink,
    playAppStarted: build.run.playAppStarted,
    haveActiveTask: build.run.haveActiveTask,
    haveMainClass: build.run.haveMainClass,
    currentMainClass: build.run.currentMainClass,
    mainClasses: build.run.mainClasses,
    rerunOnBuild: settings.build.rerunOnBuild,
    restartPending: build.run.restartPending,
    consoleCompatible: build.app.hasConsole,
    statusMessage: build.run.statusMessage,
    outputScroll: logView.findScrollState(),

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
      RunState.outputScroll = logView.findScrollState();
    },
    onPostActivate: function() {
      logView.applyScrollState(RunState.outputScroll);
    }
  }

  return {
    render: function() {
      var $run = $(template)[0];
      ko.applyBindings(RunState, $run);
      return $run;
    },
    route: function(){}
  }
});
