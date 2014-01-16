/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['webjars!knockout', 'commons/settings', 'widgets/log/log', 'commons/utils'],
    function(ko, settings, log, utils){
  settings.register("build.startApp", true);
  settings.register("build.rerunOnBuild", true);
  settings.register("build.runInConsole", false);
  settings.register("build.retestOnSuccessfulBuild", false);

  var build = utils.Singleton({
    init: function() {
    },
    log: new log.Log(),
    // properties of the application we are building
    app: {
      name: ko.observable(window.serverAppModel.name ? window.serverAppModel.name : window.serverAppModel.id),
      hasAkka: ko.observable(false),
      hasPlay: ko.observable(false),
      hasConsole: ko.observable(false)
    }
  });

  return build;
});
