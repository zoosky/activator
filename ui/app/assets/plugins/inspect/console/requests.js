/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./requests.html', 'core/pluginapi', './widget'], function(template, api, ConsoleWidget) {

  var ko = api.ko;

  var Requests = api.Class(ConsoleWidget, {
    id: 'console-requests-widget',
    template: template,
    init: function(args) {

    },
    dataName: '',
    dataTypes: [''],
    onData: function(data) {

    }
  });

  return Requests;
});
