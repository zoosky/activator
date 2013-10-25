window.uuid = ((i) -> (-> ++i))(0)

window.animationEnd = "webkitAnimationEnd oanimationend msAnimationEnd animationend"

$.fn.getOrElse = (selector, ctx) ->
  if this.length then $(this) else $(selector, ctx)

isAttribute = /^(.*)\[([a-z\-]+)\]$/i
$.fn.template = (data, rules) ->
  dom = @
  for selector, value of rules
    value = if typeof value is "function" then value(data) else data[value]
    if attribute = selector.match isAttribute
      if value is false or value is null or value is undefined
        dom.find(attribute[1]).removeAttr(attribute[2])
      else
        dom.find(attribute[1]).attr(attribute[2], value)
    else
      if typeof value is "function"
        value(dom.find(selector))
      else
        dom.find(selector).html( value )
  dom

$.fn.templateOne = (dom, data, rules)->
  $(this).append(dom.clone().template data, rules)

$.fn.templateAll = (dom, data, rules)->
  $(this).empty()
  if data
    $.each data, (k, i) =>
      $(this).append(dom.clone().template(i, rules))
  $(this).children()


window.makeDOMId = (els...) ->
  ((e || "untitled").replace(/[\+\~\.\,\*\$:/@]/g, "--") for e in els when e ! instanceof Object).join("--")

window.requestAnimFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (callback, element) ->
    window.setTimeout((->
      callback(new Date().getTime()))
    , 1000 / 60)

window.hoverPopup = ( ->
  popup = $('#hoverPopup').hide()
  hovering = false

  # generic mousemove
  $(document).bind('mousemove', (e) ->
    el = $(e.target)
    text = el.data('hoverText')
    if text isnt undefined
      hoverPopup.text(text).position(e.clientX, e.clientY).show()
      hovering = true
    else
      hovering && hoverPopup.hide()
      hovering = false
  )

  text: (text) -> popup.text(text) ; @
  position: (x, y) -> popup.css({ top: Math.min(y+15, window.innerHeight-popup.height()-10), left: Math.min(x+10, window.innerWidth-popup.width()-20) }) ; @
  hide: -> popup.hide() ; @
  show: -> popup.show() ; @
)()

window.EasingFunctions = `{
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}`

window.zip = (arr1, arr2) ->
  res = []
  for i in [0..arr1.length-1]
    res.push([arr1[i], arr2[i]])
  res

# Some helpers for formating
window.format =
  shortenNumber: (n, decimals = 1) ->
    return n if n < 1000
    return parseFloat((n / 1000).toFixed(decimals)) + 'k' if n < 1000000
    return parseFloat((n / 1000000).toFixed(decimals)) + 'M'

  cut: (num, dig) ->
    shorty = ((if num isnt undefined then num else "N/A") + "").slice 0, dig || num.length
    if shorty.indexOf(".") == shorty.length - 1 then shorty = shorty.slice(0,-1)
    shorty
  shorten: (num) -> @cut num, 5
  mini: (num) -> @cut num, 3

  units: (unit="", val, formatter) ->
    wasBad = val is undefined or val is null
    val = 0 if wasBad

    apply = (uvArray) ->
      uvArray = ["", "N/A"] if wasBad
      if formatter
        return formatter(uvArray[0], uvArray[1])
      else
        return uvArray[1] + wordSpace + uvArray[0]

    parsedVal = parseFloat(val, 10)
    wasBad = true if isNaN(parsedVal)

    wordSpace = if unit == "%" then "" else " "

    shorten = (u, v) ->
      switch u
        when "messages/second" then ["msg/s", v]
        when "messages/millisecond" then ["msg/ms", v]
        when "minutes" then ["mins", v]
        when "seconds"
          if v > 60 * 10
            shorten("minutes", v / 60 * 10)
          else
            ["s", v]
        when "milliseconds"
          if v > 10000
            shorten("seconds", v / 1000)
          else
            ["ms", v]
        when "microseconds"
          if v > 10000
            shorten("milliseconds", v / 1000)
          else
            micro = String.fromCharCode(0xB5)
            [micro + 's', v]
        when "bytes"
          if v > 10000
            shorten("kilobytes", v / 1024)
          else
            ["B", v]
        when "kilobytes"
          if v > 10000
            shorten("megabytes", v / 1024)
          else
            ["kB", v]
        when "megabytes"
          ["MB", v]
        when "bytes/second"
          if v > 10000
            shorten("kilobytes/second", v / 1024)
          else
            ["B/s", v]
        when "kilobytes/second"
          if v > 10000
            shorten("megabytes/second", v / 1024)
          else
            ["kB/s", v]
        when "megabytes/second"
          ["MB/s", v]

        else [u, v]

    apply(shorten(unit, parsedVal))

  humanReadableDuration: (v, unit, maxLength = 16) ->
    result = ""
    # convert to milliseconds
    a = switch unit
      when "milliseconds" then v
      when "microseconds" then Math.floor(v / 1000)
      when "seconds" then v * 1000
      else 0

    addPart = (b, unit) ->
      if (a >= b)
        if (result != "") then result += " "
        result += Math.floor(a / b) + " " + unit
        a = a % b

    addPart(86400000, "d")
    if (result.length + 4 <= maxLength)
      addPart(3600000, "h")
      if (result.length + 7 <= maxLength)
        addPart(60000, "min")
        if (result.length + 4 <= maxLength)
          addPart(1000, "s")

    if (result == "")
      result = ("" + a + " ms")

    result

  formatTime: (date, seconds = true, milliseconds = true, UTC = true) ->
    if not date? then return ""
    if not date.getUTCFullYear? then date = new Date(date)
    part = (x, numberOfDigits = 2) ->
      str = "" + x
      if (numberOfDigits >= 3 and x < 100) then str = "0" + str
      if (numberOfDigits >= 2 and x < 10) then str = "0" + str
      str

    result = ""
    result += part(if UTC then date.getUTCHours() else date.getHours())
    result += ":"
    result += part(if UTC then date.getUTCMinutes() else date.getMinutes())
    if (seconds)
      result += ":"
      result += part(if UTC then date.getUTCSeconds() else date.getSeconds())
    if (seconds and milliseconds)
      result += ":"
      result += part((if UTC then date.getUTCMilliseconds() else date.getMilliseconds()), 3)
    result

  formatDate: (date, UTC = true) ->
    if not date? then return ""
    if not date.getUTCFullYear? then date = new Date(date)
    part = (x) ->
      str = "" + x
      if (x < 10) then str = "0" + str
      str

    result = ""
    result += part(if UTC then date.getUTCFullYear() else date.getFullYear())
    result += "-"
    result += part(if UTC then (date.getUTCMonth() + 1) else (date.getMonth() + 1))
    result += "-"
    result += part(if UTC then date.getUTCDate() else date.getDate())
    result

  formatTimestamp: (date, UTC = true) ->
    if not date? then return ""
    if not date.getUTCFullYear? then date = new Date(date)
    @formatDate(date, UTC) + " " + @formatTime(date, true, true, UTC)

