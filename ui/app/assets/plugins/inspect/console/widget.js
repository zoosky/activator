/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['core/utils', 'core/widget'], function(utils, Widget) {
  var ConsoleWidget = utils.Class(Widget, {
    dataName: '',
    dataTypes: [],
    dataScope: {},
    onData: function() {}
  })
  return ConsoleWidget;
});
