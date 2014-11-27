/**
 * @File c.util.hybrid.js
 * @Description: hybrid环境的常用工具方法
 * @author shbzhang@ctrip.com
 * @date 2014-09-24 11:06:12
 * @version V1.0
 */

/**
 * 与Hybrid相关的工具方法
 * @namespace Util.cUtilHybrid
 */
define([], function () {

  var userAgent = window.navigator.userAgent,
    storage = window.localStorage;

  var Util = {};

  /**
 * 获取当前App 环境，fat/uat/dev/project ,2.0不再依据App判定环境
 * @static
 * @method Util.cUtilHybrid.isPreProduction
 * @deprecated
 * @returns {string} 0:测试 1:堡垒 2:UAT  null；生产
 */
  Util.isPreProduction = function () {
    return storage.getItem('isPreProduction');
  };

  /**
   * 获取App 平台类型
   * @static
   * @method Util.cUtilHybrid.getAppSys
   * @returns {string} ctrip:标准版,pro:Pro版,unicom:联通版,youth:青春版,ctriplite:轻量版
   */
  Util.getAppSys = function () {
    if (userAgent.indexOf('CtripLite') > -1) {
      return 'ctriplite';
    }
    var reg = /.+_(\w+)_CtripWireless_(\w+)/;
    var arr = reg.exec(userAgent);
    if (arr && arr[1]) return arr[1].toLowerCase();
    return null;
  };

  /**
   * 获取版本号
   * @static
   * @method Util.cUtilHybrid.getAppVer
   * @returns {string} 版本号
   */
  Util.getAppVer = function () {
    var arr = userAgent.match(/_([^_]+)$/);
    if (arr && arr[1]) return arr[1];
    return "1.0"
  };

  /**
   * 是否在app中打开，app
   * @static
   * @var Util.cUtilHybrid.isInApp
   * @type {boolean}
   */
  Util.isInApp = Lizard.isHybrid;


  /**
   * 判定是否在微信中
   * @static
   * @var Util.cUtilHybrid.isInWeichat
   * @type {boolean}
   */
  Util.isInWeichat = (function () {
    return userAgent.indexOf('MicroMessenger') > -1 ? true : false;
  })();


  /**
   * 判定是否为轻量版
   * @static
   * @var Util.cUtilHybrid.isLite
   * @type {boolean}
   */
  Util.isLite = (function () {
    return Util.getAppSys() == 'ctriplite';
  })();

  /**
   * 判定是否为标准版
   * @static
   * @var Util.cUtilHybrid.isStandard
   * @type {boolean}
   */
  Util.isStandard = (function () {
    return Util.getAppSys() == 'ctrip';
  })();

  /**
   * 判断是否为pro版
   * @static
   * @var Util.cUtilHybrid.isPro
   * @type {boolean}
   */
  Util.isPro = (function () {
    return Util.getAppSys() == 'pro';
  })();

  /**
   * 判断是否为联通版
   * @static
   * @var Util.cUtilHybrid.isUnicom
   * @type {boolean}
   */
  Util.isUnicom = (function () {
    return Util.getAppSys() == 'unicom';
  })();

  /**
   * 判断是否为青春版
   * @var Util.cUtilHybrid.isYounth
   * @type {boolean}
   */
  Util.isYounth = (function () {
    return Util.getAppSys() == 'youth';
  })();

  /**
   * 获取当前的网络状态
   * @method Util.cUtilHybrid.getNetStates
   * @return {string} netStatus 网络状态 None-无网络, 2G-蜂窝数据网EDGE/GPRS, 3G-蜂窝数据网HSPDA,CDMAVOD, 4G-LTE(4G为5.9加入), WIFI-WLAN网络
   * @since 5.8
   */
  Util.getNetStatus = function(){
    var cinfo = storage.getItem('CINFO');
    var status = 'None';
    try{
      var data = JSON.parse(cinfo);
      status = data.networkStatus || '';
    }catch (e){

    }
    return status;
  };


  return Util;
});