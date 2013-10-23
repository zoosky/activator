api = {}

# -------------------------
# CORE OBJECTS
# -------------------------
Base = ->
  clone: -> clone @

  # @funcs: list of functions as parameters
  bind: (funcs...)->
    self = @
    funcs.forEach (i)->
      self[i] = bind self, self[i]

  #
  bindAll: ->
    self = @
    each @, (k,v)->
      if isFunction(v)
        self[k] = bind self, v

# Provide eventing to noir object's
Event = ->
  callbacks = {}
  extend Base(),
    isEvent: true

    # @type: String[ String]...
    # @callback: Function
    on: (type, callback)->
      type.split(" ").forEach (t)->
        callbacks[t] ?= []
        callbacks[t].push(callback)
      @

    # @type: [String[ String]...]
    # @callback: [Function]
    off: (type, callback)->
      if type
        type.split(" ").forEach (t)->
          if callback
            removeFromArray(callbacks[t], callback)
          else
            callbacks[t] = []
      else
        callbacks = {}
      @

    # @type: String
    # @value: Object
    trigger: (type, value)->
      callbacks[type]?.forEach (c)-> c(value, type)
      callbacks["all"]?.forEach (c)-> c(value, type)

# Provide validation to noir object's
# - Events: "error"
Validable = ->
  validations = []
  extend Event(),
    isValidable: true

    # @value: Object
    validate: (value)->
      e = validations.map((i)-> i(value)).filter((i)->i?)
      if e.length
        @trigger "error", e
        false
      else
        true

    # @func: Function
    addValidation: (func)-> validations.push func

# Observer model
# @value: default value
# - Events: "change"
Observable = (value)->
  extend Validable(),
    isObservable: true

    # @newValue: Object
    # @force: Boolean
    #   -> Force event triggering no matter what
    set: (newValue, force = false)->
      if (!force && newValue != value) && @validate(newValue)
        value = newValue
        @trigger("change", value)

    #
    get: -> value

    # @callback: Function
    doChange: (callback)->
      @on("change", callback)
      callback(value)

# Observe multiple Observables
# @list: Observable[, Observable...]
# @list: Array[Observable]
# - Events: "change"
Watch = (list...)->
  if list.length == 1 && {}.toString.call(list[0]) == '[object Array]'
    list = list[0]
  timer = undefined
  notifier = (value, type)->
    trigger.trigger("change", value)
  for i in list
    if i.isObservable?
      i.on "all", notifier
  trigger = Observable(list)

# Computed values on Observables
# @list: Observable[, Observable...]
# @compute: Function
# -> Takes @list in paramters
# - Events: "change"
Computed = (list..., compute)->
  self = @
  watcher = Watch.apply(@, list)
  watcher.on "all", ->
    value.set compute.apply(self, list)
  value = Observable compute.apply(self, list)

# -------------------------
# MODEL
# -------------------------
# @struct: Object
# - Events: "change remove"
# Returns a Function that allow to create Objects
Model = (struct)->
  if !struct.create?
    throw "Model must have a create method"
  (params...)->
    base = struct.create.apply(@, params)
    base.uuid = uuid()
    obj = extend base, Observable(base), struct,
      isModel: true

      #
      remove: ->
        @trigger("remove", @)

    # Create events if something happens inside
    each base, (key, value)->
      if obj[key].isObservable
        obj[key].on "change error remove", (v, t)->
          # A bit weird but very convenient
          obj.trigger(t, v)

    # is there an init method?
    obj.init?()
    obj

