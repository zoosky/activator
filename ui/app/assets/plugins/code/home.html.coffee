define ->

  $home = noir.Template ->
    @article ".code", ->
      @div ".container", ->
        @div ".browser", kobind: "snapView: browser", ->
        @div ".editor", kobind: "snapView: viewer", ->
