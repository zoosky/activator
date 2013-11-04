define ->

  $typesafe = noir.Template ->
    @div "#typesafe", ->
      @a ".website", attr: href: "http://typesafe.com", ->
        @img attr: src: "/assets/images/typesafe.svg"
      @a ".infos[href=/]", -> "i"

  render: (scope)->
    $typesafe()