# -------------------------
# COLLECTION
# -------------------------
# Provides Array's api to an Observable
# @struct: Object
# - Events: "reverse sort push pop shift unshift splice change remove"
Collection = (struct)->
  list = []

  mutable = "reverse sort push pop shift unshift splice".split(" ").reduce((api, type)->
    api[type] = (args...)->
      results = [][type].apply(@get(), args)
      self = @

      switch type
        when "push","unshift"
          results = args
          results.forEach (item)->
            if item.isObservable
              item.on "all", (value, type)->
                self.trigger(type, value)
        when "pop","shift"
          results = args
          results.forEach (item)-> item.remove?()
        when "splice"
          results.forEach (item)-> item.remove?()

      @trigger type, results
      @ # Let's chain
    api
  , {})

  immutable = "join concat slice indexOf lastIndexOf forEach map reduce reduceRight filter some every".split(" ").reduce((api, type)->
    api[type] = (args...)->
      [][type].apply(self.get(), args)
    api
  , {})

  self = extend Observable(list), mutable, immutable, struct,
    isCollection: true

    # Get all items
    all: -> @get()

    # Remove one or many items
    # @arg: Model -> remove item
    # @arg: Array[Model] -> remove all items
    # @arg: Function -> function as filter
    remove: (arg)->
      if isArray arg
        for i in arg
          @remove i
      else if isFunction arg
        @remove @filter(arg)
      else
        index = @indexOf(arg)
        o = @splice( index ,1) if index > -1

    # Reset the list
    # @newList: Array[Model]
    reset: (newList)->
      @remove @get()
      newList.forEach (item)=>
        @push item

    # Create an instance of Model, and append it to the collection
    # @args...: same as Model's args
    create: (args...)->
      if @model?
        @push @model.apply(@, args)
      else
        throw "Collection::create -> No model for this collection"

    # Same as create but prepend
    rcreate: (args...)->
      if @model?
        @unshift @model.apply(@, args)
      else
        throw "Collection::rcreate -> No model for this collection"

  # WAT?
  self.on "remove", (item)-> self.remove item
  # length as an Observable
  self.length = Computed self, (t)-> t.get().length
  self.init?()
  self

