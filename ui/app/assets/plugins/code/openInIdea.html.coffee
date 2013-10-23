define ->

  $openInIdea = noir.Template ->
    @div ->
      @div ".start", ->
        @div kobind:  "visible: haveProjectFiles", ->
          @text "Your app already has IntelliJ IDEA project files. You can"
          @a kobind: "click: generate", -> "regenerate them or"
          @text "just see how to"
          @a kobind: "click: instructions", -> "import the app into IntelliJ IDEA"
        
        @div kobind: "visible: !haveProjectFiles()", ->
          @text "Your app has no IntelliJ IDEA project files."
          @a kobind: "click: generate", -> "Generate them now"

      @div ".generate.hidden", ->
        @p kobind: "text: workingStatus", ->
        @div kobind: "snapView: log", ->
        @p ->
          @text "Once you've generated project files,"
          @a kobind: "click: instructions", ->
            "import the project into IntelliJ IDEA."

      @div ".instructions.hidden", ->
        @p kobind: "visible: haveProjectFiles", ->
          "Now that you've generated your project files:"
        @p kobind: "visible: !haveProjectFiles()", ->
          "It looks like you don't have IntelliJ IDEA project files, but if you did, you would do this:"
        @ol ->
          @li ->
            @text "Launch IntelliJ IDEA and select"
            @strong -> "Open..."
            @text "from the"
            @strong -> "File menu"
          @li ->
            @text "Select"
            @strong kobind: "text: projectDirectory", -> "in the dialog box"
            @text "and click"
            @strong -> "OK"

        @p ->
          @text "If you need to (re)generate your project files, "
          @a kobind: "click: start", -> "start over"
