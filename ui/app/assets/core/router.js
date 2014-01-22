define(['./plugins', 'noir', 'jquery'], function(plugins) {

  var current    = ko.observable({});
  var breadcrumb = ko.observable([]);

  window.addEventListener("hashchange", function(e) {
    load(window.location.hash);
  });

  var load = function(url) {
    var plugin = parseUrl(url);
    require([plugin.pluginUrl], function(p) {
      if (current().plugin !== plugin.plugin) {
        p.layout(plugin);
      }
      current(plugin);
      !!p.route && p.route(plugin, breadcrumb);
    });
  }

  var parseUrl = function(url) {
    if (!url) url = "tutorial"; // Default page
    if (url[0] === "#") url = url.slice(1); // Remove extra hash
    var plugin = url.split("/")[0]; // Divide the path in sections
    return {
      path: url,
      plugin: plugin,
      pluginUrl: "plugins/" + plugin + "/" + plugin,
      parameters: url.split(/\/+/).slice(1)
    }
  }

  var isMe = function(url) {
    return ko.computed(function() {
      return current().plugin === url;
    });
  }

  return {
    current: current,
    load: load,
    isMe: isMe,
    breadcrumb: breadcrumb
  }
});
