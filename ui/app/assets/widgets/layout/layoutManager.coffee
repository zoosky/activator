define ['commons/settings'], (settings)->

  # States
  pannelShape     = settings.observable("layoutManager.pannelShape"     , "right1")
  pannelState     = settings.observable("layoutManager.pannelState"     , true)
  navigationState = settings.observable("layoutManager.navigationState" , true)

  # Manual binding on <body>
  # -> Navigation
  noir.api.attributeBindings.class document.body, {'navigation-opened': navigationState}
  # -> Pannels
  noir.api.attributeBindings.data document.body, {'shape': pannelShape}
  noir.api.attributeBindings.class document.body, {'pannel-opened': pannelState}

  # Actions
  pannelChange = (e)->
      pannelShape.set e.target.className
      pannelState.set true

  pannelToggle = (e)->
    pannelState.set !pannelState.get()

  navigationToggle = (e)->
    navigationState.set !navigationState.get()

  openPannelOptions = (e)->
    e.preventDefault()
    e.stopPropagation()
    $("#layoutManager").toggleClass("opened")

  closePannelOptions = (e)->
    e.preventDefault()
    e.stopPropagation()
    $("#layoutManager").removeClass("opened")

  # Template
  $switches = noir.Template ->
    @button ".toggleNavigation", click: navigationToggle
    @dl "#layoutManager.dropdown", click: closePannelOptions, ->
      @dt click: pannelToggle, ->
        @span ".all-options", click: openPannelOptions
      @dd click: pannelChange, ->
        @button ".right1"
        # @button ".right2"
        @button ".bottom1"
        # @button ".bottom2"

  # Return
  render: (scope)->
    $switches()

  pannelShape: pannelShape
  pannelState: pannelState
