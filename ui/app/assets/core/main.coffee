require.config
  baseUrl: "/assets"

@noop = ->

deps = ['core/router', 'core/services', 'core/view', 'core/keyboard']
libs = ['commons/tpl-helpers']

require [].concat(deps, libs), (router, services, view, keyboard)->
  $ ->
    view.render $("#wrapper")

