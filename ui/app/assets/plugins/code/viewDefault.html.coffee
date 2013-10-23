define ->

  $viewDefault = noir.Template ->
    @text "Unable to display:"
    @span kobind: "text: filename", ->
