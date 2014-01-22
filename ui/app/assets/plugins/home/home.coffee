define [
  'commons/tpl-helpers',
  'commons/dom',
  'services/sbt',
  'services/templates',
  'widgets/manager/open-app',
  'widgets/manager/new-app',
  'widgets/manager/logs',
  "css!./home"
  ], (helpers, dom, sbtService, templatesService, open, newapp, logging)->


  $home = template (logs, recentApps, templates)->
    @h1 -> "Activator"
    @include open.render(recentApps)
    @include newapp(templates)
    @include logging.render(logs)

  render: (scope)->

    logs = [1,2,3]

    recentApps = templatesService.recentApps()

    templates =
      list: templatesService.getAll()
      tags: templatesService.getTags()

    scope.appendChild $home(logs, recentApps, templates)
