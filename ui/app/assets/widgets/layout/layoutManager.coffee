define ['commons/settings'], (settings)->

  # States
  panelShape     = settings.observable("layoutManager.panelShape"     , "right1")
  panelState     = settings.observable("layoutManager.panelState"     , true)
  navigationState = settings.observable("layoutManager.navigationState" , true)

  # Manual binding on <body>
  # -> Navigation
  noir.api.attributeBindings.class document.body, {'navigation-opened': navigationState}
  # -> Panels
  noir.api.attributeBindings.data document.body, {'shape': panelShape}
  noir.api.attributeBindings.class document.body, {'panel-opened': panelState}

  # Actions
  panelChange = (e)->
      panelShape.set e.target.className
      panelState.set true

  panelToggle = (e)->
    panelState.set !panelState.get()

  navigationToggle = (e)->
    navigationState.set !navigationState.get()

  openPanelOptions = (e)->
    e.preventDefault()
    e.stopPropagation()
    $("#layoutManager").toggleClass("opened")

  closePanelOptions = (e)->
    e.preventDefault()
    e.stopPropagation()
    $("#layoutManager").removeClass("opened")

  # Template
  $switches = noir.Template ->
    @button ".toggleNavigation", click: navigationToggle
    @dl "#layoutManager.dropdown", click: closePanelOptions, ->
      @dt click: panelToggle, ->
        @span ".all-options", click: openPanelOptions
      @dd click: panelChange, ->
        @button ".right1"
        # @button ".right2"
        @button ".bottom1"
        # @button ".bottom2"

  # Return
  render: (scope)->
    $switches()

  panelShape: panelShape
  panelState: panelState
