/**
 * 封装常用的Ajax 访问
 * @namespace Common.cAjax
 * @author shbzhang@ctrip.com
 * @date 2013年6月23日
 */
define(['libs', 'cUtilPerformance'], function (libs, cperformance) {
  //为兼容lizard2.0, json去掉charset=utf-8 
  var contentTypeMap = {
    'json': 'application/json',
    'jsonp': 'application/json'
  };

  var _getContentType = function (contentType) {
    if (contentType) contentType = contentTypeMap[contentType] ? contentTypeMap[contentType] : contentType;
    return contentType;
  };

  var ajax = (function ($) {

    /**
     *  AJAX GET方式访问接口
     * @method Common.cAjax.get
     * @param {string} url 请求的url
     * @param {object} data json格式的数据
     * @param {function} successCallback 成功回调
     * @param {function} [errorCallback] 错误回调
     * @param {number} [timeout=30000] 超时时间
     * @returns {XMLHttpRequest} XMLHttpRequest ajax句柄
     */
    function get(url, data, callback, error, timeout) {
      var opt = _getCommonOpt(url, data, callback, error);
      opt.type = 'GET';
      opt.timeout = timeout;
      return _sendReq(opt);
    };


    /**
     * AJAX POST方式访问接口
     * @method Common.cAjax.get
     * @param {string} url 请求的url
     * @param {object} data json格式的数据
     * @param {function} successCallback 成功回调
     * @param {function} [errorCallback] 错误回调
     * @param {number} [timeout=30000] 超时时间
     * @returns {XMLHttpRequest} XMLHttpRequest ajax句柄
     */
    function post(url, data, callback, error,timout) {
      var contentType = data.contentType;
      // data = JSON.stringify(data);
      data = JSON.stringify(data);
      var opt = _getCommonOpt(url, data, callback, error);
      opt.type = 'POST';
      opt.dataType = 'json';
      opt.timeout = timout;
      opt.contentType = _getContentType(contentType) || 'application/json';
      return _sendReq(opt);
    };


    /**
     * 以JSONP方式跨域访问外部接口
     * @method Common.cAjax.jsonp
     * @param {string} url 请求的url
     * @param {object} data json格式的数据
     * @param {function} successCallback 成功回调
     * @param {function} [errorCallback] 错误回调
     * @param {number} [timeout=30000] 超时时间
     * @returns {XMLHttpRequest} XMLHttpRequest ajax句柄
     */
    function jsonp(url, data, callback, error,timeout) {
      var opt = _getCommonOpt(url, data, callback, error);
      opt.type = 'GET';
      opt.dataType = 'jsonp';
      opt.crossDomain = true;
      opt.timeout = timeout;
      return _sendReq(opt);
    };


    /**
     * Cros方法提交Ajax请求
     * @method Common.cAjax.cros
     * @param {string} url 请求的url
     * @param {string} [type=POST] 请求提交方式 POST|GET
     * @param {object} data json格式的数据
     * @param {function} successCallback 成功回调
     * @param {function} [errorCallback] 错误回调
     * @param {number} [timeout=30000] 超时时间
     * @returns {XMLHttpRequest} XMLHttpRequest ajax句柄
     */
    function cros(url, type, data, callback, error,timeout) {
      var contentType = data.contentType;

      if (type.toLowerCase() !== 'get')
      // data = JSON.stringify(data);
        data = JSON.stringify(data);
      var opt = _getCommonOpt(url, data, callback, error);
      opt.type = type;
      opt.dataType = 'json';
      opt.crossDomain = true;
      opt.data = data;
      opt.contentType = _getContentType(contentType) || 'application/json';
      opt.timeout = timeout;
      /* if (window.XDomainRequest) {
       return _iecros(opt);
       } else {*/
      return _sendReq(opt);
      //}
    };

    /**
     * AJAX 提交表单,不能跨域
     * @param {url} url
     * @param {Object} form 可以是dom对象，dom id 或者jquery 对象
     * @param {function} callback 回调
     * @param {function} error 可选
     */
    function form(url, form, callback, error) {
      var jdom = null, data = '';
      if (typeof form == 'string') {
        jdom = $('#' + form);
      } else {
        jdom = $(form);
      }
      if (jdom && jdom.length > 0) {
        data = jdom.serialize();
      }
      var opt = _getCommonOpt(url, data, callback, error);
      return _sendReq(opt);
    };

    function _sendReq(opt) {
      var uuidXhrSend = cperformance.getUuid();
      cperformance.group(uuidXhrSend, {
        name: "AjaxReady",
        url: opt.url,
        data: opt.data
      });

      //+…2014-08-19
      var loadedLength = 0;

      var obj = {
        url: opt.url,
        type: opt.type,
        dataType: opt.dataType,
        data: opt.data,
        contentType: opt.contentType,
        timeout: Lizard.timeout || opt.timeout || 50000,

        //+…2014-08-19
        // 获取响应的字节长度（responseText.length 系字符数）
        beforeSend: function (xhr) {
          xhr.onprogress = function (event) {
            loadedLength = event.loaded ? event.loaded : event.position;
          }
        },

        //-1…2014-08-19
        // success: function (res) {
        //+1…2014-08-19
        success: function (res, status, xhr) {
          //+5…2014-08-19          
          cperformance.log({
            name: 'AjaxMessageSize',
            // contentEncoding: xhr && typeof xhr.getResponseHeader == 'function' ? xhr.getResponseHeader('content-encoding') : undefined, // 确保不要报错
            url: opt.url
          }, loadedLength);

          cperformance.groupEnd(uuidXhrSend);
          opt.callback(res);
        },
        error: function (err) {
          cperformance.groupEnd(uuidXhrSend);
          opt.error && opt.error(err);
        }
      };
      //是否是跨域则加上这条
      if (opt.url.indexOf(window.location.host) === -1) obj.crossDomain = !!opt.crossDomain;
      return $.ajax(obj);
    };

    /**
     * ie 调用 crors
     */
    function _iecros(opt) {
      if (window.XDomainRequest) {
        var xdr = new XDomainRequest();
        if (xdr) {
          if (opt.error && typeof opt.error == "function") {
            xdr.onerror = function () {
              opt.error();
              ;
            };
          }
          //handle timeout callback function
          if (opt.timeout && typeof opt.timeout == "function") {
            xdr.ontimeout = function () {
              opt.timeout();
            };
          }
          //handle success callback function
          if (opt.success && typeof opt.success == "function") {
            xdr.onload = function () {
              if (opt.dataType) {//handle json formart data
                if (opt.dataType.toLowerCase() == "json") {
                  opt.callback(JSON.parse(xdr.responseText));
                }
              } else {
                opt.callback(xdr.responseText);
              }
            };
          }

          //wrap param to send
          var data = "";
          if (opt.type == "POST") {
            data = opt.data;
          } else {
            data = $.param(opt.data);
          }
          xdr.open(opt.type, opt.url);
          xdr.send(data);
        }
      }
    };

    function _getCommonOpt(url, data, callback, error) {
      return {
        url: url,
        data: data,
        callback: callback,
        error: error
      }
    };

    return {
      get: get,
      post: post,
      jsonp: jsonp,
      cros: cros,
      form: form
    }
  })($);

  return ajax;
});