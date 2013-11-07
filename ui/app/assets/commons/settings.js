define(function() {
  return {
    set: function(label, value) {
      return window.localStorage.setItem(label, JSON.stringify(value));
    },
    get: function(label, def) {
      if (window.localStorage.getItem(label) != null) {
        return JSON.parse(window.localStorage.getItem(label));
      } else {
        return def;
      }
    },
    reset: function(label) {
      return window.localStorage.removeItem(label);
    }
  };
});
