# ###
# CONSOLE
# ###

_.Module = template (extraClass, title, body, footer)->
  @article extraClass, ->
    @header ->
      @h1 ->
        @span ".title", -> title
    if footer?
      @include footer
    if body?
      @section ".wrapper", body

_.DetailsModule = template (extraClass, title, body, footer)->
  @include _.Module ".details" + extraClass, title, body, footer

_.Details = template (extraClass, title, metricsList)->
  body = ->
    @div ".metricBoxes"
  footer = ->
    @footer ".filters", ()->
      @include _.FilterGroupedSelect ".addMetric", "Add New Metric:", metricsList

  @include _.DetailsModule extraClass, title, body, footer

_.ListModule = template (extraClass, title, body, footer)->
  @include _.Module ".list" + extraClass, title, body, footer

_.ListModuleItem = template (extraClass, title, link, count)->
  @li ".details" + extraClass, ->
    @h2 ->
      @a href: link, ->
        @text title
        @span ".counter", -> count

_.Menu = template (extraClass, title, list)->
  @include _.ListModule ".menu" + extraClass, title, ->
    @ul ".listing", forEach: list, (item, id)->
      # { id: {title: "Title", url: "#/url/"}}
      @li class: {id: true}, ->
        @h2 ->
          @a href: item.url, ->
            @span ".label", -> item.title
            @span ".counter"

_.FilterGroupedSelect = template (extraClass, title, groups)->
  # Params:
  # [{ "First Group": [ option: "Option Name 1" ] },
  # { "Second Group": [ option: "Option Name 1" ] }]
  @p ".select" + extraClass, ->
    @select ->
      @option -> title
      for group, list of groups
        @optgroup attr: {label: group}, forEach: list, (value, name)->
          @option value: value, -> value

_.FilterSelect = template (extraClass, title, options)->
  @p ".select" + extraClass, ->
    @select forEach: list, (value, name)->
      @option value: value, -> name

_.FilterInput = template (extraClass)->
  @p ".input" + extraClass, ->
    @input "[type=text][placeholder=*]"
    @span ".clear"


# ###
# CONSOLE
# ###

_.AkkaMenu = template (list)->
  @include _.Menu ".akka", "Akka", list

_.AkkaDetails = template (metricsList)->
  @include _.Details ".akka", "Akka", metricsList

# Assert "Render AkkaMenu", (expect, $scope)->
#   list = 
#     first:
#       title: "First menu item"
#       url: "#/url/1"
#     second:
#       title: "Second menu item"
#       url: "#/url/2"
#     third:
#       title: "Third menu item"
#       url: "#/url/3"
#   $(AkkaMenu(list)).appendTo($scope)
#   # console.log "AkkaMenu", $scope.html()
#   expect("""<article class="list menu akka"><header><h1><span class="title">Akka</span></h1></header><section class="wrapper"><ul class="listing"><li class="id"><h2><a href="#/url/1"><span class="label">First menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/2"><span class="label">Second menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/3"><span class="label">Third menu item</span><span class="counter"></span></a></h2></li></ul></section></article>""")

# Assert "Render AkkaDetails", (expect, $scope)->
#   options =
#     "First Group":
#       option1: "Option Name 1"
#       option2: "Option Name 1b"
#     "Second Group":
#       option3: "Option Name 2"
#   $(AkkaDetails(options)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="details akka"><header><h1><span class="title">Akka</span></h1></header><footer class="filters"><p class="select addMetric"><select><option>Add New Metric:</option><optgroup label="First Group"><option value="Option Name 1">Option Name 1</option><option value="Option Name 1b">Option Name 1b</option></optgroup><optgroup label="Second Group"><option value="Option Name 2">Option Name 2</option></optgroup></select></p></footer><section class="wrapper"><div class="metricBoxes"></div></section></article>""")



_.ActorMenu = template (list)->
  @include _.Menu ".actor", "Actor", list

_.ActorList = template (list)->
  @include _.ListModule ".actor", "Actors list", ->
    @div ".chartBox", ->
      @h4 ".title", -> "Throughput chart"
      @div ".chartContainer", ->
    @ul ".listing", forEach: list, (o)->
      @include ListModuleItem, ".actor", o.name, o.url, o.count

_.ActorDetails = template (metricsList)->
  @include _.Details ".actor", "Actor details", metricsList

# Assert "Render ActorMenu", (expect, $scope)->
#   list = 
#     first:
#       title: "First menu item"
#       url: "#/url/1"
#     second:
#       title: "Second menu item"
#       url: "#/url/2"
#     third:
#       title: "Third menu item"
#       url: "#/url/3"
#   $(ActorMenu(list)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="list menu actor"><header><h1><span class="title">Actor</span></h1></header><section class="wrapper"><ul class="listing"><li class="id"><h2><a href="#/url/1"><span class="label">First menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/2"><span class="label">Second menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/3"><span class="label">Third menu item</span><span class="counter"></span></a></h2></li></ul></section></article>""")

