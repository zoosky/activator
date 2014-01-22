define([
  "core/plugins",
  "text!templates/test.html",
  "widgets/forms/switch",
  "widgets/navigation/menu",
  "css!./test",
  "css!widgets/navigation/menu"
], function(
  plugins,
  template,
  $switcher,
  $menu
) {

  var suite = ko.observableArray([
    {
      title: "First test first",
      status: ko.observable("waiting"),
      enabled: ko.observable(true)
    },
    {
      title: "Second test second",
      status: ko.observable("pending"),
      enabled: ko.observable(true)
    },
    {
      title: "Third test third",
      status: ko.observable("failed"),
      enabled: ko.observable(true)
    },
    {
      title: "Fourth test fourth",
      status: ko.observable("passed"),
      enabled: ko.observable(true)
    },
    {
      title: "Fifth test fifth",
      status: ko.observable(""),
      enabled: ko.observable(false)
    }
  ]);

  var enabled = function(e) {
    var o = ko.observable(!e());
    e.on("change", function(v) {
      return o(!v);
    });
    o.on("change", function(v) {
      return e(!v);
    });
    return o;
  };

  var TestState = {
    suite: suite,
    enabled: enabled
  }

  return plugins.make({
    layout: function(url) {
      var $test = $(template)[0];
      ko.applyBindings(TestState, $test);
      $("#wrapper").replaceWith($test);
    },

    route: function(url, breadcrumb) {
      var all;
      all = [['test/', "Test"]];
      switch (url.parameters[0]) {
        case "":
          return breadcrumb(all);
        default:
          return breadcrumb(all);
      }
    }
  });

});
