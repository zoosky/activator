define ['widgets/buttons/dropdown'], (dropdown)->

  $switch = noir.Template ->
    @dl "#user.dropdown", ->
      @dt()
      @dd ->
        @p -> "Notification"
        @p -> "Notification"
        @p -> "Notification"

  render: (scope)->
    $switch()
