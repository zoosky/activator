define ['text!./overview.html', './atom', './list'], (template, Atom, list) ->

  class Overview extends Atom
    moduleName: "overview"
    breadcrumb: "Overview"
    dataTypes: ["overview"]
    dom: undefined

    constructor: (@parameters) ->
      @loadState()

    render: ->
      @dom = $(template).clone()
      @list = @dom.find(".listing")
      p = @parameters
      @list.template @data,
        ".actors a[href]": (o) -> "#inspect/actors"
      @items = @list.children()
      list.activate @items
      @dom

    update: () ->
      list.activate @items

    destroy: ->
      delete @parameters
      delete @dom

    onData: (data) ->
      @list.template data,
        ".actors .counter": (o) -> window.format.shortenNumber o.actorPathCount
      @

    getConnectionParameters: ->
      parameters =
        name: @moduleName
        scope: {}

  Overview
