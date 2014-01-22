define([
  "core/plugins",
  "services/fs",
  "text!templates/code.html",
  "widgets/lists/browser",
  "css!./code"
], function(
  plugins,
  fs,
  template,
  browser
){

  var tree = fs.tree();
  var openedDocuments = ko.observableArray([]);
  var selectedDocument = ko.observable();
  var visible = ko.computed(function(){
    return !!openedDocuments().length;
  });

  var documentState = function(doc){
    var self = this;
    this.title = doc.title;
    this.location = doc.location;
    this.active = ko.observable(false);
    this.scroll = ko.observable(0);
    this.body = ko.observable("");
    this.working = ko.observable(false);
    this.undo = []; // Ace undo history

    // Save document
    this.save = function(callback){
      self.working(true);
      fs.save(self.location, self.body(), function() {
        self.working(false);
      });
    }

    // Get saved version
    this.restore = function(){
      self.working(true);
      fs.get(self.location, function(data) {
        self.working(false);
        self.body(data);
      });
    this.restore();
    }

    // Move == Rename
    this.move = function(newLocation){
      self.working(true);
      fs.move(self.location, newLocation, function() {
        self.working(false);
        // More to do... in the tree
      });
    }
  }

  var openFile = function(newdoc) {
    console.log(newdoc)
    var foundDocIndex, doc;
    // Is it loaded already?
    for (var index in openedDocuments()){
      doc = openedDocuments()[index];
      if (doc.location == newdoc.location){
        foundDocIndex = parseInt(index);
        break;
      }
    }
    if (foundDocIndex === undefined){
      doc = new documentState(newdoc);
      openedDocuments.push(doc);
    }
    makeActive(doc);
  }

  var closeFile = function(newdoc, e) {
    e.preventDefault();
    e.stopPropagation();
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
          makeActive(openedDocuments()[
            // Activate the closest document
            foundDocIndex == openedDocuments().length -1
              ? foundDocIndex-1
              : foundDocIndex+1
          ]);
        } else {
          // It was the only document, nothing to activate
          makeActive(0);
        }
      }
      openedDocuments.splice(foundDocIndex, 1);
    }
  }

  var makeActive = function(doc) {
    var sel;
    if (sel = selectedDocument()) sel.active(false);
    if (doc){
      doc.active(true);
      window.location.hash = "code"+doc.location;
    } else {
      window.location.hash = "code/";
    }
    selectedDocument(doc); // Set null if null
  }

  var CodeState = {
    tree: tree,
    openedDocuments: openedDocuments,
    openFile: openFile,
    closeFile: closeFile,
    selectedDocument: selectedDocument,
    makeActive: makeActive,
    visible: visible
  }

  return plugins.make({

    layout: function(url) {
      var $code = $(template)[0];
      $(".browser", $code).append(browser());
      ko.applyBindings(CodeState, $code);
      $("#wrapper").replaceWith($code);
    },

    route: function(url, breadcrumb) {
      var all = [['code/', "Code"]];
      breadcrumb(all.concat([["code/"+url.parameters.join("/"),url.parameters.join("/")]]));
      if (url.parameters[0]){
        openFile({
          title: url.parameters[url.parameters.length-1],
          location: "/"+url.parameters.join("/")
        });
      } else if (!selectedDocument()){
        breadcrumb(all);
        window.location.hash = "code/";
      }
    }

  });
});
