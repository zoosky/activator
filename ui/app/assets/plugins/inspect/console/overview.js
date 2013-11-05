/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./overview.html', 'core/pluginapi', './widget'], function(template, api, ConsoleWidget) {

  var ko = api.ko;

  var Overview = api.Class(ConsoleWidget, {
    id: 'console-overview-widget',
    template: template,
    init: function(args) {
      var self = this;
      this.actors = ko.observable(0);
      this.requests = ko.observable(0);
    },
    active: ko.observable(''),
    dataName: 'overview',
    dataTypes: ['overview'],
    onData: function(data) {
      this.actors(data.actorPathCount);
      this.requests(data.playPatternCount);
    },
    shorten: function(count) {
      return format.shortenNumber(count);
    }
  });

  return Overview;
});
