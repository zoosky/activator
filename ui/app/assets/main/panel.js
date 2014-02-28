/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['commons/utils', 'commons/settings'],
    function(utils, settings) {
  var panelOpened = settings.observable("app.panelOpened", true);
  var panelShape = settings.observable("app.panelShape", "right1");

  var panel = utils.Singleton({
    init: function() {
      this.dropdownActive = ko.observable(false);
      this.panelOpened = panelOpened;
      this.panelShape = panelShape;
    },
    toggle: function() {
      panelOpened(!panelOpened());
    },
    toggleShape: function(data, event){
      panelShape(event.target.dataset.panelShape);
      this.dropdownActive(false);
    },
    toggleDropdown: function(data, event){
      event.stopPropagation();
      this.dropdownActive(!this.dropdownActive());
    }
  });
  return panel;
});
