/**
 * @File c.model
 * @Description: Model类,封装SOA2访问
 * @author ouxingzhi@vip.qq.com l_wang@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
/**
 * Model类,继承自cAbstractModel,封装SOA2访问，和Store缓存
 * @namespace Model.cModel
 * @extends Model.cAbstractModel
 * @example
 * define('cCoreInherit','cMmodel',function(cCoreInherit,cModel)(){
 *   DemoModel = new cCoreInherit.Class(cModel, {
 *       __propertys__: function () {
 *          this.url = '/Taxi/MarketingInfo/Query';
 *      },
 *      initialize: function ($super, options) {
 *          $super(options);
 *      }
 *   });
 *
 *   DemoModel.execute(function(data){
 *    console.log('success handler');
 *   },function(e){
 *    console.log('error handler')
 *   },true);
 * })
 *
 */
define(['cCoreInherit', 'cAbstractStore', 'cHeadStore','cUserStore','cMarketStore','cAbstractModel', 'cUtilObject'],
  function (cCoreInherit, AbstractStore, cHeadStore, cUserStore,cMarketStore,baseModel, cObject) {

    var Model = new cCoreInherit.Class(baseModel, {
	    /**
	     * @method __propertys__
	     * @description 复写自顶层Class的__propertys__，初始化队列
	     * @private
	     */
      __propertys__: function () {
        /**
         * @var {boolean} [Model.cModel.usehead=true] 报文是否加入head部分
         */
        this.usehead = true;
        //head数据
        this.headStore = cHeadStore.getInstance();
        //user 
        this.userStore = cUserStore.getInstance();
        //营销数据
        this.salesStore = cMarketStore.SalesStore.getInstance();
        /**
         * @var {object} [Model.cModel.headinfo] 自定义head结构
         */
        this.headinfo = null;
        /*
         * 查询结果
         * @var {object|store} [result] 查询结果
         */
        this.result = null;

        /**
         * 请求如果返回auth是否，是否跳转至登录页
         * @var {boolean} [Model.cModel.checkAuth=true]
         */
        this.checkAuth = true;
      },
	    /**
	     * @method initialize
	     * @param $super
	     * @param options
	     * @description 复写自顶层Class的initialize，赋值队列
	     */
      initialize: function ($super, options) {
        $super(options);
      },


	    /**
       * 用户数据，返回数据存储的tag
       * @method Model.cModel.getTag
	     * @returns {*|JSON.stringify}
	     */
      getTag: function () {
        var params = _.clone(this.getParamData() || {});
        return JSON.stringify(params);
      },
      /**
       * 获取查询参数，如果param设置的一个Store,则返回store的值
       * @method Model.cModel.getParamData
       * @returns {*}
       */
      getParamData: function () {
        return this.param instanceof AbstractStore ? this.param.get() : this.param;
      },


      /**
       * @method Model.cModel.execute
       * @param onComplete 取完的回调函 传入的第一个参数为model的数第二个数据为元数据，元数据为ajax下发时的ServerCode,Message等数
       * @param onError 发生错误时的回调
       * @param ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
       * @param scope 可选，设定回调函数this指向的对象
       * @param onAbort 可选，但取消时会调用的函数
       * @description 取model数据
       */
      execute: function (onComplete, onError, ajaxOnly, scope, onAbort) {
        //每次请求前设置用户Auth
        this.headStore.setAuth(this.userStore.getAuth());
        //设置头部的sid
        this.headStore.setAttr('sid',this.salesStore.getAttr('sourceid')||'8888');

        var params = _.clone(this.getParamData() || {});

        //验证错误码
        this.pushValidates(function (data) {
          //兼容soa2.0 和 restful api
          var rsphead = this._getResponseHead(data);
          if (rsphead.overdue) {
            return {'overdue': rsphead.overdue};
          }
          return rsphead.success;

        });

        // @description 业务相关，获得localstorage的tag
        var tag = this.getTag();
        // @description 业务相关，从localstorage中获取上次请求的数据缓存
        var cache = this.result && this.result.get(tag);

        //如果没有缓存，或者指定网络请求，则发起ajax请求
        if (!cache || this.ajaxOnly || ajaxOnly) {

          if (this.method.toLowerCase() !== 'get' && this.usehead && this.contentType !== baseModel.CONTENT_TYPE_JSONP) {
            params.head = this.headStore.get();
            params.head.time = (new Date()).getTime();
          } else if (this.method.toLowerCase() !== 'get' && !this.usehead && this.contentType !== baseModel.CONTENT_TYPE_JSONP) {
            if (this.headinfo) {
              params.head = this.headinfo;
            }
          }

          this.onBeforeCompleteCallback = function (datamodel) {
            if (this.result instanceof AbstractStore) {
              //soa 数据量大,为精简locastorage,去掉ResponseStatus部分 shbzhang 2014.4.17
              try {
                //              if(datamodel.ResponseStatus){
                //                delete datamodel.ResponseStatus;
                //              }
              } catch (e) {

              }
              this.result.set(datamodel, tag);
            }
          }
          //调用父类的数据请求方法
          this._execute(onComplete, onError, scope, onAbort, params)

        } else {
          if (typeof onComplete === 'function') {
            onComplete.call(scope || this, cache);
          }
        }
      },
	    /**
       * 发送数据请求
       * @method Model.cModel.excute
       * @deprecated 建议使用Model.cModel.execute
	     * @param onComplete 取完的回调函 传入的第一个参数为model的数第二个数据为元数据，元数据为ajax下发时的ServerCode,Message等数
	     * @param onError 发生错误时的回调
	     * @param ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
	     * @param scope 可选，设定回调函数this指向的对象
	     * @param onAbort 可选，但取消时会调用的函数
	     */
      excute: function (onComplete, onError, ajaxOnly, scope, onAbort) {
        this.execute(onComplete, onError, ajaxOnly, scope, onAbort);
      },

      /*
       * 返回response head,兼容restful和SOA2
       * @param {Object} data 返回数据
       * @return {Object} head 格式为{'success':true}
       * @private
       */
      _getResponseHead: function (data) {
        var fromSOA = !!data.ResponseStatus;
        var head = fromSOA ? data.ResponseStatus : data.head,
           success = false, overdue = false;
        if (fromSOA && head) {
          var ack = head.Ack;
          //酒店模块报错ack返回值是1
          if (ack === 'Failure' || ack == 1) {
            var errors = head.Errors;
            if ((errors instanceof Array) && errors.length > 0) {
              //考虑到可能存在多个error的情况
              for (var i = 0, error; i < errors.length; i++) {
                error = errors[i];
                if (error && error.ErrorCode && error.ErrorCode == 'MobileRequestFilterException') {
                  //auth 过期，用户重新登录 2.01 09 16 modefy by byl  此处添加BU 控制，判断是否调用登陆界面
                  if (this.checkAuth) {
                    overdue = true;
                    //在此将所有的auth信息都置空
                    this.headStore.setAuth("");
                    this.userStore.removeUser();
                  }
                  break;
                }
              }
            }
          }

          //SOA2.0的成功判断增加枚举类型
          success = head.Ack === 'Success' || head.Ack == '0';
        } else {
          success = (head && head.errcode === 0);
        }
        return {
          'success': success,
          'overdue': overdue
        };
      },
      
      /**
       * 设置model 的param对象，有两种使用情况
       * 1. 当只传一个参数key，且key为对象，此时key为要设置的值
       * 2. 传两个参数，第一个参数key为字符串(允许.分隔),第二个参数val为要设置的值
       * 注意两次调用setParam,两次参数会做合并处理
       * 
       * @method Model.cModel.setParam
       * @param {Object|string} key 参数，
       * @param {Object} [val] 参数值
       */
      setParam: function (key, val) {
        var param = {};
        if (typeof key === 'object' && !val) {
          param = key;
        } else {
          param[key] = val;
        }
        for (var i in param) {
          if (this.param instanceof AbstractStore) {
            this.param.setAttr(i, param[i]);
          } else {
            cObject.set(this.param, i, param[i]);
          }
        }
      },

      /**
       * 清空结果数据
       * @method Model.cModel.clearResult
       */
      clearResult: function () {
        if (this.result && typeof this.result.remove === 'function') {
          this.result.remove();
        } else {
          this.result = null;
        }
      }
    });


    return Model;
  });