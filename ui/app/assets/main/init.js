/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */

// Sort of MVC (Module, Grid, Router)
define(['./model', 'commons/streams', './plugin', './globalEventHandlers', 'services/typesafe'], function(model, streams, plugins, globalEventHandlers, typesafe) {

  // Register webSocket error handler
  streams.subscribe({
    handler: function(event) {
      alert("Connection lost; you will need to reload the page or restart Activator. It's also possible that Activator is open in another tab, which causes this error.");
    },
    filter: function(event) {
      return event.type == streams.WEB_SOCKET_CLOSED;
    }
  });

  // Here's the app initialization ordering!
  model.init(plugins);
  globalEventHandlers.init();

  typesafe.subscribe('signedIn', function(signedIn){
    if (typeof signedIn == 'boolean'){
      model.signedIn(signedIn);
    }
  });

  window.addEventListener("message", receiveMessage, false);

  // there is a race if the child iframe sent the message before we added that listener.
  // so we ask the iframe to resend. If the iframe is not started up yet, then this
  // won't do anything but the iframe will send automatically when it starts up.
  ////$('#loginIFrame').get(0).contentWindow.postMessage('{ "pleaseResendSignedIn" : true }', '*');

  return model;
});
