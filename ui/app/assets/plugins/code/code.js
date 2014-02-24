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

  // This is for keyboard navigation
  var focusIndex = -1;
  var visibleItems;
  var setFocus = function() {
    setTimeout(function() {
      visibleItems = $(".browser .fileTree .name:visible");
      if (focusIndex >= 0) visibleItems.eq(focusIndex).addClass('focus');
    },0);
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
    hasOpenedDocument: hasOpenedDocument,
    setFocus: setFocus
  }


  return {

    render: function(url) {
      var $code = $(template)[0];
      // Dynamically add the browser template
      $(".browser", $code).append(browser());
      ko.applyBindings(CodeState, $code);
      $("#wrapper").replaceWith($code);

    },

    route: function(url, breadcrumb) {
      var all = [['code/', "Code"]];
      breadcrumb(all.concat([["code/"+url.parameters.join("/"),url.parameters.join("/")]]));

      if (url.parameters[0]){
        // Load all directories and files in the path
        projectFilesAndDir.loadUrl(url);

        var fileLocation = serverAppModel.location+"/"+url.parameters.join("/");
        fs.browse(fileLocation).success(openFile);

      } else if (!selectedDocument()){
        projectFilesAndDir.loadUrl(url);
        window.location.hash = "code/";
      }
    },

    // Complex keyboard navigation
    keyboard: function(key,m,e) {

      if (key == "TOP" || key == "BOTTOM"){
        e.preventDefault();
        e.stopPropagation();
        var focus;
        var list = visibleItems;
        list.removeClass('focus');
        if (key == "TOP"){
          focusIndex = focusIndex>0?focusIndex-1:(list.length-1);
        } else if (key == "BOTTOM"){
          focusIndex = focusIndex>=0&&focusIndex<(list.length-1)?focusIndex+1:0;
        }
        focus = list.eq(focusIndex);
        focus.addClass('focus').scrollReveal();
        return false;

      } else if (key == "RIGHT"){
        var focus = $(".browser .fileTree .focus");
        e.preventDefault();
        e.stopPropagation();
        if (focus.parent().is('.file')) {
          focus.trigger("click");
        } else if (focus.parent().is('.directory:not(.open)')) {
          focus.trigger("click");
          visibleItems = $(".browser .fileTree .name:visible");
        }
        return false;

      } else if (key == "LEFT"){
        var focus = $(".browser .fileTree .focus");
        if (focus.parent().is('.directory.open')) {
          e.preventDefault();
          e.stopPropagation();
          focus.trigger("click");
          visibleItems = $(".browser .fileTree .name:visible");
        }
        return false;

      } else if (key == "W"){
        var active = $(".tabs .active");
        if (active.length) {
          e.preventDefault();
          e.stopPropagation();
          active.find('.close').trigger("click");
        }
        return false;
      }
    }

  }
});
