/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define([
  "core/plugins",
  "services/fs",
  "./documentState",
  "./projectFilesAndDir",
  "text!templates/code.html",
  "widgets/lists/browser",
  "css!./code"
], function(
  plugins,
  fs,
  documentState,
  projectFilesAndDir,
  template,
  browser
){

  var openedDocuments = ko.observableArray([]);
  var selectedDocument = ko.observable();
  var hasOpenedDocument = ko.computed(function(){ return !!openedDocuments().length; });

  // ------------------------

  var toggleDir = function(dir) {
    if (dir.children) {
      dir.opened(!dir.opened());
    } else if(dir) {
      projectFilesAndDir.loadUrl({parameters: dir.location.replace(serverAppModel.location, "").split("/") });
    }
  }

  var getStringAfterLastSlash = function(str) {
    var splited = str.split("/");
    return splited[splited.length-1];
  }

  // Recursively parse the tree
  var findInTree = function(path, branch) {
    // We still have one slice of the path to inspect
    if (path.length > 0 && path[0] !== null) {
      var current = path.shift(), next;
      if (current === ""){
        return findInTree(path, branch);
      } else if (branch){
        branch.children = branch.children || [];
        for (var i in branch.children){
          next = branch.children[i];
          if (next.name == current ) {
            return findInTree(path, next);
          }
        }
        return false;
      } else {
        return false;
      }

    // Mothing more to inpect... let's return the current branch
    } else {
      return branch;
    }
  }

  var loadUrl = function(url){ // url is an object from the router
    // Load all directories and files in the path
    var path = [""].concat(url.parameters); // [""] is project root
    var toLoad = [];

    // Is it already loaded in tree or not?
    var p;
    for (var i in path) {
      p = url.parameters.slice(0,i);
      if (!findInTree(p.slice(0), tree)){
        // Order here is important, we need parents to be parsed first
        toLoad.push( fs.browse( [serverAppModel.location].concat(p).join("/") ) );
      }
    }

    console.log(toLoad)
    // Starts all Ajax request at the same time
    if(toLoad.length) $.when.apply(null, toLoad).then(loadInTree);
  }

  var loadInTree = function(a){
    var paths;
    if (toString.call(a) == "[object Array]"){
      var paths = [].slice.call(arguments).map(function(it) { return it[0]; });
    } else {
      paths = [a];
    }
    // get parent in tree
    for (var i in paths) {
      relativePath = paths[i].location.replace(serverAppModel.location, "").split("/");

      // Not root folder
      if (relativePath.length && tree) {
        var branch = findInTree(relativePath.slice(0), tree);
        // Put the children loaded from Ajax in the object
        branch.children = paths[i].children;
        // Also open the directory by default
        branch.opened = ko.observable(true);

      // Root folder
      } else {
        tree = paths[i];
        tree.opened = ko.observable(true);
      }
    }
    reloadTree(reloadTree()+1);
  }

  var toggleDir = function(dir) {
      console.log(dir)
    if (dir.children && dir.opened) {
      dir.opened(!dir.opened);
    } else if(dir) {
      console.log({parameters: dir.location.replace(serverAppModel.location, "").split("/") })
      loadUrl({parameters: dir.location.replace(serverAppModel.location, "").split("/") });
    }
  }

  var openFile = function(newdoc) {
    var foundDocIndex, doc, od = openedDocuments();

    // Use relative path
    newdoc.location = newdoc.location.replace(serverAppModel.location, "");

    // Is it loaded already?
    for (var index in od){
      doc = od[index];
      if (doc.location == newdoc.location){
        foundDocIndex = parseInt(index);
        break;
      }
    }
    if (foundDocIndex === undefined){
      doc = new documentState(newdoc);
      openedDocuments.push(doc);
    }
    makeFileActive(doc);
  }

  var closeFile = function(newdoc, e) {
    e.preventDefault();
    e.stopPropagation();
    if (newdoc.edited() && !confirm("Do you really want to close without saving?")) return false;
    var foundDocIndex, doc;
    for (var index in openedDocuments()){
      doc = openedDocuments()[index];
      if (doc.location == newdoc.location){
        foundDocIndex = parseInt(index);
        break;
      }
    }
    if (foundDocIndex !== undefined ){
      var sel = selectedDocument();
      if (doc.location == sel.location){
        if (openedDocuments().length > 1){
          makeFileActive(openedDocuments()[
            // Activate the closest document
            foundDocIndex == openedDocuments().length -1
              ? foundDocIndex-1
              : foundDocIndex+1
          ]);
        } else {
          // It was the only document, nothing to activate
          makeFileActive(0);
        }
      }
      openedDocuments.splice(foundDocIndex, 1);
    }
  }

  var makeFileActive = function(doc) {
    var sel;
    if (sel = selectedDocument()) sel.active(false);
    if (doc){
      doc.active(true);
      window.location.hash = "code"+doc.location;
    } else {
      window.location.hash = "code/";
    }
    selectedDocument(doc);
  }

  // View model
  var CodeState = {
    tree: projectFilesAndDir.tree,
    openedDocuments: openedDocuments,
    toggleDir: toggleDir,
    openFile: openFile,
    closeFile: closeFile,
    selectedDocument: selectedDocument,
    makeFileActive: makeFileActive,
    hasOpenedDocument: hasOpenedDocument
  }

  return plugins.make({

    layout: function(url) {
      var $code = $(template)[0];
      // Dynamically add the browser template
      $(".browser", $code).append(browser());
      ko.applyBindings(CodeState, $code);
      $("#wrapper").replaceWith($code);

      if (url.parameters[0]){
        // Load all directories and files in the path
        projectFilesAndDir.loadUrl(url);

        var fileLocation = "/"+url.parameters.join("/");
        fs.browse(fileLocation).success(openFile);

      } else if (!selectedDocument()){
        projectFilesAndDir.loadUrl(url);
        window.location.hash = "code/";
      }

    },

    route: function(url, breadcrumb) {
      var all = [['code/', "Code"]];
      breadcrumb(all.concat([["code/"+url.parameters.join("/"),url.parameters.join("/")]]));
    }

  });
});
