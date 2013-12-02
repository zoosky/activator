define(['text!./request.html', 'core/pluginapi', './../widget'], function(template, api, ConsoleWidget) {
  var ko = api.ko;

  return api.Class(ConsoleWidget, {
    id: 'console-request-widget',
    template: template,
    init: function(args) {
      this.traceId = "unknown";
      this.parameters = function(params) {
        this.traceId = params[0];
      };
      this.req = ko.observable();
      this.actors = ko.observableArray([]);
    },
    dataName: 'request',
    dataTypes: ['request'],
    dataScope: {},
    dataRequest: function() {
      return { 'traceId': this.traceId };
    },
    onData: function(data) {
      this.formatActorLinks = function(actors) {
        var newCollection = [];

        if (actors != undefined) {
          for (var i = 0; i < actors.length; i++) {
            var element = {
              'path' : actors[i].actorPath,
              'link' :  "#inspect/actor/" + actors[i].actorPath
            };
            newCollection.push(element);
          }
        }
        return newCollection;
      }

      this.actors(this.formatActorLinks(data.playRequestSummary.actorInfo));
      this.req(data.playRequestSummary);
    }
  });
});
