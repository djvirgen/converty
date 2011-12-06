jQuery ($) ->
  # Configure AJAX
  $.ajaxSetup
    scriptCharset: "utf-8"

  from = $ '#from'
  to = $ '#to'
  toolbar = $ '#toolbar'
  
  # Converter configurations / callbacks
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
            
    gzipEncode:
      label: 'Gzip Encode'
      ajax: (value) ->
        {
          codec: 'gzip'
          method: 'encode'
        }
        
    gzipDecode:
      label: 'Gzip Decode'
      ajax: (value) ->
        {
          codec: 'gzip'
          method: 'decode'
        }
        
    markdown:
      label: 'Markdown'
      type: 'html'
      ajax: (value) ->
        {
          codec: 'markdown'
          method: 'encode'
        }
        
  $.each converters, (key, info) ->
    button = $ "<button name=\"#{key}\">#{info['label']}</button>"
    toolbar.append button
  
  update = (value, type = 'text') ->
    to.height 180
    
    if 'html' == type
      to.css {whiteSpace: 'normal'}
      to.html value
    else
      to.css {whiteSpace: 'pre'}
      to.text value
    
    height = to[0].scrollHeight
    height = 180 if height < 180
    height += 20
    to.height height
  
  convert = (name, value) ->
    converters[name]['type'] ?= 'text'
    type = converters[name]['type']
    if converters[name]['convert']
      after = converters[name]['convert'] value
      update after, type
    else if converters[name]['ajax']
      $.ajax({
        url: 'converty.php'
        type: 'get'
        data: $.extend({
          value: value
        }, converters[name]['ajax'](value));
        success: (after) ->
          update after, type
      });
  
  # timeout = null
  # from.live 'input', (event) ->
  #   window.clearTimeout timeout if timeout != null
  #   timeout = window.setTimeout ->
  #     convert 'htmlEncode', from.val()
  #     timeout = false
  #   , 500
    
  $('#toolbar button').live 'click', (event) ->
    button = $ this
    name = button.attr 'name'
    value = from.val()
    to.removeClass 'error' if to.hasClass 'error'
    try
      after = convert name, value
    catch e
      alert e
      after = 'Unable to converty!!'
      to.addClass 'error'