define([
  "core/plugins",
  "services/tutorial",
  "text!templates/tutorial.html",
  "commons/functions",
  "css!./tutorial",
  "css!widgets/navigation/menu"
], function(
  plugins,
  tutorialService,
  template,
  funcs
){

  var TutorialState   = new function(){
    var self = this;

    this.tutorial     = tutorialService.getTutorial();
    this.table        = tutorialService.getTable();
    this.page         = ko.observable();

    this.gotoPrevPage = function(){
      window.location.hash = "#tutorial/"+ (self.page().index-1)
    }
    this.gotoNextPage = function(){
      window.location.hash = "#tutorial/"+ (self.page().index+1)
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

  return plugins.make({

    layout: function(url) {
      var $tutorial = $(template)[0];
      ko.applyBindings(TutorialState, $tutorial);
      $("#wrapper").replaceWith($tutorial);
    },

    route: function(url, breadcrumb) {
      if (url.parameters[0] === void 0 || url.parameters[0] === "") {
        breadcrumb([['tutorial/', "Tutorial"]]);
        TutorialState.page(0);
      } else {
        // Tutorial may not be loaded
        if (tutorialService.tutorialLoaded.state() == "resolved"){
          p = tutorialService.getPage(url.parameters[0]);
          breadcrumb([['tutorial/', "Tutorial"],['tutorial/'+url.parameters[0], p.title]]);
          TutorialState.page(p);
        } else {
          var func = arguments.callee, args = [].slice.call(arguments);
          tutorialService.tutorialLoaded.then(function() {
            func.apply(this, args);
          });
        }
      }
    },

    keyboard: function(key) {
      if (key == "TOP" && !TutorialState.noPrevPage()) {
        TutorialState.gotoPrevPage();
      } else if (key == "BOTTOM" && !TutorialState.noNextPage()) {
        TutorialState.gotoNextPage();
      }
    }

  });

});
