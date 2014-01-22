define ["css!./page"], ->

  template (title, body)->
    @article ".page", ->
      @header ->
        @h1 -> title
      @include body