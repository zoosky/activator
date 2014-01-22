define([
  'core/router',
  'services/build',
  'widgets/buttons/dropdown',
  'text!templates/navigation.html',

  'css!./navigation',
  'css!./typesafe'
], function(
  router,
  build,
  dropdown,
  template
){

  var $navigation = $(template)[0];
  var recentApps = serverAppModel.recentApps;
  var links = [
    {
      title: 'Learn',
      links: [
        { url: 'tutorial',      title: "Tutorial" },
        { url: 'documentation', title: "Documentation" }
      ]
    },
    {
      title: 'Develop',
      links: [
        { url: 'code',          title: "Code" },
        { url: 'run',           title: "Run" , working: build.status.all, counterOff: build.errors.compile },
        { url: 'inspect',       title: "Inspect" },
        { url: 'test',          title: "Test" }
      ]
    },
    {
      title: 'Deliver',
      links: [
        // { url: 'versioning',    title: "Versioning" },
        // { url: 'integration',   title: "Integration Tests" },
        { url: 'deploy',        title: "Deploy" }
      ]
    }
  ]

  var working = function(f){
    var el = $(e.target).addClass("working");
    f(function(){
      el.removeClass("working");
    });
  }

  var Status = function(){
    this.running = ko.computed(function(){
      return true;
    });
    this.refresh = ko.computed(function(){
      return true;
    });
    this.console = ko.computed(function(){
      return false;
    });
    this.consoleDisabled = ko.computed(function(){
      return false;
    });
    this.testing = ko.computed(function(){
      return true;
    });
  }

  var NavigationState = {
    recentApps: recentApps,
    links: links,
    status: new Status(),
    build: build
  }

  ko.applyBindings(NavigationState, $navigation);

  setTimeout(function() {
    // Auto collapse the menu
    var navigationSneakTimer = 0;
    $("#header .toggleNavigation").mouseover(function(){
      $("body").not(".navigation-opened").addClass("navigation-sneak");
    });

    $("#rockets", $navigation)
      .mouseleave(function(){
        navigationSneakTimer = setTimeout(function(){
          $("body").removeClass("navigation-sneak");
        },200);
      })
      .mouseenter(function(){
        clearTimeout(navigationSneakTimer);
      });
  },0);

  dropdown($navigation);

  return $navigation;

});
