define ->

    noir.api.addAttributeBinding "onenter", (element, callback)->
      element.onkeyup = (e)->
        if e.keyCode == 13 && element.value
          callback(element.value)
          element.value = ""

    noir.api.addAttributeBinding "dropdown", (element, callback)->
      $(element)
        .addClass("dropdown")
        .click ->
          $(this).toggleClass("opened")
        .on "click", "a", (e)->
          e.preventDefault()
          callback e
          $(element).toggleClass("opened")
          false