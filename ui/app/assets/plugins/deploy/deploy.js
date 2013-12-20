/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./deploy.html', 'core/pluginapi'], function(template, api){

  var ko = api.ko;
  var sbt = api.sbt;

  var deployConsole = api.PluginWidget({
    id: 'deploy-widget',
    template: template,
    init: function(parameters){
      var self = this

      this.title = ko.observable("deploy");
      this.status = ko.observable(api.STATUS_DEFAULT);
    }
  });

  return api.Plugin({
    id: 'deploy',
    name: "Deploy",
    icon: "D",
    url: "#deploy",
    routes: {
      'deploy': function() { api.setActiveWidget(deployConsole); }
    },
    widgets: [deployConsole],
    status: deployConsole.status
  });
});
