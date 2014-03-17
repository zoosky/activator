/*
 Copyright (C) 2014 Typesafe, Inc <http://typesafe.com>
 */
define(['commons/utils', 'commons/streams'], function(utils, streams) {

  var Connection = utils.Class({

    init: function() {
      var self = this;
      this.reset =
        function() {
          self.send({
            "commands": [
              {
                "module": "lifecycle",
                "command": "reset"
              }]
          })
        };
      this.send =
        function(message) {
          var fullMessage = {
            request: 'InspectRequest',
            location: message
          };

          debug && console.log("Sending message: ", fullMessage);
          streams.send(fullMessage);
        };
      this.modules = [];
      this.request = {};
      this.request.time = { "startTime": "", "endTime": "", "rolling": "20minutes" };
    },

    handler: function(event) {
      try {
        for(var i = 0; i < this.modules.length; i++) {
          var module = this.modules[i];
          if (module.dataTypes != undefined && event.type == module.dataTypes) {
            module.onData(event.data);
          }
        }
      } catch(error) {
        debug && console.log("Error in receive method: ", error)
      }
    },

    filter: function(event) {
      var t = event.type;
      if (t == 'overview' ||
        t == 'actor' ||
        t == 'actors' ||
        t == 'deviation' ||
        t == 'deviations' ||
        t == 'request' ||
        t == 'requests') return true;
      return false;
    },

    updateModules: function(ms) {
      if (ms != null) {
        this.modules = ms;
      }
      this.request.modules = [];

      for (var i = 0; i < this.modules.length; i++) {
        var module = this.modules[i];
        var moduleRequest;
        if (module.dataRequest) {
          moduleRequest = module.dataRequest();
        }
        if (!moduleRequest.name) {
          moduleRequest.name = module.dataName;
        }
        if (!moduleRequest.scope) {
          moduleRequest.scope = {};
        }
        this.request.modules.push(moduleRequest);
      }

      this.update();
    },

    update: function() {
      var sendData = {
        modules: []
      };

      var sentModules = [];
      for (var i = 0; i < this.request.modules.length; i++) {
        var module = this.request.modules[i];
        if (sentModules.indexOf(module.name) < 0) {
          sentModules.push(module.name);
          sendData.modules.push(module);
        }
      }

      sendData.time = this.request.time;
      this.send(sendData);
    }

  });

  return new Connection;
});
