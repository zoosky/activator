define([
  "core/plugins",
  "text!templates/deploy.html",
  "css!./deploy",
  "css!widgets/navigation/menu"
], function(
  plugins,
  template
){

  var local = [
    {
      id: 'publish-local',
      title: "Publish Local",
      plugin: ("plugins/inpsect/console/system")
    },
    {
      id: 'zip',
      title: "Export a zip",
      plugin: ("plugins/inpsect/console/system")
    }
  ];

  var providers = [
    {
      id: 'heroku',
      title: "Heroku",
      plugin: ("plugins/inpsect/console/system")
    },
    {
      id: 'cloudbees',
      title: "CloudBees",
      plugin: ("plugins/inpsect/console/actors")
    },
    {
      id: 'google-gce',
      title: "Google GCE",
      plugin: ("plugins/inpsect/console/requests")
    },
    {
      id: 'amazon-aws',
      title: "Amazon AWS",
      plugin: ("plugins/inpsect/console/deviations")
    },
    {
      id: 'clever-cloud',
      title: "Clever Cloud",
      plugin: ("plugins/inpsect/console/rest")
    }
  ]

  var DeployState = {
    page: ko.observable(),
    local: local,
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
      breadcrumb([['deploy/', "Deploy"]]);
      if (url.parameters[0] === void 0 || url.parameters[0] === "") {
      } else {
      }
    }

  });
});
