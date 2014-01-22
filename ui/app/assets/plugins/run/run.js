define([
  "core/plugins",
  "services/build",
  "text!templates/run.html",
  "widgets/forms/switch",
  "widgets/navigation/menu",
  "css!./run",
  "css!widgets/navigation/menu"
], function(
  plugins,
  build,
  template,
  _switch,
  menu
) {

  var autocompile = ko.observable(true);
  var showConfiguration = ko.observable(false);
  var debugActive = ko.observable(false);
  var debugPort = ko.observable(3000);
  var logs = ko.observableArray([
    {
      type: "stdout",
      content: "Greeting: hello, akka"
    }, {
      type: "stdout",
      content: "Greeting: hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }, {
      type: "stdout",
      content: "hello, typesafe"
    }
  ]);

  var RunState = {
    autocompile: autocompile,
    showConfiguration: showConfiguration,
    debugActive: debugActive,
    debugPort: debugPort,
    logs: logs,
    build: build
  }

  return self = plugins.make({
    layout: function(url) {
      var $run = $(template)[0];
      ko.applyBindings(RunState, $run);
      $("#wrapper").replaceWith($run);
    },

    route: function(url, breadcrumb) {
      var all;
      all = [['run/', "Run"]];
      return breadcrumb(all);
    }
  });
});
