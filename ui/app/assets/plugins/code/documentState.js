/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define([
  "services/fs"
], function(
  fs
){

  // Every opened document has a document state
  return function(doc){
    var self = this;
    this.name = doc.name;
    this.humanLocation = doc.humanLocation;
    this.location = doc.location.replace(serverAppModel.location, "");
    this.active = ko.observable(false);
    this.scroll = ko.observable(0);
    this.body = ko.observable("");
    this.edited = ko.observable(false);
    this.working = ko.observable(false);
    this.undo = []; // Ace undo history

    fs.show(doc.humanLocation).success(function(data) {
      self.body(data);
      self.body.subscribe(function(newBody) {
        self.edited(newBody != data);
      });
    });

    // Save document
    this.save = function(callback){
      self.working(true);
      fs.save(self.location, self.body(), function() {
        self.edited(false);
        self.working(false);
      });
    }

    // Get saved version
    this.restore = function(){
      self.working(true);
      fs.get(self.location, function(data) {
        self.working(false);
        self.edited(false);
        self.body(data);
      });
      // this.restore();
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

});
