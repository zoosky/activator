define(function() {

  $.fn.clickOut = function(callback, context){
    return this.each(function(){
      context = context || this;
      var _this = this;
      // SetTimeout to prevent evt propagation conflicts
      setTimeout(function(){
        $(document).click(function(e){
          if (!$(_this).has(e.target).length){
            $(document).unbind("click", arguments.callee);
            callback.call(context, e);
          }
        });
      }, 10);
    });
  }

  $.fn.dropdown = function(selector, context){
    return this.each(function(i, scope){
      context = context || this;
      selector = selector || "dt";
      var $this = $(scope), $doc = $(document.body);

      function clickOut(e){
        if (!$this.has(e.target).length){
          $doc.unbind("click", clickOut);
          $this.removeClass("opened");
        }
      }

      $this.on("click",function(e){
        $this.toggleClass("opened");
        if ($this.hasClass("opened")){
          $doc.click(clickOut);
        } else {
          $doc.unbind("click", clickOut);
        }
      });
    });
  };

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

  ko.bindingHandlers.href = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var url = valueAccessor();
      ko.applyBindingsToNode(element, { attr: {'href': url} });
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
  }

  ko.bindingHandlers.isActive = (function(){
    var urlChange = ko.observable(window.location.hash);
    window.addEventListener("hashchange", function(e) {
      setTimeout(function() {
        urlChange(window.location.hash);
      },10);
    });
    return {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var url = valueAccessor();
        var isActive = ko.computed(function() {
          return (urlChange()+"/").indexOf(url+"/") == 0;
        });
        ko.applyBindingsToNode(element, { css: {'active': isActive} });
      },
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      }
    }
  }());


});
