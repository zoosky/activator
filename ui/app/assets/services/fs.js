define(function() {

  var tree = ko.observableArray([
    { name: "app", location: "/app", isDirectory: true, opened: ko.observable(false), children: [
      { name: "controllers", location: "/app/controllers", isDirectory: true, opened: ko.observable(false), children: [
        { name: "application.scala", location: "/app/controllers/application.scala" }
      ]},
      { name: "models", location: "/app/models", isDirectory: true, opened: ko.observable(false), children: [
        { name: "model.scala", location: "/app/controllers/model.scala" }
      ]},
      { name: "views", location: "/app/views", isDirectory: true, opened: ko.observable(false), children: [
        { name: "index.scala.html", location: "/app/controllers/index.scala.html" }
      ]}
    ]},
    { name: "conf", location: "/conf", isDirectory: true, opened: ko.observable(false), children: [
      { name: "application.conf", location: "/app/controllers/application.conf" },
      { name: "routes", location: "/app/controllers/routes" }
    ]},
    { name: "project", location: "/project", isDirectory: true, opened: ko.observable(false), children: [
      { name: "build.properties", location: "/app/controllers/build.properties" }
    ]},
    { name: "public", location: "/public", isDirectory: true, opened: ko.observable(false), children: [
      { name: "javascripts", location: "/app/javascripts", isDirectory: true, opened: ko.observable(false), children: []},
      { name: "images", location: "/app/images", isDirectory: true, opened: ko.observable(false), children: []},
      { name: "stylesheets", location: "/app/stylesheets", isDirectory: true, opened: ko.observable(false), children: []}
    ]},
    { name: "README", location: "/app/controllers/README" }
  ]);


  return {
    open: function(location) {
      return $.ajax({
        url: '/api/local/open',
        type: 'GET',
        data: {
          location: location
        }
      });
    },

    create: function(location, isDirectory) {
      return $.ajax({
        url: '/api/local/create',
        type: 'PUT',
        dataType: 'text',
        data: {
          location: location,
          isDirectory: isDirectory
        }
      });
    },

    browse: function(location) {
      return $.ajax({
        url: '/api/local/browse',
        type: 'GET',
        dataType: 'json',
        data: {
          location: location
        }
      });
    },

    browseRoots: function(location) {
      return $.ajax({
        url: '/api/local/browseRoots',
        type: 'GET',
        dataType: 'json'
      });
    },

    // Fetch utility
    show: function(location){
      return $.ajax({
        url: '/api/local/show',
        type: 'GET',
        dataType: 'text',
        data: { location: location }
      });
    },

    save: function(location, code) {
      return $.ajax({
        url: '/api/local/save',
        type: 'PUT',
        dataType: 'text',
        data: {
          location: location,
          content: code
        }
      });
    },

    rename: function(location, newName) {
      return $.ajax({
        url: '/api/local/rename',
        type: 'PUT',
        dataType: 'text',
        data: {
          location: location,
          newName: newName
        }
      });
    },

    directory: function(path) {
      var deffered;
      deffered = $.Deferred();
      setTimeout(function() {
        var i, isDirectory, o, v;
        o = "Lorem ipsum dolor sit amet consectetur adipiscing elit Aenean viverra massa eget massa ullamcorper id vehicula est porttitor Donec rhoncus cursus nisl vitae sodales".split(" ");
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);;
        for (i in o) {
          v = o[i];
          isDirectory = !!Math.floor(Math.random() * 2);
          var parent = path=="/"?"":path;
          var p = !isDirectory?v+".ext":v;
          o[i] = {
            name: p,
            isDirectory: isDirectory,
            path: parent + "/" + p
          };
        }
        return deffered.resolve(o.slice(0, new Date() % o.length + 3));
      }, 100);
      return deffered.promise();
    },

    newFile: function(path, name) {},

    moveFile: function(path, newPath) {},

    newFolder: function(path, name) {},

    saveFile: function() {},

    // current project tree
    tree: function() { return tree }

  }
});
