define ["services/fs", "css!./file-selection"], (fs)->

  render: template ()->

    list = ko.observable([])
    path = ko.observable("/")

    path.doChange (p)->
      fs.directory(p, list)
        .done (data)->
          list data
        .fail ->
          alert("Could't fetch "+ p)

    browseThis = (e)->
      path e.data.scope

    browseParent = (e)->
      parent = "/" + path().split("/").slice(1,-1).join("/")
      path parent

    div ".current", click: "browseParent", html: "'browsing: '+path"
    ul ".fs", forEach: "list", as: "file", ->
      template.virtual "if file.isDirectory", ->
        li ".directory", click: "browseThis", html: "file.name"
      template.virtual "else", ->
        li ".disabled", html: "file.name"
