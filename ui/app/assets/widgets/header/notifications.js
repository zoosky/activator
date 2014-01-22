define([
  'widgets/buttons/dropdown',
  'text!templates/notifications.html'
], function(
  dropdown,
  template
){

  var $notifications = $(template);

  // dropdown($notifications);

  return $notifications;

});
