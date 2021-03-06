/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['./router', 'commons/settings', 'services/build', './keyboard', './omnisearch',
        './navigation', './panel', 'widgets/notifications/notifications', 'services/typesafe'],
    function(router, settings, build, keyboard, omnisearch,
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
    settings: settings,
    // TODO this needs to be removed after it's no longer used
    // in application.scala.html
    testCallBinding: function(a,b,c,d){
    },
    pageTitle: ko.observable(),
    // TODO load last value from somewhere until we get a message from the iframe
    signedIn: ko.observable(false),
    // make this available in knockout bindings
    omnisearch: omnisearch,
    navigation: navigation,
    build: build,
    panel: panel,
    notifications: new Notifications()
  }

  typesafe.subscribe('signedIn', function(signedIn){
    if (typeof signedIn == 'boolean'){
      model.signedIn(signedIn);
    }
  });

  return model;
});
