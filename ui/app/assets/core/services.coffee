define ->

  ###
  plugin = 
    controller: "plugins/plugin/main"
    search: "plugins/plugin/search"
    pannels: [
      [ "Title", "plugins/plugin/pannel" ]
    ]
    cards: [
      [ "title", "plugins/plugin/card" ]
    ]

  # Apis:
  controller: ["plugins/plugin/main"]
    # start deamons...
    route: (url, dom)->
    link: (dom)->
    kill: ->

  search: ["plugins/plugin/search"]
    search: (keywords, promise)->
    kill: ->

  pannels: ["plugins/plugin/pannel"]
    render: (dom)->
    kill: ->

  cards: ["plugins/plugin/card"]
    render: (dom)->
    kill: ->
  ###

  services = []

  load = (promise, list)->
    loaded = []
    notify = (service)-> 
      loaded.push service
      if loaded.length == list.length
        promise(loaded)
    for service in list
      require service, notify

  register: (service)->
    services.push service

  routes: (route)->
    load(promise, services.filter((_)-> _.controller).map((_)-> _.controller))

  search: (keyword, promise)->
    load(promise, services.filter((_)-> _.search).map((_)-> _.search))

  pannels: (promise)->
    load(promise, services.filter((_)-> _.pannels?.length).map((_)-> _.pannels))

  cards: (promise)->
    load(promise, services.filter((_)-> _.cards?.length).map((_)-> _.cards))

  services: services


