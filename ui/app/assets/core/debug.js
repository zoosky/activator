require.config({
  baseUrl: "/assets",
  map: {
    '*': {
      'css': 'vendors/css'
    }
  },
  paths: {
    'jquery': 'vendors/jquery',
    'noir': 'vendors/noir'
  }
});

var deps = ['jquery', 'noir', 'plugins/debug/debug', "css!core/main"];

require(deps, function($, noir, debug) {
  return debug.render(document.body);
});
