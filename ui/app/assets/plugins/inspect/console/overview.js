/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./overview.html', 'core/pluginapi', './widget'], function(template, api, ConsoleWidget) {

  var ko = api.ko;

  var Overview = api.Class(ConsoleWidget, {
    id: 'console-overview-widget',
    template: template,
    init: function(args) {
      this.actorCount = ko.observable('-');
    },
    dataName: 'overview',
    dataTypes: ['overview'],
    onData: function(data) {
      this.actorCount(window.format.shortenNumber(data.actorPathCount));
    }
  });

  return Overview;
});
