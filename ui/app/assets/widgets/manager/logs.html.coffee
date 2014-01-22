define ->

  render: template (logs)->
    section "#working", ->
      header ->
        h2 -> "Your application is being opened"
      article ->
        p -> "This will just take a minute..."
        ul "#logs", forEach: "logs", as: "log", ->
          li html: "log"
