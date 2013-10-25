define ["webjars!keymage"], (key) ->

  navigate: ()->

  activate: (list) ->
    list.removeClass("active").removeClass("focus").filter((i, target) =>
      link = $(target).attr("href") || $(target).find("a").attr("href")
      if link? && @isActiveLink(link, window.location.href)
        $(target).addClass("active")
    ).getOrElse(list.first()).addClass("focus")

  isActiveLink: (linkPath, locationPath) ->
    link = (linkPath.split("#")[1] || "").split("/")
    loc = (locationPath.split("#")[1] || "").split("/")
    link.length <= loc.length and link.every (elem, i) -> elem is loc[i]

  focusItem: (list, item) ->
    list.removeClass("active").removeClass("focus").each (i, target) =>
      link = $(target).attr("href") || $(target).find("a").attr("href")
      if link? && @isActiveLink(link, window.location.href)
        $(target).addClass("active")
    item.addClass("focus")

  activateLink: (list, link) ->
    if link?
      item = list.filter((i, target) ->
        $(target).attr("href") == link || $(target).find("a").attr("href") == link
      ).getOrElse(list.first())
    else
      item = list.first()
    @focusItem(list, item)

  activateList: (container) ->
    @activate container.find(".listing").children()

  activateAll: () ->
    $("#wrapper > .list").each (i, l)=>
      @.activate $(".listing",l).children()

  findFocus: (list) ->
    target = list.filter(".focus")
    $(target).attr("href") || $(target).find("a").attr("href")

  gotoRight: (current) ->
    list = current.find(".listing").children()
    target = list.filter(".focus")
    link = $(target).attr("href") || $(target).find("a").attr("href")
    # Looks like we are opening a new link
    if link? && not @isActiveLink(link, window.location.href)
      window.location.hash = link

  gotoUp: (current) ->
    list = current.find(".listing").children()
    target = list
      .filter(".focus").removeClass("focus")
      .getOrElse(list.filter(".active"))
      .prev().getOrElse(list.last())
      .addClass("focus")

    if target.attr("href")
      target[0].focus()
    else
      target.find("a")[0].focus()

    if target.index() == 0 then list.parents(".wrapper").scrollTop(0)

  gotoDown: (current) ->
    list = current.find(".listing").children()
    target = list
      .filter(".focus").removeClass("focus")
      .getOrElse(list.filter(".active"))
      .next().getOrElse(list.first())
      .addClass("focus")

    if target.attr("href")
      target[0].focus()
    else
      target.find("a")[0].focus()

    if target.index() == 0 then list.parents(".wrapper").scrollTop(0)

  adjustScroll: (target) ->
    threshold = 3
    bump = 1
    leftEdge = target.position().left
    rightEdge = leftEdge + target.width()
    wrapper = $("#wrapper")
    if rightEdge > (wrapper.width() + threshold)
      # too far to the right, shift right edge into view
      wrapper.scrollLeft wrapper.scrollLeft() + rightEdge - wrapper.width() + bump
    if leftEdge < (0 - threshold)
      # too far to the left, shift left edge into view
      wrapper.scrollLeft wrapper.scrollLeft() + leftEdge + bump
