/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./overview.html', 'core/pluginapi', './widget', './format'], function(template, api, ConsoleWidget, format) {

  var ko = api.ko;

  return api.Class(ConsoleWidget, {
    id: 'console-overview-widget',
    template: template,
    init: function(args) {
      var self = this;
      this.actors = ko.observable(0);
      this.requests = ko.observable(0);
      this.deviations = ko.observable(0);
    },
    active: ko.observable(''),
    dataName: 'overview',
    dataTypes: ['overview'],
    onData: function(data) {
      this.actors(data.metadata.actorPathCount);
      this.requests(data.metadata.playPatternCount);
      this.deviations(data.deviations.deviationCount);
    },
    shorten: function(count) {
      return format.shortenNumber(count);
    }
  });
});
