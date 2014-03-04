define(['services/build', 'main/router'], function(build, router) {

  /*
   group: logical grouping of plugins
   groupPlugins : [
     {
       plugin:  the path to the plugin
       url:     routing id
       title:   what's presented in the list
       panel:   if available the plugin will be shown in panel list
     }
   ]
   */

  // TODO : add new plugins here below and remove them from legacy router at the same time
  //        see router.js
  var plugins = [
    {
      group: 'Learn',
      groupPlugins: [
        {
          plugin: 'plugins/tutorial/tutorial',
          url: 'tutorial',
          title: "Tutorial",
          panel: 'Tutorial'
        }
      ]
    }
  ]

  // this will basically remember last url from this plugin for next time
  var memorizeUrl = function(fn) {
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

      return fn(url, breadcrumb);
    }
  }

  // Transform the list to bind some behaviours
  return {
    plugins: plugins,
    memorizeUrl: memorizeUrl
  }
});
