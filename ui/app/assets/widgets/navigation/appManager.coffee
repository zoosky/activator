define ->

  $switch = noir.Template ->
    @dl "#switch", dropdown: onAppChange, ->
      @dt -> "Appname"
      @dd ->
        @button ".new-app", -> "Manage applications"
        @a "[href=/]", -> "Akka"
        @a "[href=/]", -> "Scala"

  onAppChange = (e)->
    console.log "App change"

  render: (scope)->
    $switch()
