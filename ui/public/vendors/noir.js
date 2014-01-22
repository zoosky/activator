(function() {
  var BaseClass, Collection, CollectionClass, Computed, Element, EventClass, Fragment, List, Model, ModelClass, Observable, ObservableClass, Tag, Template, ValidableClass, Watcher, attributeBindings, bodyBindings, interceptObservableCalls, name, noir, tagNames, _, _fn, _i, _len, _ref,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = (function() {
    return {
      extend: function() {
        var i, k, objects, source, v, _i, _len;
        source = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          i = objects[_i];
          for (k in i) {
            v = i[k];
            source[k] = v;
          }
        }
        return source;
      },
      deepExtend: function() {
        var i, k, objects, source, v, _i, _len;
        source = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        for (_i = 0, _len = objects.length; _i < _len; _i++) {
          i = objects[_i];
          for (k in i) {
            v = i[k];
            if (source[k] && _.isObject(v)) {
              source[k] = _.deepExtend(source[k], v);
            } else if (_.isArray(source[k]) && _.isArray(v)) {
              source[k] = source[k].concat(v);
            } else {
              source[k] = v;
            }
          }
        }
        return source;
      },
      each: function(object, func) {
        var k, v;
        for (k in object) {
          v = object[k];
          func(k, v);
        }
        return object;
      },
      fold: function(object, func) {
        var k, v;
        for (k in object) {
          v = object[k];
          func(k, v);
        }
        return object;
      },
      bind: function(context, func) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return func.apply(context, args);
        };
      },
      bindAll: function(object) {
        each(object, function(k, v) {
          if (v.bind != null) {
            return o[k] = v.bind(object);
          } else if (typeof v === "function") {
            return o[k] = bind(object, v);
          }
        });
        return object;
      },
      removeFromArray: function(array, element) {
        var _results;
        _results = [];
        while (index = array.indexOf(element), index != -1) {
          _results.push(array.splice(index, 1));
        }
        return _results;
      },
      isFunction: function(object) {
        return typeof object === "function";
      },
      isObject: function(object) {
        return typeof object === "object";
      },
      isArray: function(array) {
        return {}.toString.call(array) === '[object Array]';
      },
      isString: function(array) {
        return typeof object === "string";
      },
      isNumber: function(array) {
        return typeof object === "number";
      },
      clone: function(object) {
        if (isObject(object)) {
          extend(object);
        }
        if (isArray(object)) {
          return object.slice();
        } else {
          return object;
        }
      },
      uuid: function() {
        var s4;
        s4 = function() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + '-' + s4() + s4() + '-' + s4() + s4();
      },
      wildClass: function(parent, child) {
        var Class, method, property, _ref;
        Class = function() {
          return parent.apply(this, arguments);
        };
        _ref = parent.prototype;
        for (property in _ref) {
          method = _ref[property];
          Class.prototype[property] = method;
        }
        for (property in child) {
          method = child[property];
          Class.prototype[property] = method;
        }
        Class.__super__ = parent.prototype;
        Class.prototype.constructor = Class;
        return Class;
      },
      removeBetweenDom: function(start, stop) {
        var parent, _results;
        if (start.parentNode !== stop.parentNode) {
          throw "Parents must be the same when removing between nodes";
        }
        parent = start.parentNode;
        _results = [];
        while (start.nextSibling !== stop) {
          _results.push(parent.removeChild(start.nextSibling));
        }
        return _results;
      },
      domRemoved: function(target, callback, types) {
        return setTimeout(function() {
          return target.addEventListener("DOMNodeRemovedFromDocument", function(e) {
            return callback();
          });
        }, 0);
      }
    };
  })();

  attributeBindings = (function() {
    var addAttribute, clean, handleEvent, handleObservable, handleObservableList;
    clean = function(dom, events) {
      return _.domRemoved(dom, function() {});
    };
    addAttribute = function(element, attribute, value) {
      if (value === false) {
        return element.removeAttribute(attribute);
      } else {
        return element.setAttribute(attribute, value);
      }
    };
    handleObservable = function(action) {
      return function(element, value) {
        if (value.isObservable) {
          return value.doChangeDom(element, function(v) {
            return action(element, value());
          });
        } else {
          return action(element, value);
        }
      };
    };
    handleObservableList = function(action) {
      return function(element, props) {
        var key, value, _results;
        _results = [];
        for (key in props) {
          value = props[key];
          _results.push((function(element, key, value) {
            if (value.isObservable) {
              return value.doChangeDom(element, function(v) {
                return action(element, key, value());
              });
            } else {
              return action(element, key, value);
            }
          })(element, key, value));
        }
        return _results;
      };
    };
    handleEvent = function(element, type, callback, attrs, prevent) {
      var custom;
      if (attrs == null) {
        attrs = {};
      }
      if (prevent == null) {
        prevent = false;
      }
      if (typeof callback === "string") {
        custom = callback;
        callback = function(e) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(custom, true, true, {});
          return e.target.dispatchEvent(evt);
        };
      }
      return element.addEventListener(type, function(e) {
        if (prevent) {
          e.preventDefault();
        }
        e.data = attrs;
        return callback(e);
      });
    };
    return {
      attr: handleObservableList(function(element, key, value) {
        return addAttribute(element, key, value);
      }),
      href: handleObservable(function(element, value) {
        return addAttribute(element, "href", value);
      }),
      id: handleObservable(function(element, value) {
        return addAttribute(element, "id", value);
      }),
      name: handleObservable(function(element, value) {
        return addAttribute(element, "name", value);
      }),
      data: handleObservableList(function(element, key, value) {
        return addAttribute(element, "data-" + key, value);
      }),
      value: function(element, value) {
        if (value.isObservable) {
          if ((element.tagName === "INPUT" && (element.type !== "checkbox" || element.type !== "radio")) || element.tagName === "SELECT") {
            value.doChangeDom(element, function(v) {
              return element.value = v;
            });
            return element.onchange = function() {
              return value(element.value);
            };
          } else {
            return console.error("Can't bind value on this element");
          }
        } else {
          return element.value = value;
        }
      },
      checked: function(element, value) {
        if (element.tagName === "INPUT" && (element.type === "checkbox" || element.type === "radio")) {
          if (value.isObservable) {
            value.doChangeDom(element, function(v) {
              return addAttribute(element, "checked", v);
            });
            return element.onchange = function() {
              return value(element.checked);
            };
          } else {
            return addAttribute(element, "checked", value);
          }
        } else {
          return console.error("Can't bind checked on non checkbox or radio");
        }
      },
      visible: handleObservable(function(element, value) {
        return element.style.display = value ? "block" : "none";
      }),
      css: handleObservableList(function(element, key, value) {
        return element.style[key] = value;
      }),
      "class": handleObservableList(function(element, key, value) {
        if (value) {
          return element.classList.add(key);
        } else {
          return element.classList.remove(key);
        }
      }),
      event: function(element, values, attrs) {
        var callback, type, _results;
        _results = [];
        for (type in values) {
          callback = values[type];
          _results.push(handleEvent(element, type, callback, attrs));
        }
        return _results;
      },
      click: function(element, callback, attrs) {
        return handleEvent(element, "click", callback, attrs);
      },
      $event: function(element, values, attrs) {
        var key, value, _ref, _results;
        if (attrs == null) {
          attrs = {};
        }
        if ((_ref = attrs.scope) == null) {
          attrs.scope = {};
        }
        _results = [];
        for (key in values) {
          value = values[key];
          _results.push($(element).on(key, function(e) {
            return value(e, attrs.scope, attrs);
          }));
        }
        return _results;
      },
      change: function(element, callback, attrs) {
        return handleEvent(element, "change", callback, attrs);
      },
      submit: function(element, callback, attrs) {
        return handleEvent(element, "submit", callback, attrs, true);
      },
      text: function(element, value) {
        var node;
        node = document.createTextNode(typeof value === "function" ? value() : value);
        if (value.isObservable) {
          value.onDom(element, "change", function(v) {
            return node.nodeValue = v;
          });
        }
        return element.appendChild(node);
      },
      html: handleObservable(function(element, value) {
        return element.innerHTML = value;
      }),
      exec: function(element, func, attrs) {
        return setTimeout(function() {
          return func(element, attrs);
        }, 0);
      },
      scope: function() {}
    };
  })();

  /*
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     };
  */


  bodyBindings = {
    "if": function(parent, builder, value) {
      if (value.isObservable) {
        value.doChangeDom(parent, function(bool) {
          if (bool) {
            return parent.appendChild(builder(value));
          }
        });
      } else {
        if (value) {
          parent.appendChild(builder(value));
        }
      }
      return parent;
    },
    ifnot: function(parent, builder, value) {
      if (value.isObservable) {
        value.doChangeDom(parent, function(bool) {
          if (!bool) {
            return parent.appendChild(builder(value));
          }
        });
      } else {
        if (!value) {
          parent.appendChild(builder(value));
        }
      }
      return parent;
    },
    forEach: function(parent, builder, value) {
      var fill, item, key;
      if (value.isCollection) {
        fill = function(list) {
          if (parent != null) {
            parent.innerHTML = "";
          }
          return list.forEach(function(item, key) {
            return parent.appendChild(builder(item, key));
          });
        };
        value.onDom(parent, "reset reverse sort", fill);
        fill(value.all());
        value.on("push unshift", function(list, e) {
          return list.forEach(function(item, key) {
            if (e === "unshift") {
              return parent.insertBefore(builder(item, key), parent.firstChild);
            } else {
              return parent.appendChild(builder(item, key));
            }
          });
        });
        value.onDom(parent, "splice", function(a, b, index) {
          for (var i=0;i<index[1];i++){
            parent.removeChild(parent.childNodes[index[0]+i]);
          }
        });
      } else if (value.isObservable) {
        value.doChangeDom(parent, function(list) {
          var item, key, _ref, _results;
          if (parent != null) {
            parent.innerHTML = "";
          }
          _ref = value();
          _results = [];
          for (key in _ref) {
            item = _ref[key];
            _results.push(parent.appendChild(builder(item, key)));
          }
          return _results;
        });
      } else {
        for (key in value) {
          item = value[key];
          parent.appendChild(builder(item, key));
        }
      }
      return parent;
    },
    watch: function(parent, builder, watchers) {
      return Watch(watchers).doChangeDom(parent, function() {
        parent.innerHTML = "";
        return parent.appendChild(builder(watchers));
      });
    }
  };

  BaseClass = (function() {

    function BaseClass() {
      this.isObservable = true;
    }

    BaseClass.prototype.clone = function() {
      return _.clone(this);
    };

    BaseClass.prototype.bind = function() {
      var funcs, self;
      funcs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      self = this;
      return _.each(funcs, function(i, m) {
        return self[m] = _.bind(self, self[m]);
      });
    };

    BaseClass.prototype.bindAll = function() {
      var self;
      self = this;
      return _.each(this, function(i, f) {
        if (_.isFunction(f) && !f.isObservable) {
          return self[i] = _.bind(self, f);
        }
      });
    };

    return BaseClass;

  })();

  EventClass = (function(_super) {

    __extends(EventClass, _super);

    EventClass.prototype.isEvent = true;

    function EventClass() {
      EventClass.__super__.constructor.call(this);
      this.callbacks = {};
    }

    EventClass.prototype.on = function(type, callback) {
      var self;
      self = this;
      return _.each(type.split(" "), function(i, t) {
        var _base, _ref;
        if ((_ref = (_base = self.callbacks)[t]) == null) {
          _base[t] = [];
        }
        return self.callbacks[t].push(callback);
      });
    };

    EventClass.prototype.onDom = function(target, type, callback) {
      var self;
      self = this;
      return _.each(type.split(" "), function(i, t) {
        var _base, _ref;
        if ((_ref = (_base = self.callbacks)[t]) == null) {
          _base[t] = [];
        }
        self.callbacks[t].push(callback);
        return _.domRemoved(target, function() {
          return self.off(t, callback);
        }, type);
      });
    };

    EventClass.prototype.off = function(type, callback) {
      var _this = this;
      if (type) {
        return _.each(type.split(" "), function(n, t) {
          if (_this.callbacks[t] && callback) {
            return _.removeFromArray(_this.callbacks[t], callback);
          } else {
            return _this.callbacks[t] = [];
          }
        });
      } else {
        return this.callbacks = {};
      }
    };

    EventClass.prototype.trigger = function(type, value, extras) {
      if (this.callbacks[type] != null) {
        _.each(this.callbacks[type], function(n, c) {
          return typeof c === "function" ? c(value, type, extras) : void 0;
        });
      }
      if (this.callbacks["all"] != null) {
        return _.each(this.callbacks["all"], function(n, c) {
          return typeof c === "function" ? c(value, type, extras) : void 0;
        });
      }
    };

    EventClass.prototype.doChange = function(value, callback) {
      this.on("change", callback);
      return this.trigger("change", this.value);
    };

    EventClass.prototype.doChangeDom = function(target, value, callback) {
      this.onDom(target, "change", callback);
      return this.trigger("change");
    };

    EventClass.prototype.remove = function() {
      this.trigger("remove");
      return delete this;
    };

    EventClass.prototype.buffered = function(type, callback) {
      var timer;
      timer = null;
      return this.on(type, function(a, b, c) {
        return timer = setTimeout(function() {
          clearTimeout(timer);
          return callback(a, b, c);
        }, 0);
      });
    };

    return EventClass;

  })(BaseClass);

  ValidableClass = (function(_super) {

    __extends(ValidableClass, _super);

    function ValidableClass() {
      var _this = this;
      this.isValidable = true;
      this.validations = [];
      this.errors = [];
      ValidableClass.__super__.constructor.call(this);
      this.on("destroy", function() {
        delete _this.validations;
        return delete _this.errors;
      });
    }

    ValidableClass.prototype.validate = function(value) {
      if (value == null) {
        value = this.value;
      }
      this.errors = this.validations.map(function(i) {
        return i(value);
      }).filter(function(i) {
        return i !== true;
      });
      if (this.errors.length > 0) {
        this.trigger("error", this.errors);
        return false;
      } else {
        return true;
      }
    };

    ValidableClass.prototype.addValidation = function(func) {
      return this.validations.push(func);
    };

    return ValidableClass;

  })(EventClass);

  ObservableClass = (function(_super) {

    __extends(ObservableClass, _super);

    function ObservableClass(value) {
      var _this = this;
      this.value = value;
      ObservableClass.__super__.constructor.call(this);
      this.on("destroy", function() {
        return delete _this.value;
      });
    }

    ObservableClass.prototype.set = function(newValue, force) {
      if (force == null) {
        force = false;
      }
      if ((force || newValue !== this.value) && this.validate(newValue)) {
        this.value = newValue;
        return this.trigger("change", newValue);
      }
    };

    ObservableClass.prototype.get = function() {
      interceptObservableCalls.push(this);
      return this.value;
    };

    ObservableClass.prototype.doChange = function(callback) {
      this.on("change", callback);
      return callback(this.value);
    };

    ObservableClass.prototype.doChangeDom = function(element, callback) {
      this.onDom(element, "change", callback);
      return callback(this.value);
    };

    return ObservableClass;

  })(ValidableClass);

  Observable = function(value) {
    var func, instance;
    instance = new ObservableClass(value);
    func = function(newValue) {
      if (newValue != null) {
        return instance.set(newValue);
      } else {
        return instance.get();
      }
    };
    return _.extend(func, instance);
  };

  interceptObservableCalls = (function() {
    var func, list;
    list = null;
    func = function(f) {
      list = [];
      f();
      return list;
    };
    func.push = function(i) {
      return list != null ? list.push(i) : void 0;
    };
    return func;
  })();

  Watcher = function(list) {
    var instance, notifier,
      _this = this;
    instance = new EventClass();
    notifier = function(value, type, i) {
      return instance.trigger(type);
    };
    _.each(list, function(n, i) {
      if ((i != null ? i.isObservable : void 0) != null) {
        return i.on("all", function(value, type) {
          return notifier(value, type, i);
        });
      }
    });
    return instance;
  };

  Computed = function(computer, bindTo) {
    var all, func, instance, l, value, watch;
    value = null;
    l = interceptObservableCalls(function() {
      return value = computer.apply(bindTo);
    });
    watch = Watcher(l);
    instance = new ObservableClass(value);
    watch.on("all", function() {
      return instance.set(computer());
    });
    func = function() {
      return instance.get();
    };
    all = _.extend(func, instance);
    all.off = function() {
      watch.off();
      watch = null;
      instance.off();
      return instance = null;
    };
    return all;
  };

  ModelClass = (function(_super) {

    __extends(ModelClass, _super);

    function ModelClass(values) {
      var self;
      self = this;
      if (!(this.init != null)) {
        throw "Model must have an init method";
      }
      this.uuid = _.uuid();
      ModelClass.__super__.constructor.call(this);
      this.bindAll();
      this.init.apply(this, values);
      _.each(this, function(key, value) {
        var _ref;
        if ((_ref = self[key]) != null ? _ref.isObservable : void 0) {
          return self[key].on("change error remove", function(v, t) {
            return self.trigger(t, v);
          });
        }
      });
    }

    ModelClass.prototype.remove = function() {
      var i, v, _results;
      this.trigger("remove", this);
      _results = [];
      for (i in this) {
        v = this[i];
        if (v.callbacks) {
          v.callbacks = {
            all: []
          };
          _results.push(v = null);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return ModelClass;

  })(EventClass);

  Model = function(props) {
    var submodel;
    submodel = _.wildClass(ModelClass, props);
    return function() {
      var values;
      values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return new submodel(values);
    };
  };

  CollectionClass = (function(_super) {

    __extends(CollectionClass, _super);

    function CollectionClass(list) {
      var self;
      this.isCollection = true;
      self = this;
      CollectionClass.__super__.constructor.call(this);
      this.reset(list);
      this.length = Observable(this.list.length);
      this.on("remove", function(item) {
        return self.remove(item);
      });
      this.bindAll();
      if (typeof this.init === "function") {
        this.init(this.list);
      }
    }

    CollectionClass.prototype.all = function() {
      return this.list;
    };

    CollectionClass.prototype.at = function(index) {
      return this.list[index];
    };

    CollectionClass.prototype.remove = function(arg) {
      var i, index, _i, _len, _results;
      if (_.isArray(arg)) {
        _results = [];
        for (_i = 0, _len = arg.length; _i < _len; _i++) {
          i = arg[_i];
          _results.push(this.remove(i));
        }
        return _results;
      } else if (_.isFunction(arg) && !arg.isObservable) {
        return this.remove(this.filter(arg));
      } else if (arg != null) {
        index = this.indexOf(arg);
        if (index > -1) {
          return this.splice(index, 1);
        }
      }
    };

    CollectionClass.prototype.removeAt = function(index) {
      if (index > -1) {
        return this.splice(index, parseInt(1));
      }
    };

    CollectionClass.prototype.reset = function(list) {
      var self;
      self = this;
      this.list = list;
      this.list.forEach(function(item) {
        if (item.isObservable) {
          return item.on("all", function(value, type) {
            return self.trigger(type, item);
          });
        }
      });
      return this.trigger("reset", this.list);
    };

    CollectionClass.prototype.create = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.model != null) {
        return this.push(this.model.apply(this, args));
      } else {
        throw "Collection::create -> No model for this collection";
      }
    };

    CollectionClass.prototype.rcreate = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.model != null) {
        return this.unshift(this.model.apply(this, args));
      } else {
        throw "Collection::rcreate -> No model for this collection";
      }
    };

    CollectionClass.prototype.destroy = function() {
      this.reset([]);
      this.trigger("remove", this);
      return this.trigger("destroy", this);
    };

    return CollectionClass;

  })(EventClass);

  "reverse sort push pop shift unshift splice".split(" ").forEach(function(type) {
    return CollectionClass.prototype[type] = function() {
      var args, extras, results, self;
      args = [].slice.call(arguments, 0);
      results = [][type].apply(this.list, args);
      self = this;
      switch (type) {
        case "push":
        case "unshift":
          results = args;
          results.forEach(function(item) {
            if (item.isObservable) {
              return item.on("all", function(value, type) {
                return self.trigger(type, item);
              });
            }
          });
          break;
        case "pop":
          if (typeof results.remove === "function") {
            results.remove();
          }
          this.trigger("splice", results, [this.length(), 1]);
          break;
        case "shift":
          if (typeof results.remove === "function") {
            results.remove();
          }
          this.trigger("splice", results, [0, 1]);
          break;
        case "splice":
          extras = args;
          results.forEach(function(item) {
            return item.remove && item.remove();
          });
      }
      this.trigger(type, results, extras);
      this.length(this.list.length);
      return this;
    };
  });

  "join concat slice indexOf lastIndexOf forEach map reduce reduceRight filter some every".split(" ").forEach(function(type) {
    return CollectionClass.prototype[type] = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return [][type].apply(this.list, args);
    };
  });

  Collection = function(props) {
    var submodel;
    submodel = _.wildClass(CollectionClass, props);
    return function(list) {
      return new submodel(list);
    };
  };

  List = function(list) {
    return new CollectionClass(list);
  };

  Element = (function() {

    Element.prototype.isTemplate = true;

    function Element(element, body, args) {
      var result, self;
      this.element = element;
      self = this;
      if (body && _.isFunction(body)) {
        result = body.apply(self, args);
        if (result != null) {
          switch (typeof result) {
            case "function":
              result.apply(this);
              break;
            case "string":
              this.text(result);
              break;
            case "number":
              this.text(result + "");
          }
        }
      }
    }

    Element.prototype.appendChild = function(node) {
      return this.element.appendChild(node.element);
    };

    Element.prototype.tag = function(name, options) {
      return this.appendChild(new Tag(name, options));
    };

    Element.prototype.include = function() {
      var args, body;
      body = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (body.nodeName != null) {
        return this.element.appendChild(body);
      } else {
        return this.appendChild(new Fragment(body, args));
      }
    };

    Element.prototype.text = function() {
      var node, value, values, _i, _len, _results;
      values = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        if (value != null ? value.isObservable : void 0) {
          node = document.createTextNode(value.get());
          value.on("change", function(v) {
            return node.nodeValue = v;
          });
        } else {
          node = document.createTextNode(typeof value === "function" ? value() : value);
        }
        _results.push(this.element.appendChild(node));
      }
      return _results;
    };

    Element.prototype.only = function(value, body) {
      var start, stop;
      if (value.isObservable) {
        start = this.element.appendChild(document.createComment('only'));
        stop = this.element.appendChild(document.createComment('/only'));
        return value.doChange(function(bool) {
          bool = value();
          var fragment;
          if (bool) {
            fragment = new Fragment(body, [bool]);
            return stop.parentNode.insertBefore(fragment.element, stop);
          } else {
            return _.removeBetweenDom(start, stop);
          }
        });
      } else if (value) {
        return this.include(body);
      }
    };

    Element.prototype.unless = function(value, body) {
      var start, stop;
      if (value.isObservable) {
        start = this.element.appendChild(document.createComment('only'));
        stop = this.element.appendChild(document.createComment('/only'));
        return value.doChange(function(bool) {
          bool = value();
          var fragment;
          if (!bool) {
            fragment = new Fragment(body, [bool]);
            return stop.parentNode.insertBefore(fragment.element, stop);
          } else {
            return _.removeBetweenDom(start, stop);
          }
        });
      } else if (value) {
        return this.include(body);
      }
    };

    return Element;

  })();

  tagNames = 'a abbr address article aside audio b bdi bdo blockquote body button canvas caption cite code colgroup datalist dd del details dfn div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins kbd label legend li main map mark menu meter nav noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small span strong style sub summary sup table tbody td textarea tfoot th thead time title tr u ul video area base br col command embed hr img input keygen link meta param source track wbr';

  _ref = tagNames.split(" ");
  _fn = function(name) {
    return Element.prototype[name] = function() {
      var options;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.tag(name, options);
    };
  };
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    name = _ref[_i];
    _fn(name);
  }

  Fragment = (function(_super) {

    __extends(Fragment, _super);

    function Fragment(body, args) {
      Fragment.__super__.constructor.call(this, document.createDocumentFragment(), body, args);
    }

    return Fragment;

  })(Element);

  Tag = (function(_super) {
    var makeAttributesFromString, makeBody, parseOptions;

    __extends(Tag, _super);

    parseOptions = function(options) {
      var attributes, body, i, _j, _len1;
      attributes = {};
      for (_j = 0, _len1 = options.length; _j < _len1; _j++) {
        i = options[_j];
        switch (typeof i) {
          case 'string':
            attributes = _.deepExtend(attributes, makeAttributesFromString(i));
            break;
          case 'object':
            attributes = _.deepExtend(attributes, i);
            break;
          case 'function':
            body = i;
        }
      }
      return [body, attributes];
    };

    makeAttributesFromString = function(str) {
      var attributes;
      attributes = {
        attr: {},
        "class": {}
      };
      str.split(/(?=\.)|(?=#)|(?=:)|(?=\[)/).forEach(function(token) {
        var tail, values;
        tail = token.slice(1);
        switch (token[0]) {
          case '#':
            return attributes.attr.id = tail;
          case '.':
            return attributes["class"][tail] = true;
          case ':':
            return attributes.attr[tail] = tail;
          case '[':
            values = token.slice(1, -1).split('=');
            return attributes.attr[values[0]] = values[1];
        }
      });
      return attributes;
    };

    makeBody = function(body) {
      return function(value, i) {
        var o;
        o = new Fragment(body, [value, i]);
        return o.element;
      };
    };

    function Tag(tag, options) {
      var attributes, body, element, key, value, _ref1;
      element = document.createElement(tag);
      _ref1 = parseOptions(options), body = _ref1[0], attributes = _ref1[1];
      for (key in attributes) {
        value = attributes[key];
        if (bodyBindings[key]) {
          body = bodyBindings[key](element, makeBody(body), value);
        } else if (attributeBindings[key]) {
          attributeBindings[key](element, value, attributes);
        } else {
          console.warn("Unknown '" + key + "' listening (with value: '" + value + "'). Html attributes must be inside a {attr: {}} object.");
        }
      }
      Tag.__super__.constructor.call(this, element, body);
    }

    return Tag;

  })(Element);

  Template = function(template) {
    return function() {
      var args, o;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.isTemplate != null) {
        o = new Element(this.element, template, args);
      } else {
        o = new Fragment(template, args);
      }
      return o.element;
    };
  };

  if (typeof $ !== "undefined" && $ !== null) {
    $.fn.noir = function(attributes) {
      var makeBody;
      makeBody = function(func, el) {
        var children;
        children = $(el).children().detach();
        return function(value, i) {
          var child;
          child = children.clone()[0];
          func.call(child, value, i);
          return child;
        };
      };
      $(this).each(function(i, element) {
        var key, value, _results;
        _results = [];
        for (key in attributes) {
          value = attributes[key];
          if (noir.bindings.body[key] && attributes["body"]) {
            _results.push(noir.bindings.body[key](this, makeBody(attributes["body"], element), value));
          } else if (noir.bindings.body[key]) {
            _results.push(console.error("'" + key + "' binding requires a body parameter."));
          } else if (noir.bindings.attributes[key]) {
            _results.push(noir.bindings.attributes[key](this, value));
          } else {
            _results.push(console.warn("Unknown '" + key + "' listening (with value: '" + value + "'). Html attributes must be inside a {attr: {}} object."));
          }
        }
        return _results;
      });
      return this;
    };
  }

  noir = {
    utils: _,
    bindings: {
      attributes: attributeBindings,
      body: bodyBindings
    },
    Base: BaseClass,
    Event: EventClass,
    Validable: ValidableClass,
    Observable: Observable,
    Watcher: Watcher,
    Computed: Computed,
    Model: Model,
    Collection: Collection,
    List: List,
    Template: Template
  };

  this.noir = noir;

  if (typeof define === 'function' && define.amd) {
    define('noir', [], function() {
      return noir;
    });
  }

}).call(this);
