/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['main/pluginapi', 'services/build', './console/console', 'services/connection', 'text!./inspect.html', 'css!./inspect.css'],
  function(api, build, Console, Connection, template){

    var InspectState = {
        flush: Connection.flush,
        consoleWidget: new Console()
    }
    Connection.flush();

    return {
        render: function() {
            var $inspect = $(template)[0];
            ko.applyBindings(InspectState, $inspect);
            return $inspect;
        },
        route: function(url, breadcrumb) {
            if (url.parameters == undefined || url.parameters.length == 0) {
              if (build.app.hasPlay()) {
                url.parameters = ["requests"];
              } else if (build.app.hasAkka()) {
                url.parameters = ["actors"];
              } else {
                url.parameters = ["deviations"];
              }
            }
            InspectState.consoleWidget.route(url.parameters);
        }
    }
});
