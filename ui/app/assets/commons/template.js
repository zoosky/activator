define(function(){

  var context = [];
  var tagNames = 'a abbr address article aside audio b bdi bdo blockquote button canvas caption cite code colgroup datalist dd del details dfn div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup i iframe ins kbd label legend li main map mark menu meter nav object ol optgroup option output p pre progress q rp rt ruby s samp section select small span strong sub summary sup table tbody td textarea tfoot th thead time tr u ul video area base br col hr img input'.split(" ")

  function objToString (obj) {
      var str = '';
      for (var p in obj) {
          if (str != '') {
            str += ',';
          }
          if (obj.hasOwnProperty(p)) {
              str += p + ':' + obj[p];
          }
      }
      return str;
  }

  var addAttribute = function(element, attribute, value) {
    element.setAttribute(attribute, value);
  }

  var parseArguments = function(options) {
    var attributes = {}, bindings = {}, body, i, _i, _len;
    for (_i = 0, _len = options.length; _i < _len; _i++) {
      i = options[_i];
      switch (typeof i) {
        case 'string':
          attributes = $.extend(attributes, makeAttributesFromString(i));
          break;
        case 'object':
          bindings = $.extend(bindings, i);
          break;
        case 'function':
          body = i;
      }
    }
    return [body, attributes, bindings];
  }

  var makeAttributesFromString = function(str) {
    var attributes = {
      "class": {},
      "id": {}
    }
    str.split(/(?=\.)|(?=#)|(?=:)|(?=\[)/).forEach(function(token) {
      var tail, values;
      tail = token.slice(1);
      switch (token[0]) {
        case '#':
          return attributes.id = tail;
        case '.':
          return attributes["class"][tail] = true;
        case ':':
          return attributes[tail] = tail;
        case '[':
          values = token.slice(1, -1).split('=');
          return attributes[values[0]] = values[1];
      }
    });
    return attributes;
  }

  var template = function(body){
    return function() {
      if (!context[0]) {
        context.unshift(document.createDocumentFragment());
        body.apply(this, [].slice.call(arguments));
        return context.shift();
      } else {
        return body.apply(this, [].slice.call(arguments));
      }
    }
  }

  template.text = function(value) {
    if (!value) return;
    node = document.createTextNode(typeof value === "function" ? value() : value);
    context[0].appendChild(node);
  }

  template.comment = function(value) {
    node = document.createComment(value);
    context[0].appendChild(node);
  }

  template.virtual = function(value, body) {
    template.comment("ko "+value);
    body();
    template.comment("/ko");
  }

  template.tag = function(name) {
    return function(){
      return makeTag.call(null,name, [].slice.call(arguments));
    }
  }
  var makeTag = function(name, args) {

    var element     = document.createElement(name);
    var tuple       = parseArguments(args);
    var body        = tuple[0];
    var attributes  = tuple[1];
    var bindings    = tuple[2];

    if (context[0]) {
      context[0].appendChild(element);
    }
    context.unshift(element);

    var key;
    for (key in attributes) {
      addAttribute(element, key, attributes[key]);
    }
    var bindingsStr = objToString(bindings);
    if (bindingsStr){
      addAttribute(element, "data-binding", bindingsStr);
    }

    var result;
    if (body) {
      result = body();
      if (result != null) {
        switch (typeof result) {
          case "function":
            result();
            break;
          case "string":
            template.text(result);
            break;
          case "number":
            template.text(result + "");
        }
      }
    }

    return context.shift();
  }


  window.__ = {};
  tagNames.forEach(function(name){
    window.__[name] = function(){
      return makeTag.call(null,name, [].slice.call(arguments));
    }
  });

  return template;

});
