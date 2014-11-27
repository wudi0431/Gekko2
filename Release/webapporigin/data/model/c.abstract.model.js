/**
 * @File c.abstract.model
 * @Description: Model抽象类，封装ajax访问
 * @author ouxingzhi@vip.qq.com l_wang@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
/**
 * Model抽象类，封装ajax访问
 * @namespace Model.cAbstractModel
 */
define(['libs', 'cCoreInherit', 'cAjax', 'cUtilCommon', 'cUtilPath'], function (libs, cCoreInherit, cAjax, cUtilCommon, pathUtil) {

  var AbstractModel = new cCoreInherit.Class({

    __propertys__: function () {

      /**
       * 数据请求url, 必填
       * @var {string} Model.cAbstractModel.url 请求url
       */
      this.url = null;

      /**
       * 请求参数,必选,
       * @var {Object|Store} Model.cAbstractModel.param 请求参数
       */
      this.param = null;

      /**
       * 数据返回时的自定义格式化函数
       * @var {Function} [Model.cAbstractModel.dataformat] 数据返回时的自定义格式化函数
       */
      this.dataformat = null;

      /**
       * 验证返回结果正确性的函数集合
       * @var {Function} [Model.cAbstractModel.validates] 可选，存放用于验证的函数集合
       */
      this.validates = [];


      /**
       * 通讯协议,http/https
       * @var {String} [cAbstractModel.protocol=http] 可覆盖，通讯协议,http/https
       */
      this.protocol = (window.location.protocol.indexOf("https") > -1) ? "https" : "http";


      /**
       * 提交数据格式 json/form/jsonp
       * @var {String} [Model.cAbstractModel.contentType=json] 可选，提交数据格式
       */
      this.contentType = AbstractModel.CONTENT_TYPE_JSON;
      /**
       * 数据提交方式,post/get
       * @var {String} [Model.cAbstractModel.method] 可选， 提交数据的方法,post/get
       */
      this.method = 'POST';

      /**
       * 是否强制Ajax获取,
       * @var {boolean}  [Model.cAbstractModel.ajaxOnly=false] 是否强制Ajax获取
       */
      this.ajaxOnly = false;

      /**
       * 超时时间
       * @var {number} [Model.cAbstractModel.timeout=3000] 超时时间
       */
      this.timeout = 30000;

      //当前的ajax对象
      this.ajax;
      //是否主动取消当前ajax
      this.isAbort = false;

      //参数设置函数
      this.onBeforeCompleteCallback = null;
    },

    /**
     * @method initialize
     * @param {Object} obj
     * @description 复写自顶层Class的initialize，赋值队列
     */
    initialize: function (options) {
      this.assert();
      for (var key in options) {
        this[key] = options[key];
      }
    },


    assert: function () {
//      if (this.url === null) {
//        throw 'not override url property';
//      }
//      if (this.param === null) {
//        throw 'not override param property';
//      }
    },

    /**
     * 设置model属性值
     * @method Model.cAbstractModel.setAttr
     * @param {string} key 属性名，如url,protocol
     * @param {object} val 属性值
     */
    setAttr:function(key,val){
      this[key] = val;
    },

    /**
     * @method pushValidates
     * @param {function} handler
     * @description  将返回数据毁掉函数放到队列中
     */
    pushValidates: function (handler) {
      if (typeof handler === 'function') {
        this.validates.push($.proxy(handler, this));
      }
    },
    /**
     * 设置提交参数的值，如只传key一个参数，则置
     * @method Model.cAbstractModel.setParam
     * @param {string|object} key 参数
     * @param {object} val 参数值
     */
    setParam: function (key, val) {
      if (typeof key === 'object' && !val) {
        this.param = key;
      } else {
        this.param[key] = val;
      }
    },
    /**
     * 获取model的查询参数
     * @method Model.cAbstractModel.getParam
     * @returns {json|Store} param  查询参数
     */
    getParam: function () {
      return this.param;
    },

    /**
     *  获得查询结果结果
     *  @method Model.cAbstractModel.getResult
     *  @returns {json|Store} result  查询结果
     */
    getResult: function () {
      return this.result;
    },
    /**
     *  获得查询结果结果，建议使用Model.cAbstractModel.getResult
     *  @deprecated 建议使用Model.cAbstractModel.getResult
     *  @method Model.cAbstractModel.getResultStore
     *  @returns {json|Store} result  查询结果
     */
    getResultStore: function () {
      return this.getResult();
    },
    /**
     * 构建url请求地址，子类可复写，返回优先级为model.url是一个完整的url结构 -> Lizard.restfullApi|restfullApiHttps +model.url
     * -> 默认值m.ctrip.com/restapi/soa2+model.url
     * @method Model.cAbstractModel.buildurl
     */
    buildurl: function () {
      if (cUtilCommon.isUrl(this.url)) {
        return this.url;
      }
      var domain = 'm.ctrip.com/restapi/soa2',restfulApi = "";

      if( this.protocol == "http" && Lizard.restfullApi){
        restfulApi = Lizard.restfullApi;
      }else if(this.protocol == "https" && Lizard.restfullApiHttps){
        restfulApi = Lizard.restfullApiHttps;
      }

      if (restfulApi && cUtilCommon.isUrl(restfulApi)) {
        domain = pathUtil.parseUrl(restfulApi).hostname;
      }

      return this.protocol + '://' + domain + '/restapi' +  this.url;
    },


    /*
     * 发送数据请求数据
     * @method Model.cAbstractModel.execute
     * @param {Function} onComplete 取完的回调函数
     * @param {Function} onError 发生错误时的回调
     * @param {Boolean} [ajaxOnly] 可选，默认为false当为true时只使用ajax调取数据
     * @param {Boolean} [scope] 可选，设定回调函数this指向的对象
     * @param {Function} [onAbort] 可选，取消时会调用的函数
     */
    _execute: function (onComplete, onError, scope, onAbort, params) {

      // @description 定义是否需要退出ajax请求
      this.isAbort = false;

      // @description 请求数据的地址
      var url = this.buildurl();

      var self = this;

      var __onComplete = $.proxy(function (data) {
        //保存服务请求日志
        // cLog.serverLog(self.buildurl(), self.getParam(), data);

        if (this.validates && this.validates.length > 0) {

          // @description 开发者可以传入一组验证方法进行验证
          for (var i = 0, len = this.validates.length; i < len; i++) {
            var validates = this.validates[i](data);
            if ((typeof validates === 'boolean')) {
              if (!validates) {

                // @description 如果一个验证不通过就返回
                if (typeof onError === 'function') {
                  return onError.call(scope || this, data);
                } else {
                  return false;
                }
              }
            } else {
              if (validates && validates.overdue) {
                require([(Lizard.isHybrid || Lizard.isInCtripApp) ? 'cHybridMember' : 'cWebMember'], function (Member) {
                  Member.memberLogin({'param': 'from=' + encodeURIComponent(window.location.href)});
                });
                return;
              }
            }
          }
        }

        // @description 对获取的数据做字段映射
        var datamodel = typeof this.dataformat === 'function' ? this.dataformat(data) : data;

        if (typeof this.onBeforeCompleteCallback === 'function') {
          this.onBeforeCompleteCallback(datamodel);
        }

        if (typeof onComplete === 'function') {
          onComplete.call(scope || this, datamodel, data);
        }

      }, this);

      var __onError = $.proxy(function (e) {
        if (self.isAbort) {
          self.isAbort = false;

          if (typeof onAbort === 'function') {
            return onAbort.call(scope || this, e);
          } else {
            return false;
          }
        }

        if (typeof onError === 'function') {
          onError.call(scope || this, e);
        }

      }, this);

      // @description 从this.param中获得数据，做深copy
      var params = params || _.clone(this.getParam() || {});

      //设置contentType无效BUG，改动一，将contentType保存
      params.contentType = this.contentType;

      if (this.contentType === AbstractModel.CONTENT_TYPE_JSON) {

        // @description 跨域请求
        return this.ajax = cAjax.cros(url, this.method, params, __onComplete, __onError,this.timeout);
      } else if (this.contentType === AbstractModel.CONTENT_TYPE_JSONP) {

        // @description jsonp的跨域请求
        return this.ajax = cAjax.jsonp(url, params, __onComplete, __onError,this.timeout);
      } else {

        // @description 默认post请求
        return this.ajax = cAjax.post(url, params, __onComplete, __onError,this.timeout);
      }
    },

    /**
     * 发送数据请求数据
     * @method Model.cAbstractModel.execute
     * @param {Function} onComplete 取完的回调函数
     * @param {Function} onError 发生错误时的回调
     * @param {Boolean} [ajaxOnly] 可选，默认为false当为true时只使用ajax调取数据
     * @param {Boolean} [scope] 可选，设定回调函数this指向的对象
     * @param {Function} [onAbort] 可选，取消时会调用的函数
     */
    execute: function (onComplete, onError, scope, onAbort, params) {
      this._execute(onComplete, onError, scope, onAbort, params);
    },
    /**
     * 终止请求
     * @method Model.cAbstractModel.abort
     */
    abort: function () {
      this.isAbort = true;
      this.ajax && this.ajax.abort && this.ajax.abort();
    }

  });

  /**
   * Model的单例获取方式
   * @method Model.cAbstractModel.getInstance
   * @returns {*}
   */
  AbstractModel.getInstance = function () {
    if (this.instance instanceof this) {
      return this.instance;
    } else {
      return this.instance = new this;
    }
  };

  /**
   * @const {string} Model.cAbstractModel.CONTENT_TYPE_JSON JSON方式提交请求
   */
  AbstractModel.CONTENT_TYPE_JSON = 'json';
  /**
   * @const {string} Model.cAbstractModel.CONTENT_TYPE_FORM FORM方式提交请求
   */
  AbstractModel.CONTENT_TYPE_FORM = 'form';
  /**
   * @const {string} Model.cAbstractModel.CONTENT_TYPE_JSONP JSONP方式提交请求
   */
  AbstractModel.CONTENT_TYPE_JSONP = 'jsonp';

  return AbstractModel;
});


