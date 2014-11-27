/*
 * @File c.user.model
 * @Description: 封装H5的用户登录操作
 * @author ouxingzhi@vip.qq.com l_wang@ctrip.com
 * @date  2013/6/23 16:26:12
 * @version V1.0
 */
/*
 * @author cmli@ctrip.com / oxz欧新志 <ouxz@Ctrip.com>
 * @namespace cUserModel
 */
define(['cCoreInherit', 'cModel', 'cCommonStore', 'cUtilCommon'],
  function(cCoreInherit, cModel, CommonStore, cUtilCommon) {

    "use strict";

    var UserStore = CommonStore.UserStore.getInstance();
    var HeadStore = CommonStore.HeadStore.getInstance();

    var UserModel = {};

	  /*
	   * 非会员登录
	   * @namespace cUserModel.NotUserLoginModel
	   */
    UserModel.NotUserLoginModel = new cCoreInherit.Class(cModel, {

      /**
       * @private
       * @method cUserModel.NotUserLoginModel.__propertys__
       * @returns void
       */
      __propertys__: function() {
        this.url = "/html5/Account/NonUserLogin";
        this.param = {};
        //this.baseurl = cModel.baseurl.call(this);
        this._abortres = {};
        this.isAbort = false;
      },

      /**
       * @private
       * @method cUserModel.NotUserLoginModel.initialize
       * @param {function} $super
       * @param {object} options
       * @description 对象初始化工作
       * @returns void
       */
      initialize: function($super, options) {
        $super(options);
      },

      /**
       * @public
       * @method cUserModel.NotUserLoginModel.excute
       * @param {function} onComplete 取完的回调函
       * @param {function} onError 发生错误时的回调
       * @param {boolean} ajaxOnly 可选，默认为false当为true时只使用ajax调取数据
       * @param {boolean} scope 可选，设定回调函数this指向的对象
       * @param {function} onAbort 可选，但取消时会调用的函数
       * @description 向服务端做非会员登陆
       * @returns void
       */
      excute: function(onComplete, onError, ajaxOnly, scope, onAbort) {
        //add by byl 此处添加，如果已经是非会员登录，则不重新调用非会员登录，并且执行成功的回调函数
        var userData = UserStore.getUser();
        if(userData && !!userData.Auth && !userData.IsNonUser){
          if(typeof onComplete === 'function'){
            onComplete.call(scope, UserStore.getUser());
          }
          return;
        }
        this.isAbort = false;
        // var url = 'http://' + this.baseurl.domain + this.url;
        var host = window.location.host
        if(host == 'localhost'){
          host = 'm.fat19.qa.nt.ctripcorp.com';
        }
        var url = 'http://' + host + this.url;
		
        var successCallback = function(data) {
          if (data.ServerCode == 1 && data.Data) {
            UserStore.setUser(data.Data);

            if (typeof onComplete === 'function') {
              onComplete.call(scope, data);
            }
          } else {
            if (typeof onError === 'function') {
              onError.call(scope);
            }
          }
        };

        var errorCallback = function() {
          if (this.isAbort) {
            if (typeof onAbort === 'function') {
              onAbort.call(scope);
            }

            this.isAbort = false;
            return;
          }

          if (typeof onError === 'function') {
            onError.apply(scope, arguments);
          }
        };

        this._abortres = $.ajax({
          'type': 'get',
          'url': url,
          'dataType': 'json',
          'crossDomain': true,
          'success': $.proxy(successCallback, this),
          'error': $.proxy(errorCallback, this),
          'timeout': 25000
        });
      },

      /**
       * @description 终止请求
       * @method cUserModel.NotUserLoginModel.abort
       * @returns void
       */
      abort: function() {
        this.isAbort = true;
        if (this._abortres && typeof this._abortres.abort === 'function') {
          this._abortres.abort();
        }
      }
    });

    /*
     * 用户登录model
     * @namespace cUserModel.UserLoginModel
     */
    UserModel.UserLoginModel = new cCoreInherit.Class(cModel, {
      /**
       * @private
       * @method cUserModel.UserLoginModel.__propertys__
       * @returns void
       */
      __propertys__: function() {
        this.param = {};
        this.url = '10090/GetUserInfoToH5.json';
      },
      /**
       * @private
       * @method cUserModel.UserLoginModel.initialize
       * @param {function} $super
       * @param {object} options
       * @description 对象初始化工作
       * @returns void
       */
      initialize: function($super, options) {
        $super(options);
        this.baseurl = this.seturl();
      },
	    /*
	     * @method cUserModel.UserLoginModel.seturl
	     * @description 获取用户登录页面的服务器地址，供内部使用
	     */
      seturl:function(){
        var host = window.location.host,
          path = 'restapi/soa2/',
          domain = "m.ctrip.com";
        if (host.match(/^m\.ctrip\.com/i)){
          domain = "m.ctrip.com";
        }else if (host.match(/\.uat\.qa/i)){
          domain = "gateway.m.uat.qa.nt.ctripcorp.com";
        }else if (host.match(/\.fat/i)){
          domain = "gateway.m.fws.qa.nt.ctripcorp.com";
        }
        return {
          'domain': domain,
          'path': path
        }
      },
      
      buildurl: function () { 
        if (cUtilCommon.isUrl(this.url)) {
          return this.url;
        }  
        return this.protocol + '://' + this.baseurl.domain + '/restapi/soa2/' +  this.url;
      }
    });
    return UserModel;
  });