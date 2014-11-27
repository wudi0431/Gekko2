/**
 * @File c.web.guider
 * @Description:  web 环境下的操作
 * @author shbzhang
 * @date 2014-09-24 11:08:08
 * @version V1.0
 */
define([], function () {
  "use strict";
  var Guider = {
    jump: function (options) {
      if (options && options.url && typeof options.url === 'string') {
        window.location.href = options.url;
      }
    },

    apply: function (options) {
      if (options && options.callback && typeof options.callback === 'function') {
        options.callback();
      }
    },

    call: function (options) {
      var $caller = document.getElementById('h5-hybrid-caller');

      if (!options || !options.url || !typeof options.url === 'string') {
        return false;
      } else if ($caller && $caller.src == options.url) {
        $caller.contentDocument.location.reload();
      } else if ($caller && $caller.src != options.url) {
        $caller.src = options.url;
      } else {
        $caller = document.createElement('iframe');
        $caller.id = 'h5-hybrid-caller';
        $caller.src = options.url;
        $caller.style.display = 'none';
        document.body.appendChild($caller);
      }
    },

    log: function (options) {
      if (window.console) {
        window.console.log(options.name);
      }
    },

    print: function (options) {
      return console.log(options.log, options.result);
    },

    callService: function () {
      window.location.href = 'tel:4000086666';
    },

    backToLastPage: function () {
      window.location.href = document.referrer;
    },

    home: function () {
      window.location.href = '/';
    }
  };

  return Guider;
});