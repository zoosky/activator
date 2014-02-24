define([
  "core/plugins",
  "services/build",
  "text!templates/run.html",
  "widgets/forms/switch",
  "widgets/navigation/menu",
  "css!./run",
  "css!widgets/navigation/menu"
], function(
  plugins,
  build,
  template,
  _switch,
  menu
) {

  var RunConsole = function(){
    var self = this;

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
    // this.outputLogView = new log.LogView(build.run.outputLog);
    this.playAppLink = build.run.playAppLink;
    this.playAppStarted = build.run.playAppStarted;
    this.haveActiveTask = build.run.haveActiveTask;
    this.haveMainClass = build.run.haveMainClass;
    this.currentMainClass = build.run.currentMainClass;
    this.mainClasses = build.run.mainClasses;
    // this.rerunOnBuild = settings.build.rerunOnBuild;
    this.restartPending = build.run.restartPending;
    this.consoleCompatible = build.app.hasConsole;
    this.statusMessage = build.run.statusMessage;
    // this.outputScroll = this.outputLogView.findScrollState();

    this.update = function(parameters){
    }
    this.startStopButtonClicked = function(self) {
      debug && console.log("Start or Stop was clicked");
      build.toggleTask('run');
    }
    this.restartButtonClicked = function(self) {
      debug && console.log("Restart was clicked");
      build.restartTask('run');
    }
    this.onPreDeactivate = function() {
      this.outputScroll = this.outputLogView.findScrollState();
    }
    this.onPostActivate = function() {
      // this.outputLogView.applyScrollState(this.outputScroll);
    }
  }
  var runConsole = new RunConsole();

  var autocompile = ko.observable(true);
  var showConfiguration = ko.observable(false);
  var debugActive = ko.observable(false);
  var debugPort = ko.observable(3000);
  var logs = ko.observableArray([
    {
      type: "stdout",
      content: "Greeting: hello, akka"
    }, {
      type: "stdout",
      content: "Greeting: hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }
  ]);

  // view model
  var RunState = {
    autocompile: autocompile,
    showConfiguration: showConfiguration,
    debugActive: debugActive,
    debugPort: debugPort,
    logs: logs,
    build: build
  }

  return {
    layout: function(url) {
      var $run = $(template)[0];
      ko.applyBindings(RunState, $run);
      $("#wrapper").replaceWith($run);
    },

    route: function(url, breadcrumb) {
      var all;
      all = [['run/', "Run"]];
      return breadcrumb(all);
    }
  }
});
