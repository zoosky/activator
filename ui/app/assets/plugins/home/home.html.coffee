@div "#welcome-holder", ->
  @div "#welcome-message", ->
    @header -> "Your application is ready!"

    @ul ->
      @li ->@a href: "#code", -> "Code view &amp; Open in IDE"
      @li ->@a href: "#compile", -> "Compile &amp; Log view"
      @li ->@a href: "#run", -> "Run the app"
      @li ->@a href: "#test", -> "Test the app"

    @div "#welcome-news", kobind: "html: newsHtml", ->

    @p ".feedback", ->
        @text "Problems?"
        @a "[target=_blank]", href: "https://github.com/typesafehub/activator/issues", -> "Search Issues"
        @text " or "
        @a "[target=_blank]", href: "https://github.com/typesafehub/activator/issues/new", -> "Create a New Issue"

  @p "version-info", ->
    @text "Typesafe Activator "
    @span kobind: "text: appVersion", ->
    @br ->
    @a ".tos[target=_blank]", href: "http://typesafe.com/legal/softwareterms", -> "Terms of Use"
