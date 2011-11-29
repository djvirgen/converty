
  jQuery(function($) {
    var converters, from, to, toolbar;
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
      }
    };
    $.each(converters, function(key, info) {
      var button;
      button = $("<button name=\"" + key + "\">" + info['label'] + "</button>");
      return toolbar.append(button);
    });
    return $('#toolbar button').live('click', function(event) {
      var after, before, button, name;
      button = $(this);
      name = button.attr('name');
      before = from.val();
      if (to.hasClass('error')) to.removeClass('error');
      try {
        after = converters[name]['convert'](before);
      } catch (e) {
        after = 'Unable to converty!!';
        to.addClass('error');
      }
      return to.text(after);
    });
  });
