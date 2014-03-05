/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['./router', 'commons/settings', 'plugins/tutorial/tutorial', 'services/build', './keyboard', './omnisearch',
        './navigation', './panel', 'widgets/notifications/notifications', 'services/typesafe'],
    function(router, settings, Tutorial, build, keyboard, omnisearch,
        navigation, panel, Notifications, typesafe) {

  // This is the model for HTML which is directly in main.scala.html.
  // In many cases it's better to create a widget, which has its own
  // HTML file, rather than stuffing all the code and HTML into this file
  // and main.scala.html.
  // This can also be kept tidy by using separate files for related
  // functionality (see omnisearch, navigation, panel below for examples).
  var model = {
    plugins: null, // filled in by init
    router: router,
    widgets: [],
    tutorial: new Tutorial(),
    settings: settings,
    // TODO this needs to be removed after it's no longer used
    // in application.scala.html
    testCallBinding: function(a,b,c,d){
    },
    activeWidget: ko.observable(""),
    pageTitle: ko.observable(),
    // TODO load last value from somewhere until we get a message from the iframe
    signedIn: ko.observable(false),
    // make this available in knockout bindings
    omnisearch: omnisearch,
    navigation: navigation,
    panel: panel,
    build: build,
    notifications: new Notifications(),
    // This is the initialization of the application...
    init: function(plugins) {
      var self = this;
      self.plugins = plugins;

      var openSearch = function(e, ctx) {
        omnisearch.openSearch();
        return true;
      };

    }
  }

  typesafe.subscribe('signedIn', function(signedIn){
    if (typeof signedIn == 'boolean'){
      model.signedIn(signedIn);
    }
  });

  return model;
});
