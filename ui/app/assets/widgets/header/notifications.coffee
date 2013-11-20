define ['widgets/buttons/dropdown'], (dropdown)->

  $switch = noir.Template ->
    @dl "#notifications.dropdown", ->
      @dt ->
        @span -> "0"
      @dd ->
        @a href: "/", -> "Notification"
        @a href: "/", -> "Notification"
        @a href: "/", -> "Notification"

  render: (scope)->
    $switch()
