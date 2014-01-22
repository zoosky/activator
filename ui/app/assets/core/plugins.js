define(function() {

  var redirect = function(hash) {
    if (history.replaceState != null) {
      return history.replaceState(null, null, '#' + hash);
    }
  }

  return {
    make: function(p) {

      var routeState = {};

      return $.extend({}, p, {
        route: function(url, breadcrumb) {
          if (url.parameters.length) {
            // We have parameters, use it
            routeState.url = url;
          } else if (routeState.url) {
            // No parameters, but some in cache
            url = routeState.url;
            redirect(url.path);
          } else {
            // Nothing? Use `home`
            url.parameters = [];
          }
          return p.route(url, breadcrumb);
        }
      });
    }
  }

});
