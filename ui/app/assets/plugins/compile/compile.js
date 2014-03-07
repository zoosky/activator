/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./compile.html', 'main/plugins', 'main/pluginapi', 'services/build', 'commons/settings', 'widgets/log/log', 'css!./compile.css'],
  function(template, plugins, api, build, settings, LogView) {

    var logView = new LogView(build.log);

    var CompileState = (function(){
      var self = {};

      self.title = ko.observable("Compile");
      self.startStopLabel = ko.computed(function() {
        if (build.compile.haveActiveTask())
          return "Stop compiling";
        else
          return "Start compiling";
      });
      self.logView = logView;
      self.logScroll = logView.findScrollState();
      // TODO get rid of per-plugin status
      self.status = ko.observable(api.STATUS_DEFAULT);
      // aliased here so our html template can find it
      self.recompileOnChange = settings.build.recompileOnChange;
      self.update = function(parameters){
      };
      self.startStopButtonClicked = function(self) {
        debug && console.log("Start/stop compile was clicked");
        build.toggleTask('compile');
      };
      self.onPreDeactivate = function() {
        this.logScroll = this.logView.findScrollState();
      };
      self.onPostActivate = function() {
        this.logView.applyScrollState(this.logScroll);
      };

      return self;
    }());

    return {
      beforeRender: function() {
        CompileState.onPostActivate();
      },
      render: function() {
        var $compile = $(template)[0];
        ko.applyBindings(CompileState, $compile);
        return $compile;
      },
      afterRender: function() {
        CompileState.onPreDeactivate();
      },
      route: function(url, breadcrumb) {
      }
    };
  });
