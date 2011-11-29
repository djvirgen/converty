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
      
    addSlashes:
      label: 'Add Slashes'
      convert: (value) -> value.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
      
    removeSlashes:
      label: 'Strip Slashes'
      convert: (value) -> 
        value.replace /\\(.?)/g, (s, n1) ->
          switch n1
            when '\\' then '\\'
            when '0' then '\u0000'
            when '' then ''
            else n1
        
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