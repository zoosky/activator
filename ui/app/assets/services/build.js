/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['webjars!knockout','commons/settings'], function(ko,settings){
  return {
    startApp: ko.observable( settings.get("build.startApp", true) ),
    rerunOnBuild: ko.observable( settings.get("build.rerunOnBuild", true) ),
    runInConsole: ko.observable( settings.get("build.runInConsole", false) ),
    retestOnSuccessfulBuild: ko.observable( settings.get("build.retestOnSuccessfulBuild", false) )
  }
});
