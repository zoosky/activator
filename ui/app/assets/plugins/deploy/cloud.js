/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./cloud.html', 'core/pluginapi'], function(template, api){

  var ko = api.ko;
  var sbt = api.sbt;

  var deployConsole = api.PluginWidget({
    id: 'deploy-cloud-widget',
    template: template,
    init: function(parameters){
      var self = this

      this.title = ko.observable("deploycloud");
      this.status = ko.observable(api.STATUS_DEFAULT);
    }
  });

  return api.Plugin({
    id: 'deploy-cloud',
    name: "Deploy - Cloud",
    icon: "D",
    url: "#deploy-cloud",
    routes: {
      'deploy-cloud': function() { api.setActiveWidget(deployConsole); }
    },
    widgets: [deployConsole],
    status: deployConsole.status
  });
});