# Assert "Render ActorList", (expect, $scope)->
#   list = ko.observable
#     first:
#       name: "First menu item"
#       url: "#/url/1"
#       count: 1
#     second:
#       name: "Second menu item"
#       url: "#/url/2"
#       count: 8
#     third:
#       name: "Third menu item"
#       url: "#/url/3"
#       count: 3
#   $(ActorList(list)).appendTo($scope)
#   # console.log "???", $scope.html()
#   expect("""<article class="list actor"><header><h1><span class="title">Actors list</span></h1></header><section class="wrapper"><div class="chartBox"><h4 class="title">Throughput chart</h4><div class="chartContainer"></div></div><ul class="listing"><li class="details actor"><h2><a href="#/url/1">First menu item<span class="counter">1</span></a></h2></li><li class="details actor"><h2><a href="#/url/2">Second menu item<span class="counter">8</span></a></h2></li><li class="details actor"><h2><a href="#/url/3">Third menu item<span class="counter">3</span></a></h2></li></ul></section></article>""")
#   setTimeout ()->
#     list.set
#       first:
#         name: "First menu item"
#         url: "#/url/1"
#         count: 22
#       second:
#         name: "Second menu item"
#         url: "#/url/2"
#         count: 8
#       fourth:
#         name: "Third menu item"
#         url: "#/url/4"
#         count: 2
#     # console.log $scope.html()
#     expect("""<article class="list actor"><header><h1><span class="title">Actors list</span></h1></header><section class="wrapper"><div class="chartBox"><h4 class="title">Throughput chart</h4><div class="chartContainer"></div></div><ul class="listing"><li class="details actor"><h2><a href="#/url/1">First menu item<span class="counter">22</span></a></h2></li><li class="details actor"><h2><a href="#/url/2">Second menu item<span class="counter">8</span></a></h2></li><li class="details actor"><h2><a href="#/url/4">Third menu item<span class="counter">2</span></a></h2></li></ul></section></article>""")
#   , 200

# Assert "Render ActorDetails", (expect, $scope)->
#   options =
#     "First Group":
#       option1: "Option Name 1"
#       option2: "Option Name 1b"
#     "Second Group":
#       option3: "Option Name 2"
#   $(ActorDetails(options)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="details actor"><header><h1><span class="title">Actor details</span></h1></header><footer class="filters"><p class="select addMetric"><select><option>Add New Metric:</option><optgroup label="First Group"><option value="Option Name 1">Option Name 1</option><option value="Option Name 1b">Option Name 1b</option></optgroup><optgroup label="Second Group"><option value="Option Name 2">Option Name 2</option></optgroup></select></p></footer><section class="wrapper"><div class="metricBoxes"></div></section></article>""")



_.ActorSystemsMenu = template (list)->
  @include _.Menu ".actorSystems", "Actor Systems", list

_.ActorSystemsDetails = template (metricsList)->
  @include _.Details ".actorSystems", "Actor system details", metricsList

# Assert "Render ActorSystemsMenu", (expect, $scope)->
#   list = 
#     first:
#       title: "First menu item"
#       url: "#/url/1"
#     second:
#       title: "Second menu item"
#       url: "#/url/2"
#     third:
#       title: "Third menu item"
#       url: "#/url/3"
#   $(ActorSystemsMenu(list)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="list menu actorSystems"><header><h1><span class="title">Actor Systems</span></h1></header><section class="wrapper"><ul class="listing"><li class="id"><h2><a href="#/url/1"><span class="label">First menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/2"><span class="label">Second menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/3"><span class="label">Third menu item</span><span class="counter"></span></a></h2></li></ul></section></article>""")

# Assert "Render ActorSystemsDetails", (expect, $scope)->
#   options =
#     "First Group":
#       option1: "Option Name 1"
#       option2: "Option Name 1b"
#     "Second Group":
#       option3: "Option Name 2"
#   $(ActorSystemsDetails(options)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="details actorSystems"><header><h1><span class="title">Actor system details</span></h1></header><footer class="filters"><p class="select addMetric"><select><option>Add New Metric:</option><optgroup label="First Group"><option value="Option Name 1">Option Name 1</option><option value="Option Name 1b">Option Name 1b</option></optgroup><optgroup label="Second Group"><option value="Option Name 2">Option Name 2</option></optgroup></select></p></footer><section class="wrapper"><div class="metricBoxes"></div></section></article>""")


_.NodeMenu = template (list)->
  @include _.Menu ".node", "Node", list

_.NodeList = template (list)->
  @include _.ListModule ".node", "Node", ->
    @ul ".listing.nodes.compact", forEach: list, (o)->
       @include ListModuleItem, ".actor", o.name, o.url, o.count

