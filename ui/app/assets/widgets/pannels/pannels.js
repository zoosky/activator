define([
  "core/plugins",
  "text!templates/pannels.html",
  'widgets/buttons/dropdown',
  "css!./pannels"
], function(
  plugins,
  template,
  dropdown
){

  // Find the plugins who have pannels
  var pannels = plugins.plugins.reduce(function(list, group) {
    return list.concat(group.links.filter(function(it) {
      return it.pannel;
    }));
  }, []);

  $pannels = $(template)[0];
  currentPannel = ko.observable();

  var switchPannel = function(pannel) {
    require([pannel.plugin], function(p) {
      p.renderPannel();
      currentPannel(pannel);
    });
  }

  var PannelState = {
    pannels: pannels,
    currentPannel: currentPannel,
    switchPannel: switchPannel
  };

  // Default pannel:
  switchPannel(pannels[0]);

  ko.applyBindings(PannelState, $pannels);

  dropdown($pannels);

  return $pannels;

});
