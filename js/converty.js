
  jQuery(function($) {
    var convert, converters, from, to, toolbar, update;
    $.ajaxSetup({
      scriptCharset: "utf-8"
    });
    from = $('#from');
    to = $('#to');
    toolbar = $('#toolbar');
    converters = {
      uriEncode: {
        label: 'URI Encode',
        convert: function(value) {
          return encodeURIComponent(value);
        }
      },
      uriDecode: {
        label: 'URI Decode',
        convert: function(value) {
          return decodeURIComponent(value);
        }
      },
      htmlEncode: {
        label: 'HTML Encode',
        convert: function(value) {
          return $("<div/>").text(value).html();
        }
      },
      htmlDecode: {
        label: 'HTML Decode',
        convert: function(value) {
          return $("<div/>").html(value).text();
        }
      },
      addSlashes: {
        label: 'Add Slashes',
        convert: function(value) {
          return value.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
        }
      },
      removeSlashes: {
        label: 'Strip Slashes',
        convert: function(value) {
          return value.replace(/\\(.?)/g, function(s, n1) {
            switch (n1) {
              case '\\':
                return '\\';
              case '0':
                return '\u0000';
              case '':
                return '';
              default:
                return n1;
            }
          });
        }
      },
      gzipEncode: {
        label: 'Gzip Encode',
        ajax: function(value) {
          return {
            codec: 'gzip',
            method: 'encode'
          };
        }
      },
      gzipDecode: {
        label: 'Gzip Decode',
        ajax: function(value) {
          return {
            codec: 'gzip',
            method: 'decode'
          };
        }
      },
      markdown: {
        label: 'Markdown',
        type: 'html',
        ajax: function(value) {
          return {
            codec: 'markdown',
            method: 'encode'
          };
        }
      }
    };
    $.each(converters, function(key, info) {
      var button;
      button = $("<button name=\"" + key + "\">" + info['label'] + "</button>");
      return toolbar.append(button);
    });
    update = function(value, type) {
      if (type == null) type = 'text';
      if ('html' === type) {
        to.css({
          whiteSpace: 'normal'
        });
        return to.html(value);
      } else {
        to.css({
          whiteSpace: 'pre'
        });
        return to.text(value);
      }
    };
    convert = function(name, value) {
      var after, type, _base, _ref;
      if ((_ref = (_base = converters[name])['type']) == null) {
        _base['type'] = 'text';
      }
      type = converters[name]['type'];
      if (converters[name]['convert']) {
        after = converters[name]['convert'](value);
        return update(after, type);
      } else if (converters[name]['ajax']) {
        return $.ajax({
          url: 'converty.php',
          type: 'get',
          data: $.extend({
            value: value
          }, converters[name]['ajax'](value)),
          success: function(after) {
            return update(after, type);
          }
        });
      }
    };
    return $('#toolbar button').live('click', function(event) {
      var after, button, name, value;
      button = $(this);
      name = button.attr('name');
      value = from.val();
      if (to.hasClass('error')) to.removeClass('error');
      try {
        return after = convert(name, value);
      } catch (e) {
        alert(e);
        after = 'Unable to converty!!';
        return to.addClass('error');
      }
    });
  });
