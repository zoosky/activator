define ->

  $omnisearch = noir.Template ->
    @form "#omnisearch", ->
      @input "[type=text][name=keywords][placeholder=Type keywords or a command]"

  render: (scope)->
    $omnisearch()