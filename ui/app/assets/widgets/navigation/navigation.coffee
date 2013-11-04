define ['widgets/typesafe/typesafe', 'widgets/buttons/dropdown', './appManager'], (typesafe, dropdown, appManager)->

  links =
    'Learn':
      '#Tutorial': "Tutorial"
      '#Documentation': "Documentation"
      '#Java': "Java API"
      '#Scala': "Scala API"
      '#Trainings': "Trainings"
    'Develop':
      '#Code': "Code"
      '#Run': "Run"
      '#Debug': "Debug"
      '#Test': "Test"
    'Team':
      '#Versioning': "Versioning"
      '#Integration': "Integration"
    'Deploy':
      '#Stage': "Stage"
      '#Heroku': "Heroku"

  $navigation = noir.Template ->
    @nav "#navigation", ->
      @include appManager.render()
      @div "#appStatus", ->
        @button ".running"
        @button ".refresh"
        @button ".console"
        @button ".testing"
      @dl "#rockets", bind: activate, forEach: links, (links, sectionTitle)->
        @dt -> sectionTitle
        @dd forEach: links, (linkTitle, url)->
          @a href: url, -> linkTitle
      @include typesafe.render()

  activate = (scope)->
    $scope = $(scope)
    $sections = $("dt", scope)

    # Auto collapse the menu
    navigationSneakTimer = 0
    $("#header .toggleNavigation").mouseover ->
      $("body").not(".navigation-opened").addClass("navigation-sneak")
    $("#navigation")
      .mouseleave ->
        navigationSneakTimer = setTimeout ->
          $("body").removeClass("navigation-sneak")
        ,500
      .mouseenter ->
        clearTimeout navigationSneakTimer

    # When the screen is too small, we fold sections
    # Calcultate once and for all
    positions = []
    offsets = []
    elementHeight = 42
    calcultate = ->
      totalHeight = $scope.outerHeight()
      if scope.scrollHeight > totalHeight then return []
      $sections.each (i, it)->
        $it = $(it)
        offsets[i] ?= it.offsetTop
        positions[i] = 
          stickTop: i*elementHeight
          stickBottom: totalHeight-($sections.length-i)*elementHeight
          start: offsets[i] - elementHeight*i
          stop: offsets[i] - totalHeight + ($sections.length-i)*elementHeight
          element: $it

    $scroll = $scope.wrapInner("<div class='inner'/>").find(".inner").scroll (e)->
      # console.log this.scrollTop
      for i in positions
        if i.start < this.scrollTop
          i.element.addClass("stick")
          i.element.css("top", i.stickTop+"px")
        else if i.stop < this.scrollTop
          i.element.removeClass("stick")
        else
          i.element.addClass("stick")
          i.element.css("top", i.stickBottom+"px")

    $(window).on "resize", ->
      calcultate()
      $scope.find(".inner").trigger("scroll")
    .trigger "resize"

    # FAKE CLICK
    $scope
      .on "click", "a", (e) ->
        $(".active", scope).removeClass("active")
        $(this).addClass("active").parent().prev().addClass("active")
        false

    $("dt", scope).each (i,it)->
      $(it).click ->
        $scroll.scrollTop positions[i].start


    # Animation tempo
    $("a, dt", scope)
      .each (i, it)->
        $(it).css
          webkitAnimationDelay: (i*20+100)+"ms"
          animationDelay: (i*20+100)+"ms"


  render: $navigation
