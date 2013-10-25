define ['./settings'], (Settings) ->

  class Atom

      id: undefined
      moduleName: ""
      moduleState: {}
      moduleStateDefault: {}
      # Placeholder for callback from connection
      updateConnection: null
      # Shared module state between all modules of the same kind but with different ids, for example actors
      moduleStateShared: true

      constructor: (@parameters) ->
      	throw "Atoms must implement the constructor method"

      render: ->
      	throw "Atoms must implement the render method"

      update: ->

      getStateLabel: ->
        label = "console." + serverAppVersion + ".modulestate"
        label += ('.' + @moduleName) if @moduleName
        label += ('.' + @id) if not @moduleStateShared and @id
        label

      saveState: ->
        Settings.set @getStateLabel(), @moduleState
        @

      loadState: ->
        @moduleState = Settings.get @getStateLabel(), @moduleStateDefault
        @

      getConnectionParameters: () ->
        {
          name: @moduleName
          scope: {}
        }

  Atom
