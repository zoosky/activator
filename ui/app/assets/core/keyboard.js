define(function() {

  $(window).on("keyup", function(e) {
    switch (e.keyCode) {
      case 84: // T
        $.event.trigger("search.open");
        break;
    }
  });

});
