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


  var TutorialState = new function(){
    this.tutorial   = tutorialService.getTutorial();
    this.table      = tutorialService.getTable();
    this.page       = ko.observable();
  }

  return plugins.make({

    layout: function(url) {
      var $tutorial = $(template)[0];
      ko.applyBindings(TutorialState, $tutorial);
      $("#wrapper").replaceWith($tutorial);
    },

    route: function(url, breadcrumb) {
      breadcrumb([['tutorial/', "Tutorial"]]);
      if (url.parameters[0] === void 0 || url.parameters[0] === "") {
        TutorialState.page(0);
      } else {
        TutorialState.page(tutorialService.getPage(url.parameters[0]));
      }
    }

  });

});
