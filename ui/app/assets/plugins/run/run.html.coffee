define ->

  $brwoser = noir.Template ->
    @article ".run", ->
      @header ->
        @nav ->
          @dl ".dropdown", ->
            @dt -> "options"
            @dd ->
              @input "#reloadOnChange.styled.dark[type=checkbox]", kobind: "checked: rerunOnBuild", ->
              @label "[for=reloadOnChange]", -> "Re-run on successful build"

          @button ".start", kobind: "text: startStopLabel, click: startStopButtonClicked", ->
          @span kobind: "visible: haveMainClass()", ->
            @text "Main class: "
            @select kobind: "options: mainClasses, value: currentMainClass", ->
            @button ".restart", kobind: "enable: haveActiveTask() && !restartPending(), click: restartButtonClicked", -> "Restart"

        @h1 -> "Run"
        @div ".subheader", kobind: "css: { consoleAvailable: atmosCompatible }", ->
          @p kobind: "text: status", ->
          @p kobind: "visible: playAppStarted", ->
            @text "Open the app: "
            @a "[target=_blank]", kobind: "attr: {href: playAppLink}, text: playAppLink", ->

      @section ".wrapper", ->
        @header ".subheader.subsubheader", kobind: "visible: atmosCompatible, css: { consoleAvailable: atmosCompatible }", ->
          @span kobind: "visible: runningWithoutAtmosBecauseDisabled", ->
            @p ->
              @text "Typesafe Console: Disabled "
              @button kobind: "click: restartWithAtmos", -> "Restart With Console"
          @span kobind: "visible: runningWithoutAtmosButEnabled", ->
            @p ->
              @text "Typesafe Console: Enabled (waiting for launch)"
              @button kobind: "click: restartWithoutAtmos", -> "Restart Without Console"
          @span kobind: "visible: runningWithAtmos", ->
            @p ->
              @text "Typesafe Console: Running... "
              @a "[target=_blank]", kobind: "attr: {href: atmosLink}", -> "Open the Console"
              @button kobind: "click: restartWithoutAtmos", -> "Restart Without Console"
          @span kobind: "visible: notSignedIn", ->
            @p ->
              @text "Typesafe Console: Free Typesafe.com Account Required ("
              @a "[target=_blank]", href: "http://typesafe.com/platform/runtime/console#licensing", -> "why?"
              @text ")"
              @button ".do-pop-over", kobind: "click: showLogin", -> "Login"
          @span kobind: "visible: notRunningAndSignedInAndAtmosEnabled", ->
            @p ->
              Typesafe Console: Enabled 
              @button kobind: "click: disableAtmos", -> "Turn Off Console"
          @span kobind: "visible: notRunningAndSignedInAndAtmosDisabled", ->
            @p ->
              @text "Typesafe Console: Disabled "
              @button kobind: "click: enableAtmos", -> "Turn On Console"
      
        @article ".content", kobind: "css: { consoleAvailable: atmosCompatible }", ->
          @div ".output", ->
            @div ".runapp", kobind: "snapView: outputModel", ->

