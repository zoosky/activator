/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['webjars!knockout','commons/settings'], function(ko,settings){

  var startApp = ko.observable( settings.get("build.startApp", true) );
  var rerunOnBuild = ko.observable( settings.get("build.rerunOnBuild", true) );
  var runInConsole = ko.observable( settings.get("build.runInConsole", true) );
  var consoleOn = ko.computed(function(){ return startApp() && runInConsole() });
  var retestOnSuccessfulBuild = ko.observable( settings.get("build.retestOnSuccessfulBuild", true) );

  return {
    startApp: startApp,
    rerunOnBuild: rerunOnBuild,
    runInConsole: runInConsole,
    consoleOn: consoleOn,
    retestOnSuccessfulBuild: retestOnSuccessfulBuild
  }
});
