
  jQuery(function($) {
    var $converterChain, convert, convertAll, converterChain, converters, from, timeout, to, toolbar, update;
    $.ajaxSetup({
      scriptCharset: "utf-8"
    });
    from = $('#from');
    to = $('#to');
    toolbar = $('#toolbar');
    converterChain = [];
    $converterChain = $('#converter-chain');
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
      var height;
      if (type == null) type = 'text';
      to.height(180);
      if ('html' === type) {
        to.css({
          whiteSpace: 'normal'
        });
        to.html(value);
      } else {
        to.css({
          whiteSpace: 'pre'
        });
        to.text(value);
      }
      height = to[0].scrollHeight;
      if (height < 180) height = 180;
      height += 20;
      return to.height(height);
    };
    convert = function(name, value) {
      var type, _base, _ref;
      if ((_ref = (_base = converters[name])['type']) == null) {
        _base['type'] = 'text';
      }
      type = converters[name]['type'];
      if (converters[name]['convert']) return converters[name]['convert'](value);
    };
    convertAll = function(value) {
      return $.ajax({
        url: 'converty.php',
        type: 'get',
        data: {
          value: value,
          converterChain: converterChain
        },
        success: function(after) {
          return update(after);
        }
      });
    };
    timeout = null;
    from.live('input', function(event) {
      if (timeout !== null) window.clearTimeout(timeout);
      return timeout = window.setTimeout(function() {
        convertAll(from.val());
        return timeout = null;
      }, 500);
    });
    return $('#toolbar button').live('click', function(event) {
      var button, name;
      button = $(this);
      name = button.attr('name');
      converterChain.push(name);
      $converterChain.append($('<li></li>').text(name));
      return from.triggerHandler('input');
    });
  });