# for a given number array, return the max y value to use for a nice graph display
# precondition: xMin is 0
window.findNiceYMax = (data, smooth, scalar) ->
  # 1. apply a smoothing (moving) on datas to avoid extreme pollute points
  # 2. taking the maximum of these smoothing points
  # 3. return the max with a scalar to "center" the graph
  smooth = 3 if smooth is undefined
  smooth = Math.max(1, smooth)
  scalar = 1.5 if not scalar
  max = 0
  i = smooth-1
  if smooth <= 1 or data.length <= smooth
    # get the max value, without smoothing
    max = value for value in data when value > max
  else
    # retrieve the max value with smooting
    while i < data.length
      v = 0
      v += data[j] for j in [(i-smooth+1)..i]
      v /= smooth
      max = v if v > max
      i++
  max * scalar

window.findNiceRoundScale = (a, b, preferNumber) ->
  exp = ((b-a)/preferNumber).toExponential(10).split("e")
  pow10 = parseInt(exp[1])
  digit = parseInt(exp[0])

  if(digit<1.5)
    digit = 1
  else if(digit<3.5)
    digit = 2
  else if(digit < 7.5)
    digit = 5
  else
    pow10 += 1
    digit = 1

  digit * Math.pow(10, pow10)

window.calcTimeSteps = (minutes) ->
  if (minutes <= 5) then 1
  else if (minutes <= 10) then 2
  else if (minutes <= 30) then 5
  else if (minutes <= 60) then 10
  else if (minutes <= 120) then 20
  else if (minutes <= 180) then 30
  else if (minutes <= 360) then 60
  else if (minutes <= 720) then 120
  else if (minutes <= 1440) then 240
  else if (minutes <= 2880) then 480
  else if (minutes <= 5760) then 960
  else Math.ceil(minutes / 6)

window.inUrl = (path, url) ->
  url = url or window.location.hash
  url = (if url.search("#") < 0 then url.substr(1) else url)
  url = (if url.search("/") < 0 then [url] else url.split("/"))
  path = (if path.search("#") < 0 then path.substr(1) else path)
  path = (if path.search("/") < 0 then [path] else path.split("/"))
  if url.length < path.length
    return false
  else url.splice path.length, -1  if url.length > path.length
  for i of url
    return false  unless url[i] is path[i]
  true

window.sortBy = (key, a, b, reverse = false) ->
  if reverse
    return 1 if a[key] < b[key]
    return -1 if a[key] > b[key]
  else
    return 1 if a[key] > b[key]
    return -1 if a[key] < b[key]
  return 0

window.sortByMultiple = (keys, a, b) ->
  return r if (r = sortBy key, a, b) for key in keys
  return 0

window.noop = ->