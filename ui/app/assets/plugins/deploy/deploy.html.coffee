define [
  "widgets/layout/layout.html",
  "widgets/boxes/intro.html",
  "widgets/modules/page.html",
  "widgets/navigation/menu.html",
  "css!./deploy"
], (
  $layout,
  $intro,
  $page,
  $menu
)->

  template (provider)->
    @unless provider, ->
      $layout.oneColumn ".deploy", ->
        @include $intro ->
          @div ".description", ->
            @h1 -> "Choose a deployment option"
            @p -> "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae lorem at neque mollis viverra eu eu tortor. Vivamus at viverra risus. Quisque scelerisque felis purus, a tempor elit vulputate tempor. Sed pharetra condimentum elementum."
            @h3 -> "Local build"
            @ul ->
              @li ".local", -> "Publish local"
              @li ".zip", -> "Publish a ZIP"
            @h3 -> "Cloud providers"
            @ul ->
              @li ".cloudBees", -> "CloudBees"
              @li ".heroku", -> "Heroku"
              @li ".googleGCE", -> "Google GCE"
              @li ".amazon", -> "Amazon"
              @li ".cleverCloud", -> "Clever Cloud"

    @only provider, (p)->
      $layout.oneColumnAndMenu ".deploy", ->

        @include $menu "Tutorial", ->
          @ul ->
            @li -> #exec: isActive("tutorial/" + id), ->
              @a href: "#deploy/", -> "Heroku"  # + id, -> provider

        @include $intro ->
          @div ".description", ->
            @h1 -> "Deploy your app"
            @p -> "Lorem"

        @include $page p.title, ->
          @section ".typo", html: p.page

