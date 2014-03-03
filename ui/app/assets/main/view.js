/*
 Copyright (C) 2014 Typesafe, Inc <http://typesafe.com>
 */
define([
  'text!templates/header.html',
  'text!templates/navigation.html',
  'text!templates/wrapper.html',
  'text!templates/pannels.html'
], function(
  header,
  navigation,
  wrapper,
  pannels
) {

  return {
    render: function(model) {
      $(document.body)
        .append($(header)[0])
        .append($(navigation)[0])
        .append($(wrapper)[0])
        .append($(pannels)[0]);

      ko.applyBindings(model, document.body);
    }
  }

});
