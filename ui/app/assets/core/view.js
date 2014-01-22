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

  var MainView = {
    // Layout states
    pannelShape:      settings.observable("layoutManager.pannelShape"     , "right1"),
    pannelState:      settings.observable("layoutManager.pannelState"     , true),
    navigationState:  settings.observable("layoutManager.navigationState" , true)
  }

  return {
    keyboard: function(key,m, e) {
      if (key == "T"){
        e.preventDefault();
        e.stopPropagation();
        $("#omnisearch input").focus();
      }
    },
    render: function() {
      ko.applyBindings(MainView, document.body);

      // Build the DOM
      $(document.body).append(header);
      $(document.body).append(navigation);
      $('<main id="wrapper"></main>').appendTo(document.body);
      $(document.body).append(pannels);
    }
  }

});
