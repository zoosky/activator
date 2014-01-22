_ = {}

_.Module = template (extraClass, title, body, subheader, footer)->
  @article ".module" + extraClass, ->
    @header ->
      @div ".buttons", ->
        @button -> "option"
        @dl ".button", ->
          @dt -> "list"
      @h1 ->
        @span ".title", -> title
    if subheader?
      @aside subheader
    if footer?
      @include footer
    if body?
      @section ".wrapper", body

_.DetailsModule = template (extraClass, title, body, footer)->
  @include _.Module ".details" + extraClass, title, body, null, footer

_.Details = template (extraClass, title, metricsList)->
  body = ->
    @div ".metricBoxes"
  footer = ->
    @footer ".filters", ()->
      @include _.FilterGroupedSelect ".addMetric", "Add New Metric:", metricsList

  @include _.DetailsModule extraClass, title, body, footer

_.ListModule = template (extraClass, title, body, subheader, footer)->
  @include _.Module ".list" + extraClass, title, body, subheader, footer

_.ListModuleItem = template (extraClass, title, link, count)->
  @li ".details" + extraClass, ->
    @h2 ->
      @a href: link, ->
        @text title
        @span ".counter", -> count

_.Menu = template (extraClass, title, list)->
  @include _.ListModule ".menu" + extraClass, title, ->
    @ul ".listing", forEach: list, (item, id)->
      # { id: {title: "Title", url: "#/url/"}}
      @li class: {id: true}, ->
        @h2 ->
          @a href: item.url, ->
            @span ".label", -> item.title
            @span ".counter"

_.FilterGroupedSelect = template (extraClass, title, groups)->
  # Params:
  # [{ "First Group": [ option: "Option Name 1" ] },
  # { "Second Group": [ option: "Option Name 1" ] }]
  @p ".select" + extraClass, ->
    @select ->
      @option -> title
      for group, list of groups
        @optgroup attr: {label: group}, forEach: list, (value, name)->
          @option value: value, -> value

_.FilterSelect = template (extraClass, title, options)->
  @p ".select" + extraClass, ->
    @select forEach: list, (value, name)->
      @option value: value, -> name

_.FilterInput = template (extraClass)->
  @p ".input" + extraClass, ->
    @input "[type=text][placeholder=*]"
    @span ".clear"


window._ = _
define ["css!./modules"], _