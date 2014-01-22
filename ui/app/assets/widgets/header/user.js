define([
  'widgets/buttons/dropdown',
  'text!templates/user.html'
], function(
  dropdown,
  template
){

  var $user = $(template)[0];

  // dropdown($user);

  return $user;

});
