define ['widgets/layout/layout','widgets/header/header','widgets/navigation/navigation','widgets/pannels/pannels'], (layout, header, navigation, pannels)->

  $main = noir.Template ->
    @include header.render()
    @include navigation.render()
    @include layout.render()
    @include pannels.render()

  render: (scope)->
    $("body").append $main()
