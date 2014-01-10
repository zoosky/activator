/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['commons/settings'], function(settings){
  settings.register("build.startApp", true);
  settings.register("build.rerunOnBuild", true);
  settings.register("build.runInConsole", false);
  settings.register("build.retestOnSuccessfulBuild", false);

  return {
    // we don't have any actual point yet other than registering settings
  }
});
