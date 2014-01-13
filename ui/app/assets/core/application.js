/**
 * Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
require.config({
  baseUrl:  '/public',
  // hack for now due to problem loading plugin loaders from a plugin loader
  map: {
    '*': {
      'css': '../../webjars/require-css/0.0.7/css',
      'text': '../../webjars/requirejs-text/2.0.10/text'
    }
  },
  paths: {
    commons:  'commons',
    core:     'core',
    plugins:  'plugins',
    services: 'services',
    widgets:  'widgets'
  }
});

// Global event handlers to initialize us.
var handleVisibilityChange = function() {
  if (!document[hidden]) {
    startApp()
    document.removeEventListener(visibilityChange, handleVisibilityChange)
  }
}

var startApp = function() {
  require(['commons/templates'], function() {
    require([
      'commons/effects',
      'commons/utils',
      'services/sbt'
    ], function() {
      require(['core/snap'])
    })
  })
}

require([
  // Vendors
  '../../webjars/requirejs-text/2.0.10/text',
  '../../webjars/require-css/0.0.7/css',
  'webjars!jquery',
  'webjars!knockout',
  'webjars!keymage',
  'commons/visibility'
],function() {
  if (!document[hidden]) {
    startApp()
  }
  else {
    document.addEventListener(visibilityChange, handleVisibilityChange, false)
  }
})
