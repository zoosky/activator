define ->

  $breadcrumb = noir.Template ->
    @div "#breadcrumb", ->
      @a "[href=/]", -> "Documentation"
      @a "[href=/]", -> "LOL"
      @a "[href=/]", -> "FooBar"

  render: (scope)->
    $breadcrumb()
