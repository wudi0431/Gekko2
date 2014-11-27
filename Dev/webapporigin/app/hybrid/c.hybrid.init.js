define(['cHybridGuider'], function(Guider){
    (function () {
    if (navigator.userAgent.indexOf('Android') > 0) {
      JSON.stringify = {}
    }
    (function () {
      'use strict';
      function f(n) {
        return n < 10 ? '0' + n : n
      }
      if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function () {
          return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
          return this.valueOf()
        }
      }
      var cx,
      escapable,
      gap,
      indent,
      meta,
      rep;
      function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable,
          function (a) {
          var c = meta[a];
          return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
      }
      function str(key, holder) {
        var i,
        k,
        v,
        length,
        mind = gap,
        partial,
        value = holder[key];
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
          value = value.toJSON(key)
        }
        if (typeof rep === 'function') {
          value = rep.call(holder, key, value)
        }
        switch (typeof value) {
        case 'string':
          return quote(value);
        case 'number':
          return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
          return String(value);
        case 'object':
          if (!value) {
            return 'null'
          }
          gap += indent;
          partial = [];
          if (Object.prototype.toString.apply(value) === '[object Array]') {
            length = value.length;
            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || 'null'
            }
            v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
            gap = mind;
            return v
          }
          if (rep && typeof rep === 'object') {
            length = rep.length;
            for (i = 0; i < length; i += 1) {
              if (typeof rep[i] === 'string') {
                k = rep[i];
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ': ' : ':') + v)
                }
              }
            }
          } else {
            for (k in value) {
              if (Object.prototype.hasOwnProperty.call(value, k)) {
                v = str(k, value);
                if (v) {
                  partial.push(quote(k) + (gap ? ': ' : ':') + v)
                }
              }
            }
          }
          v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
          gap = mind;
          return v
        }
      }
      if (typeof JSON.stringify !== 'function') {
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        meta = {
          '\b' : '\\b',
          '\t' : '\\t',
          '\n' : '\\n',
          '\f' : '\\f',
          '\r' : '\\r',
          '"' : '\\"',
          '\\' : '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {
          var i;
          gap = '';
          indent = '';
          if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
              indent += ' '
            }
          } else if (typeof space === 'string') {
            indent = space
          }
          rep = replacer;
          if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
          }
          return str('', {
            '' : value
          })
        }
      }
    }());
  })();  
  
  Lizard.localRoute = {
    config: {},
    addConfig: function (obj) {
      for (var urlschema in obj) {
        if (obj.hasOwnProperty(urlschema)) {
          Lizard.localRoute.config[urlschema] = obj[urlschema];
        }
      }
    },
    
    mapUrl: function (url) {
      var ret = '', lc = 0;
      _.each(Lizard.localRoute.config, function(item, urlSchema){
        if (Lizard.localRoute.config.hasOwnProperty(urlSchema)) {
          var parseRet = Lizard.schema2re(urlSchema, url);
          if (parseRet.reStr && parseRet.param) {
            if (parseRet.reStr.length > lc) {
              lc = parseRet.reStr.length;
              ret = Lizard.localRoute.config[urlSchema];
            }
          }
        }
      })      
      return ret;
    }
  };
  
  if (window.LizardLocalroute) {
    Lizard.localRoute.addConfig(window.LizardLocalroute);
    var el = document.getElementById("LizardLocalroute");
    if (el) {
      Lizard.weinre = el.getAttribute("LizardWeinre");
      Lizard.ip = el.getAttribute("LizardIP");
      Lizard.chanal = el.getAttribute("LizardChanal");
    }
  }
  
  //如果是pc端打开的话，直接主动触发init_member_H5_info
  if (Internal.isIOS || Internal.isAndroid || Internal.isWinOS) {} else {
    var isPc = (function isPc() {
      return window.navigator.platform == "Win32";
    })();
    if (!isPc) {
      Guider.create();
      return;
    }
    var appInfo = {
      "tagname": "web_view_finished_load",
      "param": {
        "platform": "2",
        "osVersion": "Android_18",
        "extSouceID": "",
        "version": "5.5"
      }
    }
    Internal.isAndroid = (appInfo.param.platform == "2");
    Internal.isInApp = true;
    Internal.appVersion = appInfo.param.version;
    Internal.osVersion = appInfo.param.osVersion;
    if (window.localStorage) {
      window.localStorage.clear();
      if (appInfo) window.localStorage.setItem('APPINFO', JSON.stringify(appInfo));
      window.localStorage.setItem('ISINAPP', '1');
    }
    window.Util_a = {};
    window.Util_a.h5Log = function(paramString) {
      console.log('h5Log::', paramString);
    }
    window.Util_a.openUrl = function(paramString) {
      console.log('h5Log::', paramString);
    }
    window.Util_a.checkNetworkStatus = function(paramString) {
      console.log('h5Log::', paramString);
    }
    window.Locate_a = {};
    window.Locate_a.locate = function(paramString) {};
    window.NavBar_a = {};
    window.NavBar_a.setNavBarHidden = function(paramString) {};
    window.User_a = {};
    window.User_a.initMemberH5Info = function(paramString) {};
    window.Business_a = {};
    window.Business_a.sendUBTLog = function(paramString) {};
    window.Business_a.logGoogleRemarking = function(paramString) {};
    window.app.callback({
      'tagname': 'web_view_finished_load'
    });
    window.app.callback({
      'tagname': 'init_member_H5_info',
      'param': {
        appId: "ctrip.android.view",
        clientID: "32043596200000129090",
        device: "samsung_GT-N7102",
        extSouceID: "",
        isPreProduction: "0",
        osVersion: "Android_18",
        platform: "2",
        serverVersion: "5.7",
        sourceId: "8892",
        timestamp: "1402930469100",
        userInfo: {
          data: {
            Auth: "",
            BMobile: "",
            BindMobile: "",
            IsNonUser: true,
            UserID: ""
          },
          timeby: 1,
          timeout: "2015/06/16"
        },
        version: "5.5"
      }
    });    
  }
  
  Guider.create();
})