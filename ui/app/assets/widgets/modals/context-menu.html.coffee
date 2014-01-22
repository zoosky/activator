define ->

  template (menu)->
    @ul ".context-menu", exec: position, ->
      @li -> "Delete file"
      @li -> "Rename file"
