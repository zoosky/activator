define([
  "core/plugins",
  "text!templates/monitor.html",
  "css!./monitor",
  "css!widgets/navigation/menu"
], function(
  plugins,
  template
){

  var providers = [
    {
      id: 'new-relic',
      title: "NewRelic",
      plugin: ("plugins/inpsect/console/system")
    },
    {
      id: 'app-dynamics',
      title: "App Dynamics",
      plugin: ("plugins/inpsect/console/actors")
    }
  ]

  var DeployState = {
    page: ko.observable(),
    providers: providers,
    provider: ko.observable()
  };

  return plugins.make({

    layout: function(url) {
      var $tutorial = $(template)[0];
      ko.applyBindings(DeployState, $tutorial);
      $("#wrapper").replaceWith($tutorial);
    },

    route: function(url, breadcrumb) {
      breadcrumb([['monitor/', "Monitor"]]);
      if (url.parameters[0] === void 0 || url.parameters[0] === "") {
      } else {
      }
    }

  });
});
