@article ".compile", ->
  @header ->
    @nav ->
      @dl ".dropdown", ->
        @dt -> "options"
        @dd ->
          @input "[type=checkbox].styled.dark", kobind: "checked: recompileOnChange, id: recompileOnChange", ->
          @label attr: {for: "recompileOnChange"}, -> "Recompile on file changes"

      @button ".start", kobind: "text: startStopLabel, click: startStopButtonClicked", ->

    @h1 -> "Log output"
    @p ".subheader", ->

  @section ".wrapper", ->
    @div kobind: "snapView: logModel", ->
