/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./local.html', 'core/pluginapi'], function(template, api){

  var ko = api.ko;
  var sbt = api.sbt;

  var deployConsole = api.PluginWidget({
    id: 'deploy-local-widget',
    template: template,
    init: function(parameters){
      var self = this

      this.title = ko.observable("deploylocal");
      this.status = ko.observable(api.STATUS_DEFAULT);
    }
  });

  return api.Plugin({
    id: 'deploy-local',
    name: "Deploy - Local",
    icon: "D",
    url: "#deploy-local",
    routes: {
      'deploy-local': function() { api.setActiveWidget(deployConsole); }
    },
    widgets: [deployConsole],
    status: deployConsole.status
  });
});
