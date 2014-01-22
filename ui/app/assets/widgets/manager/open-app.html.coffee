define ->

  render: template (recentApps)->
    @section "#open", ->
      @header ->
        # @button ".open", -> "📁"
        @h2 -> "Open app"
      @article "#openAppForm", ->
        @ul ".list#recentApps", forEach: recentApps, (app)->
          @li ->
            @h3 ->
              @a href:"/appID", -> "root"
            @p ".path", -> "/Users/iamwarry/Work/Typesafe/Console/activator"
      @div "#openAppLocationBrowser.subsection.hidden"
