/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['main/pluginapi', 'text!./appdynamics.html', 'css!./appdynamics.css'],
  function(api, template, css){

    var AppDynamics = api.Class(api.Widget,{
      id: 'appdynamics-widget',
      template: template,
      init: function(args) {
        var self = this;
        self.available = ko.observable(false);
      },
      route: function(path) {}
    });

    return AppDynamics;
  });
