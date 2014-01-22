define([
  "core/plugins",
  "text!templates/deploy.html",
  "css!./deploy",
  "css!widgets/navigation/menu"
], function(
  plugins,
  template
){

  var DeployState = {
    provider: ko.observable()
  };

  return plugins.make({

    layout: function(url) {
      var $tutorial = $(template)[0];
      ko.applyBindings(DeployState, $tutorial);
      $("#wrapper").replaceWith($tutorial);
    },

    route: function(url, breadcrumb) {
      breadcrumb([['deploy/', "Deploy"]]);
      if (url.parameters[0] === void 0 || url.parameters[0] === "") {
      } else {
      }
    }

  });
});
