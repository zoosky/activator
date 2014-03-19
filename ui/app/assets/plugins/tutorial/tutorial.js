/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define([
  "main/plugins",
  "main/router",
  "services/tutorial",
  "text!./tutorial.html",
  // "text!templates/tutorial-pannel.html",
  "css!./tutorial",
  "css!widgets/navigation/menu"
], function(
  plugins,
  router,
  tutorialService,
  template
  // templatePannel
){

  var ifCurrentPlugin = function() {
    return window.location.hash.indexOf("#tutorial") == 0;
  }

  var TutorialState   = new function(){
    var self = this;

    this.tutorial     = tutorialService.getTutorial(null);
    this.table        = tutorialService.getTable(null);
    this.page         = ko.observable(null);

    this.gotoPrevPage = function(){
      self.gotoPage(self.page().index-1 || 0);
    }
    this.gotoNextPage = function(){
      self.gotoPage(self.page().index+1 || 0);
    }
    this.gotoPage = function(i){
      // Tutorial may not be loaded
      if (tutorialService.tutorialLoaded.state() == "resolved"){
        p = tutorialService.getPage(i);
        self.page(p);
        if (ifCurrentPlugin()){
          window.location.hash = "#tutorial/"+i;
        }
      } else {
        tutorialService.tutorialLoaded.then(function() {
          self.gotoPage(i);
        });
      }
    }

    this.noPrevPage  = ko.computed(function(){
      if (self.page())
        return self.page().index == 0;
      else
        return false;
    });
    this.noNextPage  = ko.computed(function(){
      if (self.page())
        return self.page().index == (self.table().length-1);
      else
        return false;
    });
  }

  return {

    render: function(url) {
      var $tutorial = $(template)[0];
      ko.applyBindings(TutorialState, $tutorial);
      return $tutorial;
    },

    // TODO: put this back when Pannels are re-activated
    // renderPannel: function() {
    //   var $templatePannel = $(templatePannel)[0];
    //   $('.dropdown',$templatePannel).dropdown();
    //   ko.applyBindings(TutorialState, $templatePannel);
    //   $("#pannelWrapper").replaceWith($templatePannel);
    // },

    // We can't use memorizeUrl because the pannel can modify the url
    route: function(url, breadcrumb) {
      // TODO: Add introduction view
      if (url.parameters[0] === undefined || url.parameters[0] === "") {
        if (TutorialState.page()){
          router.redirect('tutorial/'+TutorialState.page().index)
        } else {
          // TutorialState.page(0); // No page
          TutorialState.gotoPage(0);
          breadcrumb([['tutorial/', "Tutorial"]]);
        }
      } else {
        TutorialState.gotoPage(url.parameters[0]);
        if (TutorialState.page())
          breadcrumb([['tutorial/', "Tutorial"],['tutorial/'+url.parameters[0], TutorialState.page().title]]);
      }
    }

    // TODO : Plugin this when keyboard is introduced
    // keyboard: function(key) {
    //   if (key == "TOP" && !TutorialState.noPrevPage()) {
    //     TutorialState.gotoPrevPage();
    //   } else if (key == "BOTTOM" && !TutorialState.noNextPage()) {
    //     TutorialState.gotoNextPage();
    //   }
    // }

  }

});
