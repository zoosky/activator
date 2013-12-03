define(['text!./actor.html', 'core/pluginapi', './../widget', '../format'], function(template, api, ConsoleWidget, format) {
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
      this.path = ko.observable();
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
      this.actor(data.actor);
    },
    shorten: function(value) {
      return format.shorten(value, 2);
    },
    formatUnits: function(unit, value) {
      return format.units(unit, value);
    },
    formatDate: function(value) {
      return format.formatTime(new Date(value));
    }
  });
});
