/**
 * @File lizard.seed.js
 * Lizard基础类，框架种子文件
 * @author wxj@ctrip.com/luwei@ctripcom
 * @version V2.1
 */
/**
 * Lizard基础类，框架种子文件
 * @namespace Global.Lizard
 */
(function () {
  //初始化Lizard命名空间
  Lizard = typeof Lizard != 'undefined' ? Lizard : {
    /**
     * Lizard 版本
     * @var {String} [Global.Lizard.version=2.1]
     */
    version: "2.1",
    /**
     * 判断现在运行的包是否是Hybrid包
     * @var {Boolean} Global.Lizard.isHybrid
     */
    isHybrid: !!(window.LizardLocalroute),
    /**
     * 判断是否在携程的APP中(在Hybrid中打开H5页面为true，打开本地文件为false)
     * @var {Boolean} Global.Lizard.isInCtripApp
     */
    isInCtripApp: !!(navigator.userAgent.match(/ctripwireless/i) && (window.location.protocol != "file:")),

    viewReady: function () {
    },
    notpackaged: typeof require == 'undefined'
  };
  //初始化lizard属性
  initLizardConfig();
  //加载资源文件
  loadRes();
  window.Lizard = Lizard;

  //修复safari下 回退不执行JS的问题
  var shown = false;
  window.onpageshow = function (e) {
    if (shown) {
      window.location.reload();
    }
    shown = true;
  };

  window.onunload = function () {
  };
  /**
   * 组织UI组件路径
   * @param path
   * @returns {string}
   */
  window.getAppUITemplatePath = function (path) {
    if (!Lizard.notpackaged) return 'text!' + 'ui/' + path + '.html';
    if (document.location.href.indexOf('172.16.140.104:5389') > 0 || document.location.href.indexOf('localhost') > 0)
      return 'text!' + Lizard.dir + 'ui/' + path + '.html';

    return 'text!' + 'ui/' + path + '.html';
  }

  /**
   * 加载单个js文件
   * @param url
   * @param callback
   */
  function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    script.async = true;
    script.onload = callback;
    script.src = url;
    document.body.appendChild(script);
  }

  /**
   * 加载多个js文件
   * @param scripts
   * @param callback
   */
  function mutileLoad(scripts, callback) {
    var len = scripts.length;
    var no = 0;
    if (!len) {
      end();
      return;
    }
    for (var i = 0; i < len; i++) {
      var url = scripts[i];
      loadScript(url, end);
    }

    function end() {
      no++;
      if (no >= len) {
        callback();
      }
    }
  }

  /**
   * 解析lizard.seed.js标签的属性，初始化izard.dir,Lizard.pdConfig
   * Lizard.config 三个属性
   */
  function initLizardConfig() {
    var scripts = document.getElementsByTagName('script') || [];
    var reg = /lizard\.seed\.(src\.)*js.*$/ig;
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src");
      if (src && reg.test(src)) {
        Lizard.dir = src.replace(reg, '');
        var configStr = scripts[i].getAttribute("pdConfig") || '';
        Lizard.pdConfig = JSON.parse('["' + configStr.split(',').join('","') + '"]');
        if (scripts[i].getAttribute("lizardConfig")) {
          try {
            eval('Lizard.config = {' + scripts[i].getAttribute("lizardConfig") + '}')
          } catch (e) {
            console.log(e.stack)
          }
        } else {
          Lizard.config = {};
        }
        break;
      }
    }
  }


  /**
   * 加载AMD模块文件
   * @param e
   */
  function amdLoaderLoaded(e) {
    var configModel = Lizard.notpackaged ? [Lizard.dir + 'config.js'] : ['config']
    require(configModel, function () {
      var reqs = [];
      if (!Lizard.isHybrid) {
        if (Lizard.isInCtripApp) {
          reqs.push('cHybridAppInit');
          reqs.push('cStatic');
        }
        else {
          reqs.push('cWebAppInit');
        }
      }
      else {
        reqs.push('cHybridAppInit');
      }
      if (!Lizard.notpackaged) {
        if (Lizard.isHybrid || Lizard.isInCtripApp) {
          reqs.push('cBaseInit');
        }
        define("_", function () {
        });
        define("$", function () {
        });
        define("B", function () {
        });
        define("F", function () {
        });
      }
      require(['_', '$'], function () {
        /**
         * webresources站点的根目录地址,获取meta中webresourceBaseUrl的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.webresourceBaseUrl
         * @example
         * meta name="webresourceBaseUrl" content="http://webresource.c-ctrip.com/"
         */
        /**
         * PD的webresources站点的根目录地址,获取meta中WebresourcePDBaseUrl的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.WebresourcePDBaseUrl
         * @example
         * meta name="WebresourcePDBaseUrl" content="/webapp/car/webresource/"
         */
        /**
         * BU app的根目录地址,获取meta中appBaseUrl的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.appBaseUrl
         * @example
         *  meta name="appBaseUrl" content="/webapp/car/"
         */
        /**
         * restfullApi 是获取http数据的地址,获取meta中restfullApi的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.restfullApi
         * @example
         * meta name="restfullApi" content="http://m.ctrip.com/restapi/soa2/10134"
         */
        /**
         * restfullApiHttps 是获取https数据的地址,获取meta中restfullApiHttps的值,可以在html的meta属性指定
         * @var {String} Global.Lizard.restfullApiHttps
         */
        /**
         * timeout 全局的ajax取数据的超时时间,默认为30s, 可以在html的meta属性指定
         * @var {String} [Global.Lizard.timeout=30s]
         * @example
         * meta name="timeout" content="5000"
         */
        var lizardExpansions = ["appBaseUrl", "webresourceBaseUrl", "restfullApi", "restfullApiHttps", "WebresourcePDBaseUrl"];
        _.each($('meta'), function (metatag) {
          var tagObj = $(metatag);
          if (tagObj.attr('lizardExpansion') || _.contains(lizardExpansions, tagObj.attr('name'))) {
            Lizard[tagObj.attr('name')] = tagObj.attr('content');
          }
        });
        require(reqs, function () {
          if (_.isFunction(arguments[arguments.length - 1])) {
            arguments[arguments.length - 1]();
          }
        });
      });
    });
  }

  /**
   * 加载资源文件
   */
  function loadRes() {
    var basescripts = [];
    if (Lizard.notpackaged) {
      basescripts = [Lizard.dir + "3rdlibs/require.min.js"];
    } else {
      if (!Lizard.isHybrid && !Lizard.isInCtripApp) {
        basescripts.push(Lizard.dir + 'lizard.web.js');
      }
      if (Lizard.isHybrid) {
        basescripts.push('../ubt/_mubt.min.js');
      }
    }
    if (Lizard.isHybrid || Lizard.isInCtripApp) {
      Lizard.mutileLoad = function () {
        mutileLoad(basescripts, amdLoaderLoaded);
      };
    } else {
      mutileLoad(basescripts, amdLoaderLoaded);
    }
  }
})();