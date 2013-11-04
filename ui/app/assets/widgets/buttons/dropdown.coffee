define ->

  (el)->
    el.addClass('dropdown').click ->
      $(this).toggleClass "opened"
