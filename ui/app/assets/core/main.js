require.config({
  baseUrl: "/public",
  map: {
    '*': {
      'css': 'vendors/require-css',
      'text': 'vendors/require-text'
    }
  },
  paths: {
    'jquery': 'vendors/jquery',
    'ko': 'vendors/knockout-3.0.0',
    'noir': 'vendors/noir'
  }
});

require(['jquery','ko'], function($, ko) {
  window.ko = ko; // it's used on every page...

  require([
    'core/router',
    'core/view',
    'core/keyboard',
    'commons/tpl-helpers'
  ], function(
    router,
    mainView,
    keyboard
  ) {
    mainView.render();
    router.load(window.location.hash); // this will load the plugin from url
  });
});
