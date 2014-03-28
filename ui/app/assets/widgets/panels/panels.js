define([
  "text!templates/panels.html",
  "css!./panels"
], function(
  template
){

  // Find the plugins who have panels
  // var panels = plugins.plugins.reduce(function(list, group) {
  //   return list.concat(group.links.filter(function(it) {
  //     return it.panel;
  //   }));
  // }, []);
  var panels = ['plugins/tutorial/tutorial'];

  $panels = $(template)[0];
  currentPanel = ko.observable();

  var switchPanel = function(panel) {
    require([panel], function(p) {
      $("#panelWrapper").replaceWith(p.renderPanel());
      currentPanel(panel);
    });
  }

  var PanelState = {
    panels: panels,
    currentPanel: currentPanel,
    switchPanel: switchPanel
  };

  // Default panel:
  setTimeout(function() {
    switchPanel(panels[0]);
  },100);

  ko.applyBindings(PanelState, $panels);

  // dropdown($panels);

  return $panels;

});
