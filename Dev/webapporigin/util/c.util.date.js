/**
 * @File c.util.data.js
 * @Description: Date常用工具方法
 * @author oxzhi@ctrip.com/shbzhang@ctrip.com
 * @date 2014-09-28 11:05:37
 * @version V1.0
 */

/**
 *  @namespace Util.cUtilDate
 *  @name Util.cUtilDate
 */
define(['cCoreInherit'], function (inherit, cUtilCommon) {
  //var cDate = {};

  var cDate = new inherit.Class({
    /**
     * 生成一个CDate实例
     * @class CDate
     * @memberof Util.cUtilDate
     * @param {Date} [date] 日期
     * @type {Core.Class}
     */
    initialize: function (date) {
      date = date || new Date();
      this.date = new Date(date);
    },

    /**
     * @description 当前时间加n天
     * @method addDay
     * @memberof Util.cUtilDate.CDate
     * @param {Number} n
     * @returns {cDate}
     */
    addDay: function (n) {
      n = n || 0;
      this.date.setDate(this.date.getDate() + n);
      return this;
    },

    /**
     * @description 当前时间加n月
     * @memberof Util.cUtilDate.CDate
     * @param {Number} n
     * @returns {cDate}
     */
    addMonth: function (n) {
      n = n || 0;
      this.date.setMonth(this.date.getMonth() + n);
      return this;
    },

    /**
     * @description 当前时间加n个小时
     * @memberof Util.cUtilDate.CDate
     * @param {Number} n
     * @returns {cDate}
     */
    addHours: function (n) {
      n = n || 0;
      this.date.setHours(this.date.getHours() + n);
      return this;
    },

    /**
     * 当前时间基础上增加n分
     * @memberof Util.cUtilDate.CDate
     * @param {Number} n
     * @returns {cDate}
     */
    addMinutes: function (n) {
      n = n || 0;
      this.date.setMinutes(this.date.getMinutes() + n);
      return this;
    },
    /**
     * 当前时间基础上增加n秒
     * @memberof Util.cUtilDate.CDate
     * @param {Number} n
     * @returns {cDate}
     */
    addSeconds: function (n) {
      n = n || 0;
      this.date.setSeconds(this.date.getSeconds() + n);
      return this;
    },

    /**
     * @description 当前时间加n年
     * @memberof Util.cUtilDate.CDate
     * @param {Number} n
     * @returns {cDate}
     */
    addYear: function (n) {
      n = n || 0;
      this.date.setYear(this.date.getFullYear() + n);
      return this;
    },

    /**
     * @description 设置当前时间的小时，分，秒
     * @memberof Util.cUtilDate.CDate
     */
    setHours: function () {
      this.date.setHours.apply(this.date, arguments);
      return this;
    },

    /**
     * 获得原生Date对象
     * @memberof Util.cUtilDate.CDate
     * @returns {Date}
     */
    valueOf: function () {
      return this.date;
    },

    /**
     * 获得毫秒数
     * @memberof Util.cUtilDate.CDate
     * @returns {number} 毫秒
     */
    getTime: function () {
      return this.date.valueOf();
    },

    /**
     * 获得utc时间字符串
     * @memberof Util.cUtilDate.CDate
     */
    toString: function () {
      return this.date.toString();
    },

    /**
     * @description 格式化时间,格式化参数请参考php中date函数说明
     * @memberof Util.cUtilDate.CDate
     * @param {String} format
     * @returns {String}
     * @see http://www.php.net/manual/zh/function.date.php
     */
    format: function (format) {
      if (typeof format !== 'string')
        format = '';

      for (var key in this._MAPS) {
        format = this._MAPS[key].call(this, format, this.date, key);
      }
      return format;
    },

    /**
     * @description 返回输入Date的相差的月份数
     * @memberof Util.cUtilDate.CDate
     * @param {Date} 要计算的时间
     * @return {Number} 月数
     */
    diffMonth: function (date) {
      var curY = parseInt(this.format('Y'), 10),
        curM = parseInt(this.format('m'), 10),
        cdate = new cDate(date),
        cdateY = parseInt(cdate.format('Y'), 10),
        cdateM = parseInt(cdate.format('m'), 10);

      return (cdateY - curY) * 12 + (cdateM - curM);
    },
    //星期数据
    _DAY1: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    _DAY2: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    //时间格式化函数集
    _MAPS: {
      //有前导零的日期值
      'd': function (str, date, key) {
        var d = date.getDate().toString();
        if (d.length < 2) d = '0' + d;
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的日期值
      'j': function (str, date, key) {
        return str.replace(new RegExp(key, 'mg'), date.getDate());
      },
      //星期中的第几天 1-7
      'N': function (str, date, key) {
        var d = date.getDay();
        if (d === 0) d = 7;
        return str.replace(new RegExp(key, 'mg'), d);
      },
      'w': function (str, date, key) {
        var d = date.getDay();
        var title = this._DAY1[d];
        return str.replace(new RegExp(key, 'mg'), title);
      },
      'W': function (str, date, key) {
        var d = date.getDay();
        var title = this._DAY2[d];
        return str.replace(new RegExp(key, 'mg'), title);
      },
      //有前导零的月份
      'm': function (str, date, key) {
        var d = (date.getMonth() + 1).toString();
        if (d.length < 2) d = '0' + d;
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的月份
      'n': function (str, date, key) {
        return str.replace(key, date.getMonth() + 1);
      },
      //四位年份
      'Y': function (str, date, key) {
        return str.replace(new RegExp(key, 'mg'), date.getFullYear());
      },
      //两位年份
      'y': function (str, date, key) {
        return str.replace(new RegExp(key, 'mg'), date.getYear());
      },
      //无前导零的小时,12小时制
      'g': function (str, date, key) {
        var d = date.getHours();
        if (d >= 12) d = d - 12;
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的小时，24小时制
      'G': function (str, date, key) {
        return str.replace(new RegExp(key, 'mg'), date.getHours());
      },
      //有前导零的小时，12小时制
      'h': function (str, date, key) {
        var d = date.getHours();
        if (d >= 12) d = d - 12;
        d += '';
        if (d.length < 2) d = '0' + d;
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //有前导零的小时，24小时制
      'H': function (str, date, key) {
        var d = date.getHours().toString();
        if (d.length < 2) d = '0' + d;
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //有前导零的分钟
      'i': function (str, date, key) {
        var d = date.getMinutes().toString();
        if (d.length < 2) d = '0' + d;
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //有前导零的秒
      's': function (str, date, key) {
        var d = date.getSeconds().toString();
        if (d.length < 2) d = '0' + d;
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的分钟
      'I': function (str, date, key) {
        var d = date.getMinutes().toString();
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //无前导零的秒
      'S': function (str, date, key) {
        var d = date.getSeconds().toString();
        return str.replace(new RegExp(key, 'mg'), d);
      },
      //转换为今天/明天/后天
      'D': function (str, date, key) {
        var now = cDate.getServerDate();
        now.setHours(0, 0, 0, 0);
        date = new Date(date.valueOf());
        date.setHours(0, 0, 0, 0);
        var day = 60 * 60 * 24 * 1000,
          tit = '',
          diff = date - now;
        if (diff >= 0) {
          if (diff < day) {
            tit = '今天';
          } else if (diff < 2 * day) {
            tit = '明天';
          } else if (diff < 3 * day) {
            tit = '后天';
          }
        }
        return str.replace(new RegExp(key, 'mg'), tit);
      }
    }
  });

  inherit.extend(cDate, {
    /**
     * 将字符串转换为CDate对象
     * @static
     * @memberof Util.cUtilDate
     * @param {String} str
     * @returns {cDate}
     */
    parse: function (str, isNative) {
      if (typeof str === 'undefined') {
        return new Date();
      }
      if (typeof str === 'string') {
        str = str || '';
        var regtime = /^(\d{4})\-?(\d{1,2})\-?(\d{1,2})/i;
        if (str.match(regtime)) {
          str = str.replace(regtime, "$2/$3/$1");
        }
        var st = Date.parse(str);
        var t = new Date(st || new Date());
        return isNative ? t : new cDate(t);
      } else if (typeof str === 'number') {
        return new Date(str);
      } else {
        return new Date();
      }
    },

    /**
     * 返回HH：MM格式
     * @static
     * @memberof Util.cUtilDate
     * @param {string} timeStr 日期字符串
     */
    getHM: function (timeStr) {
      var d = this._getDate(timeStr);
      var h = d.getHours();
      var m = d.getMinutes();
      return (h < 10 ? '0' + h : '' + h) + ':' + (m < 10 ? '0' + m : '' + m);
    },

    /**
     * 返回两个日期相差的天数
     * @static
     * @memberof Util.cUtilDate
     * @param {String} ds1  日期1
     * @param {Stirng} ds2  日期2
     * @returns {Number} num 相差天数
     */
    getIntervalDay: function (ds1, ds2) {
      var d1 = this._getDate(ds1);
      var d2 = this._getDate(ds2);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
      return parseInt((d2 - d1) / 86400000);
    },

    /**
     * 将分钟转还为小时字符串，如90输出为1小时30分钟
     * @static
     * @memberof Util.cUtilDate
     * @param {Number} min 分钟
     * @returns {string} 转换结果
     */
    m2H: function (min) {
      var h = Math.floor(min / 60);
      var m = min % 60;
      return (h > 0 ? h + '小时' : '') + (m > 0 ? m + '分钟' : '');
    },

    _getDate: function (ds) {
      var t = cDate.parse(ds, true);
      var d = new Date();
      d.setTime(t);
      return d;
    },

    /**
     * 日期类型格式化为指定字符串
     * @static
     * @memberof Util.cUtilDate
     * @param {Date} obj
     * @param {String} str
     * @returns {String|*}
     */
    format: function (obj, str) {
      return new cDate(obj).format(str);
    },
    /**
     *  获取周几，d为日期C.parse(d);
     *  @static
     *  @memberof Util.cUtilDate
     *  @param {date|string} date 输入
     *  @return {string} 结果 周日，周一...周六
     */
    weekday: function (d) {
      var day = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      var dd = new Date(d);
      return day[dd.getDay()];
    },
    /**
     * 计算两个时间的相隔月份数
     * @static
     * @memberof Util.cUtilDate
     * @param d1
     * @param d2
     * @returns {Number|*}
     */
    diffMonth: function (d1, d2) {
      d1 = new cDate(d1);
      return d1.diffMonth(d2);
    },

    /**
     * @static
     * @method getServerDate
     * @memberof Util.cUtilDate
     * @param {function} [callback]
     * @returns {date} date 服务器时间
     * @description 获取服务端时间
     */
    getServerDate : function(callback) {
      var now = new Date();
      var applyCallback = function (date) {
        if (typeof callback === 'function') {
          return callback(date);
        }
        return date;
      };

      /** 在App层调用的回调部分 */
      var hybridCallback = function () {
        var serverdate = window.localStorage.getItem('SERVERDATE');

        /** 如果没有从LocalStorage中获得数据直接返回 */
        if (!serverdate) {
          return applyCallback(now);
        }
        /** servertime的计算逻辑：第一次进入取本地时间和服务器时间的差值，保存差值。每次再取差值加上本地时间，计算出服务端时间 */
        try {
          serverdate = JSON.parse(serverdate);
          if (serverdate && serverdate.server && serverdate.local) {
            var servertime = window.parseInt(serverdate.server);
            var localtime = window.parseInt(serverdate.local);
            var currenttime = (new Date()).getTime();
            var cServertime = new Date(servertime + currenttime - localtime);

            return applyCallback(cServertime);
          } else {
            return applyCallback(now);
          }
        } catch (e) {

          return applyCallback(now);
        }
      };

      /** 在Web层调用的回调 */
      var webCallback = function () {
        if (typeof __SERVERDATE__ === 'undefined' || !__SERVERDATE__.server) {
          return applyCallback(now);
        }
        /** 计算server time的时间  */
        var servertime = new Date(__SERVERDATE__.server.valueOf() + (new Date().valueOf() - __SERVERDATE__.local.valueOf()));
        return applyCallback(servertime);
      };

      return Lizard.isHybrid ? hybridCallback() : webCallback();
    }
  });

  return cDate;
});