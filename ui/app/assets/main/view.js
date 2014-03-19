/*
 Copyright (C) 2014 Typesafe, Inc <http://typesafe.com>
 */
define([
  'text!templates/header.html',
  'text!templates/navigation.html',
  'text!templates/wrapper.html',
  'widgets/panels/panels'
], function(
  header,
  navigation,
  wrapper,
  panels
) {

  return {
    render: function(model) {
      $(document.body)
        .append($(header)[0])
        .append($(navigation)[0])
        .append($(wrapper)[0]);

      ko.applyBindings(model, document.body);

      $(document.body)
        .append(panels);
    }
  }

});
