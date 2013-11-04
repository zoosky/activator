# Local storage helper for UI settings
define ->

  set: (label, value) ->
    window.localStorage.setItem(label, JSON.stringify(value))

  get: (label, def) ->
    if window.localStorage.getItem(label)? then JSON.parse(window.localStorage.getItem(label)) else def

  reset: (label) ->
    window.localStorage.removeItem(label)