_.NodeDetails = template (metricsList)->
  @include _.Details ".node", "Node details", metricsList

# Assert "Render NodeMenu", (expect, $scope)->
#   list = 
#     first:
#       title: "First menu item"
#       url: "#/url/1"
#     second:
#       title: "Second menu item"
#       url: "#/url/2"
#     third:
#       title: "Third menu item"
#       url: "#/url/3"
#   $(NodeMenu(list)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="list menu node"><header><h1><span class="title">Node</span></h1></header><section class="wrapper"><ul class="listing"><li class="id"><h2><a href="#/url/1"><span class="label">First menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/2"><span class="label">Second menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/3"><span class="label">Third menu item</span><span class="counter"></span></a></h2></li></ul></section></article>""")

# Assert "Render NodeList", (expect, $scope)->
#   list = ko.observable
#     first:
#       name: "First menu item"
#       url: "#/url/1"
#       count: 1
#     second:
#       name: "Second menu item"
#       url: "#/url/2"
#       count: 8
#     third:
#       name: "Third menu item"
#       url: "#/url/3"
#       count: 3
#   $(NodeList(list)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="list node"><header><h1><span class="title">Node</span></h1></header><section class="wrapper"><ul class="listing nodes compact"><li class="details actor"><h2><a href="#/url/1">First menu item<span class="counter">1</span></a></h2></li><li class="details actor"><h2><a href="#/url/2">Second menu item<span class="counter">8</span></a></h2></li><li class="details actor"><h2><a href="#/url/3">Third menu item<span class="counter">3</span></a></h2></li></ul></section></article>""")

# Assert "Render NodeDetails", (expect, $scope)->
#   options =
#     "First Group":
#       option1: "Option Name 1"
#       option2: "Option Name 1b"
#     "Second Group":
#       option3: "Option Name 2"
#   $(NodeDetails(options)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="details node"><header><h1><span class="title">Node details</span></h1></header><footer class="filters"><p class="select addMetric"><select><option>Add New Metric:</option><optgroup label="First Group"><option value="Option Name 1">Option Name 1</option><option value="Option Name 1b">Option Name 1b</option></optgroup><optgroup label="Second Group"><option value="Option Name 2">Option Name 2</option></optgroup></select></p></footer><section class="wrapper"><div class="metricBoxes"></div></section></article>""")



_.DispatcherMenu = template (list)->
  @include _.Menu ".dispatcher", "Dispatcher", list

_.DispatcherDetails = template (metricsList)->
  @include _.Details ".dispatcher", "Dispatcher details", metricsList

# Assert "Render DispatcherMenu", (expect, $scope)->
#   list = 
#     first:
#       title: "First menu item"
#       url: "#/url/1"
#     second:
#       title: "Second menu item"
#       url: "#/url/2"
#     third:
#       title: "Third menu item"
#       url: "#/url/3"
#   $(DispatcherMenu(list)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="list menu dispatcher"><header><h1><span class="title">Dispatcher</span></h1></header><section class="wrapper"><ul class="listing"><li class="id"><h2><a href="#/url/1"><span class="label">First menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/2"><span class="label">Second menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/3"><span class="label">Third menu item</span><span class="counter"></span></a></h2></li></ul></section></article>""")

# Assert "Render DispatcherDetails", (expect, $scope)->
#   options =
#     "First Group":
#       option1: "Option Name 1"
#       option2: "Option Name 1b"
#     "Second Group":
#       option3: "Option Name 2"
#   $(DispatcherDetails(options)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="details dispatcher"><header><h1><span class="title">Dispatcher details</span></h1></header><footer class="filters"><p class="select addMetric"><select><option>Add New Metric:</option><optgroup label="First Group"><option value="Option Name 1">Option Name 1</option><option value="Option Name 1b">Option Name 1b</option></optgroup><optgroup label="Second Group"><option value="Option Name 2">Option Name 2</option></optgroup></select></p></footer><section class="wrapper"><div class="metricBoxes"></div></section></article>""")



# _.TagsList = template (list)->
#   @include _.ListModule ".tags", "Tags", ->
#     @ul ".listing", forEach: list, (o)->
#       @include ListModuleItem, ".tags", o.name, o.url, o.count

# _.TagsDetails = template (metricsList)->
#   @include _.Details ".tags", "Tags details", metricsList

# Assert "Render TagsList", (expect, $scope)->
#   list = ko.observable
#     first:
#       name: "First menu item"
#       url: "#/url/1"
#       count: 1
#     second:
#       name: "Second menu item"
#       url: "#/url/2"
#       count: 8
#     third:
#       name: "Third menu item"
#       url: "#/url/3"
#       count: 3
#   $(TagsList(list)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="list tags"><header><h1><span class="title">Tags</span></h1></header><section class="wrapper"><ul class="listing"><li class="details tags"><h2><a href="#/url/1">First menu item<span class="counter">1</span></a></h2></li><li class="details tags"><h2><a href="#/url/2">Second menu item<span class="counter">8</span></a></h2></li><li class="details tags"><h2><a href="#/url/3">Third menu item<span class="counter">3</span></a></h2></li></ul></section></article>""")

