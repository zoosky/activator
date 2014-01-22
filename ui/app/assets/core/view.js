define([
  'commons/settings',
  'widgets/layout/layout',
  'widgets/header/header',
  'widgets/navigation/navigation',
  'widgets/pannels/pannels',
  "css!./main"
], function(
  settings,
  layout,
  header,
  navigation,
  pannels
){

  function MainView(){
    // Layout
    this.pannelShape      = settings.observable("layoutManager.pannelShape"     , "right1");
    this.pannelState      = settings.observable("layoutManager.pannelState"     , true);
    this.navigationState  = settings.observable("layoutManager.navigationState" , true);
  }

  return {
    render: function() {
      ko.applyBindings(new MainView(), document.body);

      $(document.body).append(header);
      $(document.body).append(navigation);
      $('<main id="wrapper"></main>').appendTo(document.body);
      $(document.body).append(pannels);
    }
  }

});
