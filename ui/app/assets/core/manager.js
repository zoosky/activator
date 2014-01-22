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

var deps = ['jquery', 'noir', 'plugins/home/home', "css!core/main"];

require(deps, function($, noir, home) {
  return home.render(document.body);
});
