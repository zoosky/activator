/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['services/application', 'text!./status.html', 'webjars!knockout', 'core/widget', 'commons/utils'], function(application, template, ko, Widget, utils) {

  var Status = utils.Class(Widget, {
    id: 'appStatus',
    template: template,
    init: function(config) {
      var self = this;

      self.app = application;
      self.startApp = application.haveActiveTask;
      self.rerunOnBuild = application.rerunOnBuild;
      self.runInConsole = application.runningWithAtmos;
      self.consoleOn = ko.computed(function(){ return self.startApp() && self.runInConsole() });
      self.retestOnSuccessfulBuild = ko.observable( false );
    },
    toggleStartApp: function(self) {
      if (self.app.haveActiveTask()) {
        // stop
        self.app.restartPending(false);
        self.app.doStop();
      } else {
        // start
        self.app.doRun();
      }
    },
    toggleRerunOnBuild: function(self) {
      self.app.rerunOnBuild( !self.app.rerunOnBuild() );
    },
    toggleRunInConsole: function(self) {
      self.app.runInConsole( !self.app.runInConsole() );
    }
  });
  return new Status();
});
