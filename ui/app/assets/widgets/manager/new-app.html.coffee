define ['commons/dom', 'widgets/file-selection/file-selection'], (dom, fselection)->

  template (templates)->

    showBrowser = ko.observable(false)
    filterValue = ko.observable("")
    filteredList = ko.observable(templates.list)
    filterValue.subscribe (value)->
      value = value.toLowerCase()
      filteredList templates.list.filter (o)->
        JSON.stringify(o).indexOf(value) >= 0

    chosen = ko.observable()

    clearSearch = (e)-> filterValue("")

    fillSearch = (e)-> filterValue(e.data.scope)

    search = (e)->
      filterValue(e.target.value)

    chooseTemplate = (e)->
      chosen(e.data.scope)

    closeTemplate = (e)->
      chosen(false)

    @section "#new", ->
      @div ".half", ->
        @header ->
          @h2 -> "New app"
        @aside "#filter", ->
          @span ".clear", click: clearSearch, -> "×"
          @input "[type=text][placeholder=Filter templates]", value: filterValue, event: {keyup: search}
        @article ->
          @ul ".list", forEach: filteredList, (template)->
            @li ".template", css: {featured: template.featured}, click: chooseTemplate, scope: template, ->
              @input "[type=radio][name=template]", value: template.id, ->
              @span -> template.title
              @ul ".tags", forEach: template.tags, (tag)->
                @li -> tag


      @only chosen, (template)->
        @div "#viewTemplate.half.right", ->

          @div ".template", ->
            @span ".clear", click: closeTemplate, -> "×"
            @h3 -> template.title
            @ul ".tags", forEach: template.tags, (tag)->
              @li click: fillSearch, scope: tag, -> tag
            @p -> template.description
            @div ".author", ->
              @cite ->
                @text "by John Doe ("
                @a template.author
                @text ")"
              @a ".source", -> "github.com/johndoe/activator-akka-spray"

          @form "#newApp[action=/home][method=GET]", ->
            @h4 -> "Create an app from this template"
            @input "#newAppTemplateName", attr: {type:"hidden", name:"template-name"}, value: "id"
            @input "#newappName", attr: {type:"hidden", name: "name"}, value: "name"
            @p ->
              @a "#browseAppLocation", toggle: showBrowser
              @input "#newappLocation", attr: {type:"text", name: "location"}, value: "baseFolder" + "name"
            @div ".select", ->
              @input "#newButton.button[type=submit][value=Create]"

        @div "#newAppLocationBrowser.subsection", visible: showBrowser, ->
          @header ->
            @span ".close", toggle: showBrowser, -> "×"
            @h2 -> "Choose a destination"
          @div ".list", ->
            @include fselection()


      @unless chosen, ->
        @div "#welcome.half.right", ->
          @h3 -> "Create a new app"
          @p -> "Build apps in a snap! Typesafe Activator is a local-running web application. Create new apps from templates. Browse & edit code. Run apps and tests. Community created templates & plugins are coming soon!"
          @ol ".steps", ->
            @li -> "Choose a template"
            @li -> "Give it a name and location"
            @li -> "Hack!"
          @h4 -> "Find some inspiration..."
          @ul ".inspiration.tags", forEach: templates.tags, (tag)->
            @li click: fillSearch, scope: tag, -> tag


