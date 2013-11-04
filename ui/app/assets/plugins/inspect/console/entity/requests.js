/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./requests.html', 'core/pluginapi', './../widget'], function(template, api, ConsoleWidget) {

  var ko = api.ko;

  var Requests = api.Class(ConsoleWidget, {
    id: 'console-requests-widget',
    template: template,
    init: function(args) {
      this.requests = ko.observableArray([]);
    },
    dataName: 'requests',
    dataTypes: ['requests'],
    dataScope: {},
    onData: function(data) {
      newRequests = [];
      requestData = data.playRequestSummaries.playRequestSummaries;
      for (var i = 0; i < requestData.length; i++) {
        req = requestData[i];
        path = req.invocationInfo.path;
        method = req.invocationInfo.httpMethod;
        responseCode = req.response.httpResponseCode;
        request = {
          'path' : path,
          'method' : method,
          'responseCode' : responseCode
        };
        newRequests.push(request);
      }

      this.requests(newRequests);
    }
  });

  return Requests;
});
