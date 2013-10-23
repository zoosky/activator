#
# Copyright (C) 2013 Typesafe, Inc <http://typesafe.com>
# 
define ->

  # Decomposed url in an array
  
  # New router API:
  #  Route format:
  # {
  #    'foo':    [ action, {
  #                   'bar': [ action ]
  #                   ':id': [ action ]
  #               }]
  #    'baz':  action,
  #    'crazy': {
  #      action: function(urlInfo) {},
  #      next: {
  #        ':id': function() {}
  #      },
  #      context: this
  #    }
  # }
  #
  #  Where action =
  #  a function that takes in these arguments:
  #  - urlInfo {
  #      name: 'bar',            // The current portion of the url
  #      full: ['foo', 'bar'],  // The decomposed breadcrumbs of the full url currently used.
  #      rest: [],              // An array of remaining url pieces.
  #      before: 'foo',         // The url string before this one (for back functionality).
  #      path: '',              // The full url path to this breadcrumb.
  #    }
  #
  #  For any given URL that's hit, all the actions found leading down the tree are
  #  executed.
  
  # The set of routes we can use.
  
  # This is our default errorRoute.  Right now it just logs an error and displays an alert.
  
  # Create the 'rich' classes for breadcrumbs that are passed to router action handlers.
  # bcs - an array of url pieces
  # returns:
  #      an array of "Rich" URL pieces witht he following info:
  # {
  #   name -  The full text of this url piece.  So for the url /foo/bar/baz/bish, this represents on of foo, bar, baz or bish.
  #   full -  All the url pieces being routed.  So for the url /foo/bar/baz/bish, this would be ['foo', 'bar', 'baz', 'bish'].
  #   rest -  The url pieces after the current url piece. So for the url /foo/bar/baz/bish, when on the "baz" piece, this would be ['bish']
  #   before - The url path before the current piece.  So, for the url /foo/bar/baz/bish, when on the "baz" piece, this would be /foo/bar
  #   path  - The path to this url piece, so for url /foo/bar/baz/bish, this would be /foo/bar/baz when on the "baz" piece.
  # }
  createArgs = (bcs) ->
    $.map bcs, (bc, idx) ->
      
      # Check to see if this guy is new to the URL and needs executed:
      name: bc
      full: bcs
      rest: bcs.slice(idx + 1)
      before: bcs.slice(0, idx).join("/")
      path: bcs.slice(0, idx + 1).join("/")

  
  # This functions pickes the next route name to grab.
  # Keeps track of precednece of direct names vs. matching urls, like ":id" or ":all".
  pickRouteName = (urlPart, routes) ->
    name = urlPart.name
    return name  if routes.hasOwnProperty(name)
    return ":id"  if routes.hasOwnProperty(":id")
    ":all"
  breadcrumbs = []
  routes = {}
  errorRoute = action: (args) ->
    console.log "Failed to find router for ", args
    alert "This is not a valid link: #" + args.path

  
  # Executes the routing functions we need, based on the parsed url parts.
  executeRoutes = (routes, urlParts) ->
    if urlParts.length > 0
      current = urlParts[0]
      routeProp = pickRouteName(current, routes)
      route = routes[current.name] or errorRoute
      
      # Here - we unify all our data into the same format...
      # First, if it's a raw object, promote into route object.
      if typeof (route) is "function"
        routes[current.name] = action: route
        route = routes[current.name]
      
      # Here, if we have an array we unify into a route object.
      if route.hasOwnProperty("length")
        routes[current.name] =
          action: route[0]
          next: route[1]

        route = routes[current.name]
      route.action.call route.context or route, current
      
      # See if we need to continue
      executeRoutes route.next, urlParts.slice(1)  if route.next

  
  # Parse a new # url and execute the actions associated with the route.
  # Note:  the url parameter is optional. If none is passed, this will pull the current window.location.hash.
  parse = (url) ->
    
    # If no arguments, take the hash
    url = url or window.location.hash
    
    # Split full path in modules
    bcs = (if url then /^#?\/?(.+)\/?$/.exec(url)[1].split("/") else ["home"])
    
    # Make arguments to churn through routers...
    args = createArgs(bcs)
    
    # TODO - Check if we're empty and add a link to the 'home' widget action?
    # Check if modules are loaded, or retrieve module object
    executeRoutes routes, args
    
    # Update the breadcrumbs so we remember what happened.
    breadcrumbs = bcs

  
  # Registers our initialization so that we drive the application from the hash.
  init: ->
    
    # Register for future changes, and also parse immediately.
    $(window).on "hashchange", ->
      parse window.location.hash

    parse window.location.hash

  
  # Register a plugin's routes.
  # TODO - do this recursive and *merge* routes.
  registerRoutes: (newRoutes) ->
    for route of newRoutes
      routes[route] = newRoutes[route]  if newRoutes.hasOwnProperty(route)
