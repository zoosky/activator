# Local storage helper for UI settings
define ->

  class Settings

    constructor: ->

    set: (label, value) ->
      window.localStorage.setItem(label, JSON.stringify(value))
      @

    get: (label, def) ->
      JSON.parse(window.localStorage.getItem(label)) || def

    reset: (label) ->
      window.localStorage.removeItem(label)
      @

  new Settings()
