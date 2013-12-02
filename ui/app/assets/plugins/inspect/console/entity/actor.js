define(['text!./actor.html', 'core/pluginapi', './../widget', '../format'], function(template, api, ConsoleWidget, formatter) {
  var ko = api.ko;

  return api.Class(ConsoleWidget, {
    id: 'console-actor-widget',
    template: template,
    init: function(args) {
      var self = this;
      this.parameters = function(params) {
        self.actorPath = params.toString().replace(/,/g, "/");
      };
      this.actor = ko.observable();

      // Special formatting of values

      this.path = ko.observable();
      this.maxSizeMailboxTime = ko.observable();
      this.maxTimeInMailboxTime = ko.observable();
      this.maxTime = ko.observableArray([]);
      this.meanTime = ko.observableArray([]);
      this.meanMessageRate = ko.observableArray([]);
      this.formattedMaxMailboxSizeTimestamp = ko.computed(function() {
        return formatter.formatTime(new Date(self.maxSizeMailboxTime()));
      });
      this.formattedMaxTimeInMailboxTimestamp = ko.computed(function() {
        return formatter.formatTime(new Date(self.maxTimeInMailboxTime()));
      });
      this.formattedMaxTimeInMailbox = ko.computed(function() {
        return formatter.units(self.maxTime()[1], self.maxTime()[0]);
      });
      this.formattedMeanTimeInMailbox = ko.computed(function() {
        return formatter.units(self.meanTime()[1], self.meanTime()[0]);
      });
      this.formattedMeanProcessedMessageRate = ko.computed(function() {
        return formatter.units(self.meanMessageRate()[1], Number(self.meanMessageRate()[0]).toFixed(3));
      });

      this.close = function() {
        window.location.hash = "inspect/actors";
      }
    },
    dataName: 'actor',
    dataTypes: ['actor'],
    dataScope: {},
    dataRequest: function() {
      return { 'scope': { 'actorPath': this.actorPath } };
    },
    onData: function(data) {
      this.path(data.actor.maxMailboxSizeAddressPath);
      this.maxSizeMailboxTime(data.actor.maxMailboxSizeTimestamp);
      this.maxTimeInMailboxTime(data.actor.maxTimeInMailboxTimestamp);
      this.meanMessageRate.push(data.actor.meanProcessedMessageRate);
      this.meanMessageRate.push(data.actor.meanProcessedMessageRateUnit);
      this.maxTime.push(data.actor.maxTimeInMailbox);
      this.maxTime.push(data.actor.maxTimeInMailboxUnit);
      this.meanTime.push(data.actor.meanTimeInMailbox);
      this.meanTime.push(data.actor.meanTimeInMailboxUnit);

      this.actor(data.actor);
    }
  });
});
