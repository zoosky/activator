/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./compile.html', 'main/plugins', 'services/build', 'commons/settings', 'widgets/log/log', 'css!./compile.css'],
    function(template, plugins, build, settings, LogView) {

  var logView = new LogView(build.log);

  var CompileState = {
    title: ko.observable("Compile"),
    startStopLabel: ko.computed(function() {
      if (build.compile.haveActiveTask())
        return "Stop compiling";
      else
        return "Start compiling";
    }),

    logView: logView,
    logScroll: logView.findScrollState(),
    // TODO get rid of per-plugin status
    status: ko.observable('default'),

    // aliased here so our html template can find it
    recompileOnChange: settings.build.recompileOnChange,
    update: function(parameters){
    },
    startStopButtonClicked: function(self) {
      debug && console.log("Start/stop compile was clicked");
      build.toggleTask('compile');
    },
    onPreDeactivate: function() {
      logView.findScrollState();
    },
    onPostDeactivate: function() {
      logView.applyScrollState(CompileState.logScroll);
    }
  };

  return {
    render: function() {
      var $compile = $(template)[0];
      ko.applyBindings(CompileState, $compile);
      return $compile;
    },
    route: function(url, breadcrumb) {
    }
  };
});
