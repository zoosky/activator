/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./actors.html', 'core/pluginapi', './widget'], function(template, api, ConsoleWidget) {

  var ko = api.ko;

  var Actors = api.Class(ConsoleWidget, {
    id: 'console-actors-widget',
    template: template,
    init: function(args) {
      this.actors = ko.observableArray([]);
    },
    dataName: 'actors',
    dataTypes: ['actors'],
    dataScope: {},
    onData: function(data) {
      newActors = [];
      actorData = data.actors.actors;
      formatUnits = function(u, v) { return format.shorten(v) + ' ' + u };
      for (var i = 0; i < actorData.length; i++) {
        a = actorData[i];
        id = a.scope.actorPath;
        name = a.scope.actorPath.substr(a.scope.actorPath.lastIndexOf("/") + 1);
        messageRate = a.totalMessageRate || 0;
        throughput = format.units('messages/second', messageRate, formatUnits);
        maxTimeInMailbox = format.units(a.maxTimeInMailboxUnit, a.maxTimeInMailbox, formatUnits)
        maxMailboxSize = a.maxMailboxSize;
        deviationCount = a.errorCount + a.warningCount + a.deadLetterCount + a.unhandledMessageCount;
        deviations = deviationCount > 0 ? deviationCount : "";
        actor = {
          'id': id,
          'name': name,
          'throughput': throughput,
          'maxTimeInMailbox': maxTimeInMailbox,
          'maxMailboxSize': maxMailboxSize,
          'deviations': deviations
        };
        newActors.push(actor);
      }
      this.actors(newActors);
    }
  });

  return Actors;
});
