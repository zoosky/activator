define([
  "core/plugins",
  "services/tutorial",
  "text!templates/tutorial.html",
  "text!templates/tutorial-pannel.html",
  "commons/functions",
  "css!./tutorial",
  "css!widgets/navigation/menu"
], function(
  plugins,
  tutorialService,
  template,
  templatePannel,
  funcs
){

  var ifCurrentPlugin = function() {
    return window.location.hash.indexOf("#tutorial") == 0;
  }

  var TutorialState   = new function(){
    var self = this;

    this.tutorial     = tutorialService.getTutorial();
    this.table        = tutorialService.getTable();
    this.page         = ko.observable();

    this.gotoPrevPage = function(){
      if (ifCurrentPlugin()){
        window.location.hash = "#tutorial/"+ (self.page().index-1 || 0)
      } else {

      }
    }
    this.gotoNextPage = function(){
      window.location.hash = "#tutorial/"+ (self.page().index+1 || 0)
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

    layout: function(url) {
      var $tutorial = $(template)[0];
      ko.applyBindings(TutorialState, $tutorial);
      $("#wrapper").replaceWith($tutorial);
    },

    renderPannel: function() {
      var $templatePannel = $(templatePannel)[0];
      $('.dropdown',$templatePannel).dropdown();
      ko.applyBindings(TutorialState, $templatePannel);
      $("#pannelWrapper").replaceWith($templatePannel);
    },

    route: function(url, breadcrumb) {
      if (url.parameters[0] === void 0 || url.parameters[0] === "") {
        TutorialState.page(0); // No page
        breadcrumb([['tutorial/', "Tutorial"]]);
      } else {
        TutorialState.gotoPage(url.parameters[0]);
        if (TutorialState.page())
          breadcrumb([['tutorial/', "Tutorial"],['tutorial/'+url.parameters[0], TutorialState.page().title]]);
      }
    },

    keyboard: function(key) {
      if (key == "TOP" && !TutorialState.noPrevPage()) {
        TutorialState.gotoPrevPage();
      } else if (key == "BOTTOM" && !TutorialState.noNextPage()) {
        TutorialState.gotoNextPage();
      }
    }

  }

});
