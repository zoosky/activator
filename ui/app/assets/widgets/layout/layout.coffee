define ->

  $main = noir.Template ->
    @main "#wrapper"

  render: (scope)->
    $main()
