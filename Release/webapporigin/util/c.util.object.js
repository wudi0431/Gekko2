/**
 * @File c.util.object.js
 * @Description: hybrid环境的常用工具方法
 * @author shbzhang@ctrip.com
 * @date 2014-09-28 15:10:38
 * @version V1.0
 */

/**
 * 与Hybrid相关的工具方法
 * @namespace Util.cUtilObject
 */
define([], function () {

  var Obj = {};

  /**
   * @description 设置对象某个路径上的值
   * @method Util.cUtilObject.set
   * @param {object} obj
   * @param {string} string
   * @param {object|array|int} value
   * @returns {object}
   */
  Obj.set = function (obj, path, value) {
    if (!path) return null;

    var array = path.split('.');

    obj = obj || {};

    for (var i = 0, len = array.length, last = Math.max(len - 1, 0); i < len; i++) {
      if (i < last) {
        obj = (obj[array[i]] = obj[array[i]] || {});
      } else {
        obj[array[i]] = value;
      }
    }

    return obj;
  };

  /**
   * @description 获得对象在某个路径上的值
   * @method Util.cUtilObject.get
   * @param {object} obj
   * @param {string} path
   * @returns {object}
   */
  Obj.get = function (obj, path) {
    if (!obj || !path)
      return null;

    var array = path.split('.');

    obj = obj || {};

    for (var i = 0, len = array.length, last = Math.max(len - 1, 0); i < len; i++) {
      obj = obj[array[i]];

      if (obj === null || typeof obj === 'undefined') {
        return null;
      }
    }

    return obj;
  };


  return Obj;
});