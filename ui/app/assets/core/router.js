define(['./plugins', 'noir', 'jquery'], function(plugins) {

  var current    = ko.observable({});
  var breadcrumb = ko.observable([]);

  window.addEventListener("hashchange", function(e) {
    load(window.location.hash);
  });

  var load = function(url) {
    var metas = parseUrl(url);
    var plugin = plugins.find(metas.plugin);

    // If not loaded yet
    if (!plugin.reference) {
      require([plugin.plugin], function(p) {
        plugin.reference = plugins.make(p);
        load(url);
      });
    } else {
      if (current().plugin !== plugin.plugin) {
        plugin.reference.layout(plugin);
        current(plugin);
      }
      !!plugin.reference.route && plugin.reference.route(metas, breadcrumb);
    }
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

  return {
    current: current,
    load: load,
    breadcrumb: breadcrumb
  }

});
