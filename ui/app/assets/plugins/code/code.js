/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['main/plugins', 'text!./home.html', './files', './browse', './view', './openIn', 'css!./code.css'],
    function(plugins, template, files, Browser, Viewer, openIn, css) {

  var CodeState = (function(){
    var self = {};

    self.relativeCrumbs = ko.observableArray([]);
    self.root = new files.FileModel({
      location: serverAppModel.location,
      autoLoad: true
    });
    self.currentDirectory = ko.computed(function() {
      var dir = self.root;
      var crumbs = self.relativeCrumbs();
      for(var idx = 0; idx < crumbs.length; idx++) {
        var files = dir.childLookup();
        var crumb = crumbs[idx];
        if(files.hasOwnProperty(crumb) && files[crumb].loadInfo().isDirectory()) {
          dir = files[crumb];
        } else {
          return dir;
        }
      }
      return dir;
    });
    self.currentFile = ko.computed(function() {
      var file= self.root;
      var crumbs = self.relativeCrumbs();
      for(var idx = 0; idx < crumbs.length && file.isDirectory(); idx++) {
        var files = file.childLookup();
        var crumb = crumbs[idx];
        if(files.hasOwnProperty(crumb)) {
          file = files[crumb];
        } else {
          return file;
        }
      }
      return file;
    });
    self.status = ko.observable('');
    self.openInEclipse = new openIn.OpenInEclipse();
    self.openInIdea = new openIn.OpenInIdea();
    self.browser = new Browser({
      directory: self.currentDirectory,
      rootAppPath: serverAppModel.location,
      openInEclipse: self.openInEclipse.open.bind(self.openInEclipse),
      openInIdea: self.openInIdea.open.bind(self.openInIdea)
    });
    self.viewer = new Viewer({
      file: self.currentFile
    });
    var onSave = function() {
      if (self.viewer.subView().save)
        self.viewer.subView().save();
      else
        alert("Saving this kind of file is not supported");
    };
    self.keybindings = [
      [ 'ctrl-s', onSave, { preventDefault: true } ],
      [ 'defmod-s', onSave, { preventDefault: true } ]
    ];

    self.setCrumbs = function(crumbs) {
      var line = -1;
      var length = crumbs.length;
      if (length != 0) {
        var last = crumbs[length - 1];
        var colon = last.lastIndexOf(':');
        if (colon >= 0) {
          var maybe = parseInt(last.substring(colon + 1), 10);
          if (typeof(maybe) == 'number' && !isNaN(maybe)) {
            line = maybe;
            crumbs[length - 1] = crumbs[length - 1].substring(0, colon);
          }
        }
      }

      this.relativeCrumbs(crumbs);
      if (line >= 0)
        this.viewer.scrollToLine(line);
    }
    self.setCrumbsAfterSave = function(crumbs) {
      var self = this;
      this.viewer.saveBeforeSwitchFiles(function() {
        debug && console.log("Saved before switching to new file");
        self.setCrumbs(crumbs);
      }, function() {
        debug && console.log("File switch canceled or save failed");
        // re-select the previous file
        self.currentFile().select();
      });
    }

    return self;
  }());

  return {
    render: function(url) {
      var $code = $(template)[0];
      ko.applyBindings(CodeState, $code);
      return $code;
    },

    route: plugins.memorizeUrl(function(url, breadcrumb) {
      var all = [['code/', "Code"]];
      breadcrumb(all.concat([["code/"+url.parameters.join("/"),url.parameters.join("/")]]));

      if (url.parameters[0]){
        CodeState.setCrumbsAfterSave(url.parameters);
      }
    })
  }

});