# -------------------------
# TEMPLATING
# -------------------------
Template = do ->

  # TemplateNode
  # Deals with context and appending
  # @parent: [DomElement] The parent Dom Element of the Node
  # @body:   [Function(@args)] The body of the Node
  # @args:   [Array] List of arguments to pass to the body
  TemplateNode = do ->

    # Where the @keyword magic happens in the templates
    class MagicTag
      constructor: (@parent)->
        @views = []

      appendChild: (el)->
        @parent.appendChild el
        @views.push el
        el

      # Creates a Tag form the tag name and some options
      tag: (name, options)->
        @appendChild TemplateTag name, options

      # Whenever you need to include a template or a partial, or a function
      include: (body, args...)->
        if body.nodeName?
          @appendChild body
        else
          @appendChild TemplateFragment body, args

      # Dynamic text value
      text: (values...)->
        for value in values
          if value?.isObservable
            node = document.createTextNode("")
            value.doChange (v)-> node.nodeValue = v
          else
            node = document.createTextNode( if typeof value == "function" then value() else value )
          @appendChild(node)

      comment: (value)->
        node = document.createComment(value)
        @appendChild(node)

      watch: (values..., compute)->
        for value in values
          if value?.isObservable
            node = document.createTextNode("")
            value.doChange (v)-> node.nodeValue = compute v
          @appendChild(node)

    # Create magic @tag for each html5
    tagNames = 'a abbr address article aside audio b bdi bdo blockquote body button canvas caption cite code colgroup datalist dd del details dfn div dl dt em fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins kbd label legend li main map mark menu meter nav noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small span strong style sub summary sup table tbody td textarea tfoot th thead time title tr u ul video area base br col command embed hr img input keygen link meta param source track wbr'
    for name in tagNames.split(" ")
      ((name) ->
        MagicTag.prototype[name] = (options...)-> @tag(name, options)
      )(name)

    api.addTag = addTag = (name, func)->
      MagicTag.prototype[name] = func

    # TemplateNode function
    (parent, body, args)->
      if body?
        ctx = new MagicTag(parent)
        result = body.apply ctx, args
        # Regarding the result, we may have to continue
        if result?
          switch typeof result
            when "function" then result.apply ctx
            when "string" then ctx.text result
            when "number" then ctx.text result + ""
      ctx


  TemplateFragment = (body, args)->
    element = document.createDocumentFragment()
    # Render
    if body?
      new TemplateNode element, body, args
    element


  TemplateTag = do ()->

    # -------------------------
    # BODY BINDINGS
    # -------------------------
    bodyBindings = do ()->
      if: (body, value)->
        if value.isObservable?
          ()->
            parent = @parent
            value.doChange (bool)->
              if bool
                TemplateNode parent, body
        else
          if value then body

      forEach: (body, value)->
        if value.isCollection?
          ()->
            parent = @parent
            fill = (list)->
              parent?.innerHTML = ""
              list.forEach (item, key)->
                wrap = TemplateNode parent, body, [item, key]
                item.__views = wrap.views
            value.on "reset", fill
            fill value.all()
            # when adding an item
            value.on "push unshift", (list, e)->
              list.forEach (item, key)->
                wrap = TemplateNode parent, body, [item, key]
                for view in wrap.views
                  if e == "unshift"
                    parent.insertBefore(view, parent.firstChild)
                  else
                    parent.appendChild(view)
                item.__views = wrap.views
            # when removing
            value.on "remove", (item)->
              item.__views.forEach (el)->
                el?.parentNode?.removeChild el
        else if value.isObservable?
          ()->
            parent = @parent
            value.doChange (list)->
              parent?.innerHTML = ""
              for key, item of list
                wrap = TemplateNode parent, body, [item, key]
                item.__views = wrap.views
        else
          ()->
            parent = @parent
            for key, item of value
              wrap = TemplateNode parent, body, [item, key]
              item.__views = wrap.views

      watch: (body, value)->
        ()->
          parent = @parent
          Watch(value).doChange ()->
            parent.innerHTML = ""
            new TemplateNode parent, body

    api.bodyBindings = bodyBindings
    api.addBodyBinding = addBodyBinding = (name, func)->
      bodyBindings[name] = func

    # -------------------------
    # ATTRIBUTES BINDINGS
    # -------------------------
    attributeBindings = do ()->

      handleObservable = (action)->
        (element, value)->
          if value?.isObservable
            value.doChange (v)-> action(element, v)
          else
            action(element, value)

      handleValueObservable = (action)->
        (element, value)->
          if value?.isObservable
            # Two ways for forms
            if element.tagName == "INPUT" || element.tagName == "SELECT"
              value.doChange (v)->
                if element.type == "checkbox" || element.type == "radio"
                  element.checked = value.get()
                else
                  element.value = value.get()
              element.onchange = ()->
                if element.type == "checkbox" || element.type == "radio"
                  value.set element.checked
                else
                  value.set element.value
            value.doChange (v)-> action(element, v)
          else
            action(element, value)

      handleObservableList = (action)->
        (element, values)->
          for key, value of values
            ((element, key, value)->
              if value?.isObservable then value.doChange (v)-> action(element, key, v)
              else action(element, key, value)
            )(element, key, value)

      text: (element, value)->
        # element.appendChild(document.createTextNode( value ))
        node = document.createTextNode( if typeof value == "function" then value() else  )
        if value.isObservable then value.on "change", (v)-> node.nodeValue = v
        element.appendChild(node)

      visible: handleObservable (element, value)->
        element.style.display = if value then "block" else "none"

      html: handleObservable (element, value)->
        element.innerHTML = value

      value: handleValueObservable (element, value)->
        element.value = value

      checked: handleValueObservable (element, value)->
        addAttribute element, "checked", value

      href: handleObservable (element, value)->
        addAttribute element, "href", value

      name: handleObservable (element, value)->
        addAttribute element, "name", value

      css: handleObservableList (element, key, value)->
        element.style[key] = value

      class: handleObservableList (element, key, value)->
        if value then element.classList.add key
        else element.classList.remove key

      attr: handleObservableList (element, key, value)->
        addAttribute element, key, value

      data: handleObservableList (element, key, value)->
        addAttribute element, "data-" + key, value

      event: (element, values, attrs)->
        for key, value of values
          element.addEventListener key, (e)->
            value(e, attrs.scope)
          , false

      click: (element, value, attrs)->
        element.addEventListener "click", (e)->
          value(e, attrs.scope)
        , false

      submit: (element, value, attrs)->
        element.onsubmit = (e)->
          e.preventDefault()
          console.log e
          value(e,attrs.scope)

      bind: (element, func, attrs)->
        setTimeout ->
          func element, attrs
        ,0

      scope: noop

    api.attributeBindings = attributeBindings
    api.addAttributeBinding = addAttributeBinding = (name, func)->
      attributeBindings[name] = func

    parseOptions = (options)->
      attributes = {}
      for i in options
        switch typeof i
          when 'string' then attributes = extend attributes, makeAttributesFromString(i)
          when 'object' then attributes = extend attributes, i
          when 'function' then body = i
      [body, attributes]

    makeAttributesFromString = (str)->
      # Kuddos to http://stackoverflow.com/a/17888178/561435
      attributes = {attr:{},class:{}}
      str.split(/(?=\.)|(?=#)|(?=:)|(?=\[)/).forEach (token)->
        tail = token.slice(1)
        switch (token[0])
          when '#' then attributes.attr.id = tail
          when '.' then attributes.class[tail] = true
          when ':' then attributes.attr[tail] = tail
          when '['
            values = token.slice(1,-1).split('=')
            attributes.attr[values[0]] = values[1]
      attributes

    addAttribute = (element, attribute, value)->
      if value == false
        element.removeAttribute attribute
      else
        element.setAttribute attribute, value


    # TemplateTag function
    (tag, options)->
      element = document.createElement tag
      [body, attributes] = parseOptions options

      # Bind attributes
      for key, value of attributes
        if bodyBindings[key]
          body = bodyBindings[key] body, value
        else if attributeBindings[key]
          attributeBindings[key] element, value, attributes
        else
          console.warn "Unknown '#{key}' listening (with value: '#{value}'). Html attributes must be inside a {attr: {}} object."

      TemplateNode element, body
      element

  # Template function
  (template)->
    (args...)->
      # If the template is called from within a template, get the parent
      parent = if @parent?.childElementCount? then @parent else TemplateFragment()
      TemplateNode parent, template, args
      parent

# -------------------------
# UTILITY FUNCTIONS
# -------------------------
noop = ->

extend = (source, objects...) ->
    for i in objects
        for k, v of i
            source[k] = v
    source

each = (object, func)->
  for k,v of object
    func k,v
  object

bind = (context, func)->
  (args...)-> func.apply(context, args)

bindAll = (object)->
  each object, (k,v)->
    if v.bind?
      o[k] = v.bind object
    else if typeof v == "function"
      o[k] = bind object, v
  object

removeFromArray = (array, element)->
  while `index = array.indexOf(element), index != -1`
    array.splice(index,1)

isFunction = (object)->
  typeof object == "function"

isObject = (object)->
  typeof object == "object"

isArray = (array)->
  {}.toString.call(array) == '[object Array]'

clone = (object) ->
  if isObject object then extend object
  if isArray object then object.slice()
  else object

uuid = ()->
  s4 = ()->Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  s4() + s4() + '-' + s4() + s4() + '-' + s4() + s4()

# -------------------------
# EXPORT
# -------------------------
noir =
  api: api
  utils:
    extend: extend
    each: each
    removeFromArray: removeFromArray
    isObject: isObject
    isArray: isArray
    clone: clone
    uuid: uuid
  Base: Base
  Event: Event
  Validable: Validable
  Observable: Observable
  Watch: Watch
  Computed: Computed
  Model: Model
  Collection: Collection
  Template: Template

# -------------------------
# REQUIRE
# -------------------------
if "function" == typeof define
  define noir
else
  @noir = noir


