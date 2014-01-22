/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define([
  "services/fs"
], function(
  fs
){

  // folders and files tree cache
  var tree = ko.observable();

  // ------------------------

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
      var branch = findInTree(p.slice(0), tree());
      if (!branch || !branch.children){
        // Order here is important, we need parents to be parsed first
        toLoad.push( fs.browse( [serverAppModel.location].concat(p).join("/") ) );
      }
    }

    // Starts all Ajax request at the same time
    if(toLoad.length) $.when.apply(null, toLoad).then(loadInTree);
  }

  var loadInTree = function(a){
    var treeCache = tree();
    // Inconsitency in jquery $.when (passes an array if multiple request, or an object)
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
      if (relativePath.length && treeCache) {
        var branch = findInTree(relativePath.slice(0), treeCache);
        // Put the children loaded from Ajax in the object
        branch.children = paths[i].children;
        // Also open the directory by default
        branch.opened = ko.observable(true);

      // Root folder
      } else {
        treeCache = paths[i];
        treeCache.opened = ko.observable(true);
      }
    }

    tree(treeCache);
    // reloadTree(reloadTree()+1);
  }

  return {
    tree: tree,
    loadUrl: loadUrl
  }

});
