/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./test.html', 'css!./test.css', 'main/pluginapi', 'services/build'], function(template, css, api, build) {
  var ko = api.ko;
  var sbt = api.sbt;

  var testConsole = api.PluginWidget({
    id: 'test-result-widget',
    title: 'Testing',
    template: template,
    init: function(parameters) {
      var self = this;

      // aliases to export build model to HTML;
      // these should likely go away someday
      self.results = build.test.results;
      self.testStatus = build.test.testStatus;
      self.hasResults = build.test.hasResults;
      self.haveActiveTask = build.test.haveActiveTask;
      self.rerunOnBuild = build.test.rerunOnBuild;
      self.restartPending = build.test.restartPending;

      self.testFilter = ko.observable('all');
      self.filterTestsText = ko.computed(function() {
        if(self.testFilter() == 'all') {
          return 'Show only failures';
        }
        return 'Show all tests';
      });
      self.displayedResults = ko.computed(function() {
        if(self.testFilter() == 'failures') {
          return ko.utils.arrayFilter(self.results(), function(item) {
            return item.outcome() != Outcome.PASSED;
          });
        }
        return self.results();
      });
      // Rollup results.
      self.resultStats = ko.computed(function() {
        var results = {
            passed: 0,
            failed: 0
        };
        $.each(self.results(), function(idx, result) {
          if(result.outcome() != Outcome.PASSED) {
            results.failed = results.failed + 1;
          } else {
            results.passed = results.passed + 1;
          }
        });
        return results;
      });

      this.startStopLabel = ko.computed(function() {
        if (self.haveActiveTask())
          return "Stop";
        else
          return "Start";
      }, this);
    },
    filterTests: function() {
      // TODO - More states.
      if(this.testFilter() == 'all') {
        this.testFilter('failures')
      } else {
        this.testFilter('all')
      }
    },
    startStopButtonClicked: function(self) {
      debug && console.log("Start/Stop was clicked");
      if (self.haveActiveTask()) {
        self.restartPending(false);
        build.test.doStop();
      } else {
        build.test.doTest(false); // false=!triggeredByBuild
      }
    },
    restartButtonClicked: function(self) {
      debug && console.log("Restart was clicked");
      build.test.doStop();
      build.test.restartPending(true);
    }
  });

  return api.Plugin({
    id: 'test',
    name: "Test",
    icon: 'ꙫ',
    url: "#test",
    routes: {
      'test': function() { api.setActiveWidget(testConsole); }
    },
    widgets: [testConsole]
  });
});
