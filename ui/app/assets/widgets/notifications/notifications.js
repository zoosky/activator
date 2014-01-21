/*
 Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
 */
define(['text!./notifications.html', 'webjars!knockout', 'commons/widget', 'commons/utils', 'services/build'],
    function(template, ko, Widget, utils, build) {

  var Notifications = utils.Class(Widget, {
    id: 'notifications-widget',
    template: template,
    init: function() {
      this.count = ko.computed(function() { return build.errorList().length; });
      this.items = build.errorList;
    }
  });

  return Notifications;
});
