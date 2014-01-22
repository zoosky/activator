define([
  "core/plugins",
  "text!templates/inspect.html",
  "css!./inspect",
  "css!widgets/navigation/menu"
], function(
  plugins,
  template
) {

  var links = {
    system: {
      title: "System"
    },
    actors: {
      title: "Actors"
    },
    requests: {
      title: "Requests"
    },
    deviations: {
      title: "Deviations"
    }
  };
  var page = ko.observable();
  var logged = ko.observable(false);
  var login = function() {
    return logged(true);
  };

  var InspectState = {
    links: links,
    page: page,
    logged: logged,
    login: login
  }

  return plugins.make({
    layout: function(url) {
      // $inspect(inspects, page, logged, login);
      var $inspect = $(template)[0];
      ko.applyBindings(InspectState, $inspect);
      $("#wrapper").replaceWith($inspect);
    },

    route: function(url, breadcrumb) {
      var all = [['inspect/', "Inspect"]];
      switch (url.parameters[0]) {
        case "":
          return breadcrumb(all);
        default:
          return breadcrumb(all);
      }
    }
  });
});
