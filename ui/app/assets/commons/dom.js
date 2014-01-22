define(function() {
  var memorized = {};

  return {
    removed: function(target, callback) {
      target.addEventListener("DOMNodeRemoved", function(e) {
        if (e.target === target && e.relatedNode.nodeName !== "#document-fragment") {
          callback();
        }
      });
    },

    triggerKey: function(type, target) {
      var evt = document.createEvent("KeyboardEvent");
      if (evt.initKeyboardEvent) {
        evt.initKeyboardEvent(type, true, true, window, 0, 0, 0, 0, 0, 0);
      } else {
        evt.initKeyEvent(type, true, true, window, 0, 0, 0, 0, 0, 0);
      }
      target.dispatchEvent(evt);
    },

    customEvent: function(target, event, data) {
      if (data == null) {
        data = {};
      }
      target.dispatchEvent(new CustomEvent(event, data));
    },

    replaceWith: function(previous, next) {
      var parent;
      parent = previous.parentNode;
      parent.removeChild(previous);
      parent.appendChild(next.childNodes[0]);
    },

    placeHolder: function() {
      document.createElement("div");
    }
  }

});
