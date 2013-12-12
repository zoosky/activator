/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['webjars!knockout', './router', 'commons/settings', 'plugins/tutorial/tutorial', 'widgets/log/log', './keyboard'],
    function(ko, router, settings, Tutorial, log, keyboard) {
  // Model for the whole app view; created in two parts
  // so that this first part is available during construction
  // of the second part.
  return {
    plugins: null, // filled in by init
    router: router,
    tutorial: new Tutorial(),
    snap: {
      activeWidget: ko.observable(""),
      navigationOpened: ko.observable( settings.get("app.navigationOpened", true) ),
      navigationSneak: ko.observable( false ),
      navigationSneakTimer: 0,
      omnisearchString: ko.observable(""),
      omnisearchStringLast: "",
      omnisearchBusy: ko.observable(false),
      omnisearchActive: ko.observable(false),
      omnisearchOptions: ko.observableArray([]),
      omnisearchSelected: ko.observable(0),
      panelDropdownActive: ko.observable(false),
      panelOpened: ko.observable( settings.get("app.panelOpened", false) ),
      panelShape: ko.observable( settings.get("app.panelShape", "right1") ),
      pageTitle: ko.observable(),
      // TODO load last value from somewhere until we get a message from the iframe
      signedIn: ko.observable(false),
      app: {
        name: ko.observable(window.serverAppModel.name ? window.serverAppModel.name : window.serverAppModel.id),
        hasAkka: ko.observable(false),
        hasPlay: ko.observable(false),
        hasConsole: ko.observable(false)
      },
      toggleNavigation: function(){
        this.snap.navigationOpened(!this.snap.navigationOpened());
        this.snap.navigationSneak(this.snap.navigationOpened());
        settings.set("app.navigationOpened", this.snap.navigationOpened());
      },
      sneakNavigationOn: function(){
        if (!this.snap.navigationOpened()) {
          this.snap.navigationSneak(true);
        }
      },
      sneakNavigationShow: function(){
        clearTimeout(this.snap.navigationSneakTimer);
      },
      sneakNavigationHide: function(){
        var navigationSneak = this.snap.navigationSneak;
        this.snap.navigationSneakTimer = setTimeout(function(){
          navigationSneak(false);
        } ,500);
      },
      omnisearch: function(data, event){
        switch (event.keyCode) {
          // Escape
          case 27:
            event.target.blur();
            break;
          // Return
          case 13:
            var selectedUrl = this.snap.omnisearchOptions()[this.snap.omnisearchSelected()].url;
            if (selectedUrl) {
              location.href = selectedUrl;
              event.target.blur();
            }
            break;
          // Up
          case 38:
            if (this.snap.omnisearchSelected() > 0) {
              this.snap.omnisearchSelected(this.snap.omnisearchSelected() - 1);
            } else {
              this.snap.omnisearchSelected(this.snap.omnisearchOptions().length - 1);
            }
            this.snap.omnisearchScrollToSelected();
            break;
          // Down
          case 40:
            if (this.snap.omnisearchSelected() < this.snap.omnisearchOptions().length - 1) {
              this.snap.omnisearchSelected(this.snap.omnisearchSelected() + 1);
            } else {
              this.snap.omnisearchSelected(0);
            }
            this.snap.omnisearchScrollToSelected();
            break;
          default:
            var self = this;
            var search = this.snap.omnisearchString();
            // Don't search until at least two characters are entered and search string isn't the same as last
            if (search.length >= 2 && search != this.snap.omnisearchStringLast) {
              this.snap.omnisearchBusy(true);
              // Talk to backend, update omnisearchOptions with result
              // TODO - Figure out a better way to get this URL!
              var url = '/app/' + window.serverAppModel.id + '/search/' + search;
              $.ajax({
               url: url,
               dataType: 'json',
               success: function(values) {
                 // No values returned
                 if (values.length == 0) {
                  values = [{
                    title: "(no results found)",
                    subtitle: "",
                    type: "",
                    url: false
                  }];
                 }
                 // TODO - Maybe be smarter about how we fill stuff out here?
                 self.snap.omnisearchOptions(values);
                 self.snap.omnisearchBusy(false);
                 self.snap.omnisearchActive(true);
                 self.snap.omnisearchStringLast = search;
               }
              });
            } else {
              this.snap.omnisearchBusy(false);
              this.snap.omnisearchActive(false);
            }
            break;
        }
        return true;
      },
      omnisearchScrollToSelected: function(){
        var $omnisearch = $('#omnisearch ul');
        var $selected = $omnisearch.find('li.selected');
        if ($selected.position().top < 0) {
          $omnisearch.scrollTop($omnisearch.scrollTop() + $selected.position().top);
        } else if ($selected.position().top + $selected.outerHeight() >= $omnisearch.height()) {
          $omnisearch.scrollTop($omnisearch.scrollTop() + $selected.position().top + $selected.outerHeight() - $omnisearch.height());
        }
      },
      omnisearchGo: function(data){
        if (data.url) {
          location.href = data.url;
        }
      },
      omnisearchOff: function(data, event){
        var self = this;
        // Delay hiding of omnisearch list to catch mouse click on list before it disappears
        setTimeout(function(){
          self.snap.omnisearchActive(false);
          self.snap.omnisearchSelected(0);
          self.snap.omnisearchString("");
        }, 100);
      },
      togglePanel: function(){
        this.snap.panelOpened(!this.snap.panelOpened());
        settings.set("app.panelOpened", this.snap.panelOpened());
      },
      togglePanelShape: function(data, event){
        this.snap.panelShape(event.target.dataset.panelShape);
        this.snap.panelDropdownActive( false );
        settings.set("app.panelShape", this.snap.panelShape());
      },
      togglePanelDropdown: function(data, event){
        event.stopPropagation();
        this.snap.panelDropdownActive(!this.snap.panelDropdownActive());
      }
    },
    logModel: new log.Log(),
    // This is the initialization of the application...
    init: function(plugins) {
      var self = this;
      self.widgets = [];
      self.plugins = plugins;

      var openSearch = function(e, ctx) {
        $("#omnisearch input")[0].focus();
        // TODO nothing connects to this?
        $.event.trigger("search.open");
        return true;
      };

      var globalKeybindings = [
        [ 'ctrl-k', openSearch, { preventDefault: true } ]
      ];

      // scope '' is global scope
      keyboard.installBindingsInScope('', globalKeybindings);

      // TODO - initialize plugins in a better way perhaps...
      $.each(self.plugins.list, function(idx,plugin) {
        self.router.registerRoutes(plugin.routes);
        $.each(plugin.widgets, function(idx, widget) {
          self.widgets.push(widget);
        });
      });
      ko.applyBindings(self, window.body);
      self.router.init();
    }
  };
});
