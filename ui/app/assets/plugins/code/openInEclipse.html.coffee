define ->

  $openInEclipse = noir.Template ->
    @div ->
      @div ".start", ->
        @div kobind: "visible: haveProjectFiles", -> 
          @text " Your app already has Eclipse project files. You can "
          @a kobind: "click: generate", -> "regenerate them"
          @text " or just see how to "
          @a kobind: "click: instructions", -> "import the app into Eclipse"

        @div kobind: "visible: !haveProjectFiles()", ->
          @text " Your app has no Eclipse project files. "
          @a kobind: "click: generate", -> "Generate them now"

      @div ".generate.hidden", ->
        @p kobind: "text: workingStatus", ->
        @div kobind: "snapView: log", ->

        @p ->
          @text " Once you've generated project files, "
          @a kobind: "click: instructions", ->
            "import the project into Eclipse"

      @div ".instructions.hidden", ->

        @p kobind: "visible: haveProjectFiles", ->
          "Now that you've generated your project files:"

        @p kobind: "visible: !haveProjectFiles()", ->
          "It looks like you don't have Eclipse project files, but if you did, you would do this:"

        @ol ->
          @li ->
            @text "Launch Eclipse and select "
            @strong -> "Import..."
            @text " from the "
            @strong -> "File menu"
          @li ->
            @text " In the import dialog, choose "
            @strong -> "Existing Projects Into Workspace"
            @text " and click "
            @strong -> "Next"
          @li ->
            @text "In the import dialog, browse to "
            @strong kobind: "text: projectDirectory", ->
            @text " You should see your app's project(s) there. "
          @li ->
            @text "Select your project and click "
            @strong -> "Finish."

        @p ->
          @text "If you need to (re)generate your project files, "
          @a kobind: "click: start", -> "start over"
