define(['services/build'], function(build) {

  var plugins = [
    {
      title: 'Learn',
      links: [
        {
          plugin: 'plugins/tutorial/tutorial',
          url: 'tutorial',
          title: "Tutorial",
          pannel: 'Tutorial'
        },
        {
          plugin: 'plugins/documentation/documentation',
          url: 'documentation',
          title: "Documentation"
        }
      ]
    },
    {
      title: 'Develop',
      links: [
        {
          plugin: 'plugins/code/code',
          url: 'code',
          title: "Code"
        },
        {
          plugin: 'plugins/run/run',
          url: 'run',
          title: "Run",
          working: ko.computed(function() {
            return build.activity.compiling || build.activity.launching;
          }),
          counter: ko.computed(function() {
            return build.errors.compile().length;
          })
        },
        {
          plugin: 'plugins/test/test',
          url: 'test',
          title: "Test",
          working: build.activity.testing,
          counter: ko.computed(function() {
            return build.errors.test().length;
          })
        },
        {
          plugin: 'plugins/inspect/inspect',
          url: 'inspect',
          title: "Inspect",
          working: build.status.all,
          counter: ko.computed(function() {
            return build.errors.inspect().length;
          })
        }
      ]
    },
    {
      title: 'Deliver',
      links: [
        {
          plugin: 'plugins/deploy/deploy',
          url: 'deploy',
          title: "Deploy"
        },
        {
          plugin: 'plugins/monitor/monitor',
          url: 'monitor',
          title: "Monitor"
        }
      ]
    }
  ]

  var find = function(id) {
    // find plugin
    gouploop:
    for (i in plugins){
      var group = plugins[i].links;
      for (j in group){
        var plugin = group[j];
        if (plugin.url == id){
          return plugin;
        }
      }
    }
    // 404??
  }

  // This will redirect without adding a new state in browser history
  var redirect = function(hash) {
    if (history.replaceState != null) {
      return history.replaceState(null, null, '#' + hash);
    }
  }

  var make = function(p) {
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
    return self;
  }

  // Transform the list to bind some behaviours
  return {
    plugins: plugins,
    find: find,
    make: make
  }
});
