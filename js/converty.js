
  jQuery(function($) {
    var convert, converters, from, to, toolbar;
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
      }
    };
    $.each(converters, function(key, info) {
      var button;
      button = $("<button name=\"" + key + "\">" + info['label'] + "</button>");
      return toolbar.append(button);
    });
    convert = function(name, value) {
      var after;
      if (converters[name]['convert']) {
        after = converters[name]['convert'](value);
        return to.text(after);
      } else if (converters[name]['ajax']) {
        return $.ajax({
          url: 'converty.php',
          type: 'get',
          data: $.extend({
            value: value
          }, converters[name]['ajax'](value)),
          success: function(r) {
            return to.text(r);
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
        after = 'Unable to converty!!';
        return to.addClass('error');
      }
    });
  });
