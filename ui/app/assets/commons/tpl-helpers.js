define(function() {

  ko.bindingHandlers.toggle = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      element.addEventListener("click", function(e) {
        observable = valueAccessor();
        observable(!observable());
      });
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
  };

  ko.bindingHandlers.memoScroll = (function(){
    var memos = {}
    return {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var label = valueAccessor();
        if (!memos[label]) {
          memos[label] = [0,0];
        } else {
          setTimeout(function() {
            $(element).scrollLeft(memos[label][0]);
            $(element).scrollTop(memos[label][1]);
          }, 0);
        }
        element.addEventListener("scroll", function(e) {
          memos[label][0] = element.scrollLeft;
          memos[label][1] = element.scrollTop;
        });
      },
      update: function() {}
    }
  }());

});
