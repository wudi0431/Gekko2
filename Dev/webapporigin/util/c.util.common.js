/**
 * @File c.util.common.js
 * @Description: 常用工具方法
 * @author shbzhang@ctrip.com
 * @date 2014-09-24 11:06:12
 * @version V1.0
 */

/**
 * 推荐用cUtilCommon代替，此命名空间已不推荐使用
 * @namespace Util.cUtility
 * @deprecated
 */

/**
 * 常用的Util方法类，兼用了2.0之前版本的cUtility命名空间，但已不推荐引用老的命名空间
 * @namespace Util.cUtilCommon
 * @alias cUtility
 */
define(['cUtilDate'],function (cDate) {
  var Util = {};

  /**
   * cUtilDate 类型
   * @var Util.cUtilCommon.Date
   */
  Util.Date = cDate;
  /**
    * 获取服务端时间，cUtilDate.getServerDate快捷方式
    * @method Util.cUtilCommon.getServerDate
    * @param {function} [callback]
    * @returns {date} date 服务器时间
    */
  Util.getServerDate = cDate.getServerDate;
  /**
   * 是否在app中打开，app
   * @static
   * @var Util.cUtilCommon.isInApp
   * @type {boolean}
   */
  Util.isInApp = Lizard.isHybrid;

  /**
   * 浏览器是否支持pushState方法
   * @var Util.cUtilCommon.isSupportPushState
   * @type {boolean}
   */
  Util.isSupportPushState = (function () {
    //如果是hybrid则走hashchange,不走pushstate
    if (Lizard.isHybrid)return false;
    // return false;
    return !!(window.history && window.history.pushState && window.history.replaceState);
    /**/
  })();


  /**
   * 是否外链
   * @method Util.cUtilCommon.isSupportPushState
   * @param {string} url url链接
   * @returns {boolean}
   */
  Util.isExternalLink = function (url) {
    var RegH5NewType = new RegExp(/^mailto:|^tel:|^javascript:/);
    return RegH5NewType.test(url);
  }


  /**
   * 通过一个url唤醒app
   * @method Util.cUtilCommon.weakUpApp
   * @param {string} url 唤醒url，如ctripwireless://hoteml;
   */
  Util.weakUpApp =function (url) {
    var iframe = document.createElement('iframe');
    iframe.height = 1;
    iframe.width = 1;
    iframe.frameBorder = 0;
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    document.body.appendChild(iframe);

    Util.weakUpApp = function (url) {
      iframe.src = url;
    };

    Util.weakUpApp(url);
  }

  /**
   * 每次调用生成一个GUID随意数 格式为f5b6bfaa-09ec-6bdd-2c81-c1f435dca270
   * @method Util.cUtilCommon.createGuid
   * @return {String} GUID 唯一标示
   */
  Util.createGuid = function () {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    function NewGuid() {
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    return NewGuid();
  };

  /**
   * 返回GUID，与createGuid不同的是，会首先检查LocalStorage中的值
   * @method Util.cUtilCommon.getGuid
   * @returns {string} GUID 唯一标示
   */
  Util.getGuid = function () {
    var ws = window.localStorage;
    var guid = ws.getItem('GUID') || '';

    if (!guid) {
      guid = Util.createGuid();
      try {
        ws.setItem('GUID', guid);
      } catch (e) {
      }
    }
    return guid;
  };

  /**
   * 返回是否为android平台
   * @var Util.cUtilCommon.isAndroid
   * @type {boolean}
   */
  Util.isAndroid = (function () {
    return $.os['android'] == 'android';
  })();

  /**
   * 返回是否为iPhone平台
   * @var Util.cUtilCommon.isIPhone
   * @type {boolean}
   */
  Util.isIphone = (function () {
    return $.os['iphone'] == 'iphone';
  })();

  /**
   * 返回是否为iPad平台
   * @var Util.cUtilCommon.isIpad
   * @type {boolean}
   */
  Util.isIpad = (function () {
    return $.os['ipad'] == 'ipad';
  })();

  /**
   * 返回是否为Window Phone平台
   * @var Util.cUtilCommon.isWPhone
   * @type {boolean}
   */
  Util.isWPhone = (function () {
    return window.navigator.userAgent.indexOf('Windows Phone') > 1;
  })();

  Util.isUrl = function (url) {
    return /^http(s)?:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/.test(url);
  };

  return Util;
});
