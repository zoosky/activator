define(function() {

  // This will redirect without adding a new state in browser history
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
          // this will basically remember last url from this plugin for next time

          // We have parameters, put in cache
          if (url.parameters.length) {
            routeState.url = url;

          // No parameters, but some in cache
          } else if (routeState.url) {
            url = routeState.url;
            redirect(url.path);

          // Nothing? Use `home`
          } else {
            url.parameters = [];
          }

          return p.route(url, breadcrumb);
        }
      });
    }
  }

});
