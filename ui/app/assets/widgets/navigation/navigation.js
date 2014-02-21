define([
  'commons/settings',
  'core/router',
  'services/build',
  'widgets/buttons/dropdown',
  'text!templates/navigation.html',
  'css!./navigation',
  'css!./typesafe'
], function(
  settings,
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
        { url: 'code',           title: "Code" },
        {
          url: 'run',
          title: "Run",
          working: ko.computed(function() {
            return build.activity.compiling || build.activity.launching;
          }),
          counter: ko.computed(function() {
            return build.errors.compile().length;
          })
        },
        {
          url: 'test',
          title: "Test",
          working: build.activity.testing,
          counter: ko.computed(function() {
            return build.errors.test().length;
          })
        },
        {
          url: 'inspect',
          title: "Inspect",
          working: build.status.all,
          counter: ko.computed(function() {
            return build.errors.inspect().length;
          })
        }
      ]
    },
    {
      title: 'Deliver',
      links: [
        { url: 'deploy',         title: "Deploy" },
        { url: 'monitor',        title: "Monitor" }
      ]
    }
  ]

  var working = function(f){
    var el = $(e.target).addClass("working");
    f(function(){
      el.removeClass("working");
    });
  }

  var recompileOnChange         = settings.observable("build.recompileOnChange", true);
  var automaticFlushInspect     = settings.observable("build.automaticFlushInspect", true);
  var retestOnSuccessfulBuild   = settings.observable("build.retestOnSuccessfulBuild", false);

  var status = {
    running: build.activity.running,
    refresh: build.recompileOnChange,
    console: ko.computed(function(){
      return false;
    }),
    testing: build.retestOnSuccessfulBuild,

    // Aliases so we can use these in our html template.
    // This is a mess to clean up; we should just alias
    // 'build' or something then refer to these.
    // But doing this to keep changes in one commit smaller.
    // We want to just change the whole 'build' API anyway.
    // this.outputLogView = new log.LogView(build.run.outputLog);
    playAppLink: build.run.playAppLink,
    playAppStarted: build.run.playAppStarted,
    haveActiveTask: build.run.haveActiveTask,
    haveMainClass: build.run.haveMainClass,
    currentMainClass: build.run.currentMainClass,
    mainClasses: build.run.mainClasses,
    // this.rerunOnBuild = settings.build.rerunOnBuild;
    restartPending: build.run.restartPending,
    consoleCompatible: build.app.hasConsole,
    statusMessage: build.run.statusMessage
    // this.outputScroll = this.outputLogView.findScrollState();
  }

  // view model
  var NavigationState = {
    recentApps: recentApps,
    links: links,
    status: build.activity,
    build: build,
    settings: {
      recompileOnChange: recompileOnChange,
      automaticFlushInspect: automaticFlushInspect,
      retestOnSuccessfulBuild: retestOnSuccessfulBuild
    }
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
