define(['./plugins', 'noir', 'jquery'], function(plugins) {

  var current    = ko.observable({});
  var breadcrumb = ko.observable([]);

  window.addEventListener("hashchange", function(e) {
    load(window.location.hash);
  });

  var load = function(url) {
    var metas = parseUrl(url);
    require(['plugins/'+metas.plugin+'/'+metas.plugin], function(plugin) {
      if (current().plugin !== url) {
        plugin.render(plugin);
        current(plugin);
      }
      !!plugin.route && plugin.route(metas, breadcrumb);
    });
  }

  var parseUrl = function(url) {
    if (!url) url = "tutorial"; // Default plugin
    if (url[0] === "#") url = url.slice(1); // Remove extra hash
    var plugin = url.split("/")[0]; // Divide the path in sections
    return {
      path: url,
      plugin: plugin,
      pluginUrl: "plugins/" + plugin + "/" + plugin,
      parameters: url.split(/\/+/).slice(1)
    }
  }

  // This will redirect without adding a new state in browser history
  var redirect = function(hash) {
    if (history.replaceState != null) {
      return history.replaceState(null, null, '#' + hash);
    }
  }

  return {
    current: current,
    load: load,
    breadcrumb: breadcrumb,
    redirect: redirect
  }

});
