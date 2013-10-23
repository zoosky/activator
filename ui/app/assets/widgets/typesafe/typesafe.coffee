define ->

  $typesafe = noir.Template ->
    @div "#typesafe", ->
      @a ".website", attr: href: "http://typesafe.com", ->
        @img attr: src: "/public/images/typesafe.svg"
      @a ".infos[href=/]", -> "i"

  render: (scope)->
    $typesafe()
