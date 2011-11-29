jQuery ($) ->
  from = $ '#from'
  to = $ '#to'
  toolbar = $ '#toolbar'
  
  converters =
    uriEncode:
      label: 'URI Encode'
      convert: (value) -> encodeURIComponent value
    
    uriDecode:
      label: 'URI Decode'
      convert: (value) -> decodeURIComponent value
    
    htmlEncode:
      label: 'HTML Encode'
      convert: (value) -> $("<div/>").text(value).html()

    htmlDecode:
      label: 'HTML Decode'
      convert: (value) -> $("<div/>").html(value).text()
  
  $.each converters, (key, info) ->
    button = $ "<button name=\"#{key}\">#{info['label']}</button>"
    toolbar.append button
  
  $('#toolbar button').live 'click', (event) ->
    button = $ this
    name = button.attr 'name'
    before = from.val()
    to.removeClass 'error' if to.hasClass 'error'
    try
      after = converters[name]['convert'] before
    catch e
      after = 'Unable to converty!!'
      to.addClass 'error'
    to.text after