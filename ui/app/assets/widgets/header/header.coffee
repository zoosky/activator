define ['widgets/omnisearch/omnisearch', 'widgets/breadcrumb/breadcrumb', 'widgets/layout/layoutManager', './user', './notifications'], (omnisearch, breadcrumb, layoutManager, user, notifications)->

  $header = noir.Template ->
    @header "#header", ->
      @include layoutManager.render()
      @include omnisearch.render()
      @include breadcrumb.render()

      @include user.render()
      @include notifications.render()

  render: (scope)->
    $header()