define ->

  align = ->
    $("#console").scrollLeft 99999

  resize = ->
    screen = $("#console").width()
    size = (if screen < 660 then 1 else (if screen < 990 then 2 else (if screen < 1320 then 3 else (if screen < 1650 then 4 else (if screen < 1980 then 5 else 0)))))
    $("#console").attr "data-width", size
    align()

  init: ->
    $(window).on("resize", resize).trigger "resize"

  render: (modules) ->
    modules = modules.map (module) ->
      container = $("#console > *").eq(module.index)
      if container.data("path") is module.path
        module.module.update?()
      else
        module.view = $(module.module.render()).data("path", module.path).css("z-index", 100 - module.index)
        container = (if !!container.length then container.replaceWith(module.view) else module.view.addClass("fadein").appendTo("#console"))
        # $("article", module.view).smoothScroll()
      module

    modules[modules.length - 1].view.nextAll().remove() if modules[modules.length - 1].view

    resize()

