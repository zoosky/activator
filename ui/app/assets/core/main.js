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

var deps = ['noir', 'core/router', 'core/services', 'core/plugins', 'core/view', 'core/keyboard', 'vendors/knockout-projections.min', 'commons/tpl-helpers'];

require(['jquery','ko'], function($, ko) {
  window.ko = ko;

  require(deps, function(noir, router, services, plugins, mainView, keyboard) {
    mainView.render();
    setTimeout(function() {
      router.load(window.location.hash);
    },100);
  });
});
