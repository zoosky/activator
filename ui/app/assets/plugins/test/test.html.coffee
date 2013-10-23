define ->

  $brwoser = noir.Template ->
    @article ".test", ->
      @header ->
        @nav ->
          @dl ".dropdown", ->
            @dt -> "options"
            @dd ->
              @input type: checkbox, kobind:  checked: rerunOnBuild, id: retestOnSuccessfulBuild, class: styled dark, ->
              @label "[for=retestOnSuccessfulBuild]", -> "Re-test on successful build"

          @button class: start, kobind:  text: startStopLabel, click: startStopButtonClicked, ->
          @button class: restart, kobind:  enable: haveActiveTask() && !restartPending(), click: restartButtonClicked, ->Restart

        @h1 -> "Test"
        @p ".subheader", ->
          @strong kobind: "text: resultStats().passed", -> "Passed"
          @strong kobind: "text: resultStats().failed", -> "Failed"

      @section ".wrapper", ->
        @div ".results", ->
            @p ".testStatus", kobind: "text: testStatus", ->
          @table ".testResults", kobind: "if: hasResults", ->
            @thead ->
              @tr ->
                @th ".result", -> "Result"
                @th ".name", -> "Test"

            @tbody kobind: "foreach: displayedResults", ->
              @tr ->
                @td ".result", kobind: "text: outcome, css: outcomeClass", ->
                @td ".name", kobind: "text: name", ->
