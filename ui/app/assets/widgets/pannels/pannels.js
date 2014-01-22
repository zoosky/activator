define([
  "text!templates/pannels.html",
  'widgets/buttons/dropdown',
  "css!./pannels"
], function(
  template,
  dropdown
){

  $pannels = $(template)[0]

  var PannelState = {};

  ko.applyBindings(PannelState, $pannels);

  dropdown($pannels);

  return $pannels;

});
