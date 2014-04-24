/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['main/pluginapi', 'text!./monitor.html', 'text!./monitorWidget.html', 'css!./monitor.css', './solutions/newrelic', './solutions/appdynamics'],
  function(api, template, widgetTemplate, css, NewRelic, AppDynamics){

    var MonitorWidget = api.Class(api.Widget, {
      id: 'monitor-widget',
      template: widgetTemplate,
      init: function(args) {
        var self = this;
        self.crumbs = ko.observableArray([]);
        self.views = {
          'newrelic': { contents: new NewRelic() },
          'appdynamics' : {contents: new AppDynamics() }
        };
        self.viewer = ko.computed(function() {
          return self.updateView(self.crumbs());
        });
      },
      route: function(path) {
        this.crumbs(path);
      },
      updateView: function(path) {
        name = path[0];
        return this.views[name];
      }
    });

    var MonitorState = {
      monitorWidget: new MonitorWidget()
    };

    return {
      render: function() {
        var monitor = $(template)[0];
        ko.applyBindings(MonitorState, monitor);
        return monitor;
      },
      route: function(url, breadcrumb) {
        if (url.parameters == undefined || url.parameters.length == 0) {
          url.parameters = ["newrelic"];
        }
        MonitorState.monitorWidget.route(url.parameters);
      }
    }
  });
