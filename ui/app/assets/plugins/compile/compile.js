/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./compile.html', 'main/pluginapi', 'services/build', 'commons/settings', 'css!./compile.css'],
    function(template, api, build, settings){

  var ko = api.ko;

  var compileConsole = api.PluginWidget({
    id: 'compile-widget',
    template: template,
    init: function(parameters){
      var self = this

      this.title = ko.observable("Compile");
      this.startStopLabel = ko.computed(function() {
        if (build.compile.haveActiveTask())
          return "Stop compiling";
        else
          return "Start compiling";
      }, this);

      this.logScroll = build.log.findScrollState();
      // TODO get rid of per-plugin status
      this.status = ko.observable(api.STATUS_DEFAULT);

      // these two are aliased here so our html template can find them
      this.recompileOnChange = settings.build.recompileOnChange;
      this.log = build.log;
    },
    update: function(parameters){
    },
    startStopButtonClicked: function(self) {
      debug && console.log("Start/stop compile was clicked");
      if (build.compile.haveActiveTask()) {
        build.compile.stopCompile();
      } else {
        build.compile.doCompile();
      }
    },
    onPreDeactivate: function() {
      this.logScroll = build.log.findScrollState();
    },
    onPostActivate: function() {
      build.log.applyScrollState(this.logScroll);
    }
  });

  return api.Plugin({
    id: 'compile',
    name: "Compile & Logs",
    icon: "B",
    url: "#compile",
    routes: {
      'compile': function() { api.setActiveWidget(compileConsole); }
    },
    widgets: [compileConsole],
    status: compileConsole.status
  });
});
