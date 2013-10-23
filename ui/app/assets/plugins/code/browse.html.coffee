define ->

  $brwoser = noir.Template ->
    @header ->
      @nav ->
        @dl ".dropdown", ->
          @dt -> "+"
          @dd ->
            @a kobind: "click: newFile", -> "New file"
            @a kobind: "click: newFolder", -> "New folder"

        @dl ".dropdown", ->
          @dt -> "Open"
          @dd ->
            @a kobind: "click: openInIdea", -> "Open project in IntelliJ IDEA"
            @a kobind: "click: openInEclipse", -> "Open project in Eclipse"
            @a kobind: "click: openProjectInFileBrowser", -> "Open project in File Browser"

      @h1 ->
        @a href: "#", kobind: "click: openInFileBrowser, text: rootAppPath, attr: { title: rootAppPath }", ->
      @div ".breadcrumb.subheader", ->
        @a ".home", href: "#code/", -> "⌂"
        @p ".wrap", kobind: "foreach: parts", ->
          @span ".slash", -> "/"
          @a href: "#", kobind: "text: name, attr: { href: url }", ->

    @p css: {display: "none"}, kobind: "visible: isEmpty", -> "Empty folder"

    @ul ".list.directory", kobind: "foreach: files", ->
      @li ".file", kobind: "css: {folder: isDirectory, file: !isDirectory()}", ->
        @h2 ->
          @a kobind: "visible: !editing(), text: name, event: { contextmenu: onContextMenu, click: onSingleClick, dblclick: onDoubleClick }, attr: {href: '#'+url()}" , ->
          @input kobind: "visible: editing, value: editingText, event: { keyup: onKeyUp, blur: onBlur }, css: editClass" , ->
