define ->

  $brwoser = noir.Template ->
    @comment "ko if: isFile()"
    @header ->
      @nav ->
          @button ".delete", kobind: "click: deleteFile", -> "delete"
        @button ".revert", kobind: "click: subView().load, enable: subView().isDirty", -> "revert"
        @button ".save", kobind: "click: subView().save, enable: subView().isDirty", -> "save"
      @h1 kobind: "text: title", ->
      @p ".subheader", kobind: "text: fileStats", ->
    @div ".wrapper", kobind: "snapView: subView()", ->
    @comment "/ko"