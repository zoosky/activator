define(["css!./dropdown"], function() {

  return function(el){
    $('.dropdown',el).click(function(e){
      $(this).toggleClass("opened");
    });
  }

});