# Assert "Render TagsDetails", (expect, $scope)->
#   options =
#     "First Group":
#       option1: "Option Name 1"
#       option2: "Option Name 1b"
#     "Second Group":
#       option3: "Option Name 2"
#   $(TagsDetails(options)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="details tags"><header><h1><span class="title">Tags details</span></h1></header><footer class="filters"><p class="select addMetric"><select><option>Add New Metric:</option><optgroup label="First Group"><option value="Option Name 1">Option Name 1</option><option value="Option Name 1b">Option Name 1b</option></optgroup><optgroup label="Second Group"><option value="Option Name 2">Option Name 2</option></optgroup></select></p></footer><section class="wrapper"><div class="metricBoxes"></div></section></article>""")



# _.PlayMenu = template (list)->
#   @include _.Menu ".play", "Play", list

# _.PlayDetails = template (metricsList)->
#   @include _.Details ".play", "Play details", metricsList

# Assert "Render PlayMenu", (expect, $scope)->
#   list = 
#     first:
#       title: "First menu item"
#       url: "#/url/1"
#     second:
#       title: "Second menu item"
#       url: "#/url/2"
#     third:
#       title: "Third menu item"
#       url: "#/url/3"
#   $(PlayMenu(list)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="list menu play"><header><h1><span class="title">Play</span></h1></header><section class="wrapper"><ul class="listing"><li class="id"><h2><a href="#/url/1"><span class="label">First menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/2"><span class="label">Second menu item</span><span class="counter"></span></a></h2></li><li class="id"><h2><a href="#/url/3"><span class="label">Third menu item</span><span class="counter"></span></a></h2></li></ul></section></article>""")

# Assert "Render PlayDetails", (expect, $scope)->
#   options =
#     "First Group":
#       option1: "Option Name 1"
#       option2: "Option Name 1b"
#     "Second Group":
#       option3: "Option Name 2"
#   $(PlayDetails(options)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="details play"><header><h1><span class="title">Play details</span></h1></header><footer class="filters"><p class="select addMetric"><select><option>Add New Metric:</option><optgroup label="First Group"><option value="Option Name 1">Option Name 1</option><option value="Option Name 1b">Option Name 1b</option></optgroup><optgroup label="Second Group"><option value="Option Name 2">Option Name 2</option></optgroup></select></p></footer><section class="wrapper"><div class="metricBoxes"></div></section></article>""")



# _.PlayRequestsList = template (list, sorting)->
#   @include _.ListModule ".requests", "Play Requests", ->
#     @ul ".listing", forEach: list, (o)->
#        @include ListModuleItem, ".actor", o.name, o.url, o.count

# _.PlayRequestView = template (metricsList)->
#   @include _.Details ".request", "Play request view", metricsList

# Assert "Render PlayRequestsList", (expect, $scope)->
#   list = ko.observable
#     first:
#       name: "First menu item"
#       url: "#/url/1"
#       count: 1
#     second:
#       name: "Second menu item"
#       url: "#/url/2"
#       count: 8
#     third:
#       name: "Third menu item"
#       url: "#/url/3"
#       count: 3
#   $(PlayRequestsList(list)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="list requests"><header><h1><span class="title">Play Requests</span></h1></header><section class="wrapper"><ul class="listing"><li class="details actor"><h2><a href="#/url/1">First menu item<span class="counter">1</span></a></h2></li><li class="details actor"><h2><a href="#/url/2">Second menu item<span class="counter">8</span></a></h2></li><li class="details actor"><h2><a href="#/url/3">Third menu item<span class="counter">3</span></a></h2></li></ul></section></article>""")

# Assert "Render PlayRequestView", (expect, $scope)->
#   options =
#     "First Group":
#       option1: "Option Name 1"
#       option2: "Option Name 1b"
#     "Second Group":
#       option3: "Option Name 2"
#   $(PlayRequestView(options)).appendTo($scope)
#   # console.log $scope.html()
#   expect("""<article class="details request"><header><h1><span class="title">Play request view</span></h1></header><footer class="filters"><p class="select addMetric"><select><option>Add New Metric:</option><optgroup label="First Group"><option value="Option Name 1">Option Name 1</option><option value="Option Name 1b">Option Name 1b</option></optgroup><optgroup label="Second Group"><option value="Option Name 2">Option Name 2</option></optgroup></select></p></footer><section class="wrapper"><div class="metricBoxes"></div></section></article>""")



