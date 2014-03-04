define(['services/build', 'main/router'], function(build, router) {

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
        // {
        //   plugin: 'plugins/code/code',
        //   url: 'code',
        //   title: "Code"
        // },
        // {
        //   plugin: 'plugins/run/run',
        //   url: 'run',
        //   title: "Run",
        //   working: ko.computed(function() {
        //     return build.activity.compiling || build.activity.launching;
        //   }),
        //   counter: ko.computed(function() {
        //     return build.errors.compile().length;
        //   })
        // },
        // {
        //   plugin: 'plugins/test/test',
        //   url: 'test',
        //   title: "Test",
        //   working: build.activity.testing,
        //   counter: ko.computed(function() {
        //     return build.errors.test().length;
        //   })
        // },
        // {
        //   plugin: 'plugins/inspect/inspect',
        //   url: 'inspect',
        //   title: "Inspect",
        //   working: build.status.all,
        //   counter: ko.computed(function() {
        //     return build.errors.inspect().length;
        //   })
        // }
      ]
    },
    {
      title: 'Deliver',
      links: [
        // {
        //   plugin: 'plugins/deploy/deploy',
        //   url: 'deploy',
        //   title: "Deploy"
        // },
        // {
        //   plugin: 'plugins/monitor/monitor',
        //   url: 'monitor',
        //   title: "Monitor"
        // }
      ]
    }
  ]

  // this will basically remember last url from this plugin for next time
  var memorizeUrl = function(ƒ) {
    var routeState = {};
    return function(url, breadcrumb) {
      // We have parameters, put in cache
      if (url.parameters.length) {
        routeState.url = url;

      // No parameters, but some in cache
      } else if (routeState.url) {
        url = routeState.url;
        router.redirect(url.path);

      // Nothing? Use `home`
      } else {
        url.parameters = [];
      }

      return ƒ(url, breadcrumb);
    }
  }

  // Transform the list to bind some behaviours
  return {
    plugins: plugins,
    memorizeUrl: memorizeUrl
  }
});
