/**
 * @File c.hybrid.memeberServic
 * @Description hybird下的登录服务
 * @author shbzhang@ctrip.com
 * @date  2014/09/19 15:06
 * @version V1.0
 */

/**
 * 与用户登录相关的工具方法
 */
define(['cHybridFacade'], function (Facade) {
  "use strict";
  var HybridMember = {
    /**
     * 跳转至用户登录
     * @method memberlogin
     * @memberof  Service.cMemberService
     * @param {object} options
     * @param {boolean} options.isShowNonMemberLogin 是否用户登录界面显示非会员登录入口
     * @param {function} [options.callback] 仅hybrid可用 登录成功失败的回调
     * @param {string} [options.from] 仅web可用，登录成功跳转页
     * @param {string} [options.backurl] 仅web可用，登录页面回退跳转页
     */
    memberLogin: function (options) {
      Facade.request({ name: Facade.METHOD_MEMBER_LOGIN, callback: options.callback, isShowNonMemberLogin: options.isShowNonMemberLogin });
    },
    /**
     * 非会员登录
     * @method nonMemberLogin
     * @memberof  Service.cMemberService
     * @param {object} options
     * @param {function} options.callback 非会员登录成功的回调
     */
    nonMemberLogin: function (options) {
      Facade.request({ name: Facade.METHOD_NON_MEMBER_LOGIN, callback: options.callback });
    },

    /**
     * 用户注册
     * @method register
     * @memberof  Service.cMemberService
     * @param {object} options
     * @param {function} options.callback 注册成功的回调
     */
    register: function (options) {
      Facade.request({ name: Facade.METHOD_REGISTER, callback: options.callback });
    },

    /**
     * 用户自动登录
     * @method autoLogin
     * @memberof  Service.cMemberService
     * @param {object} options
     * @param {function} options.callback 自动登录成功的回调
     */
    autoLogin: function (options) {
      Facade.request({ name: Facade.METHOD_AUTO_LOGIN, callback: options.callback });
    },


    /**
     * H5登陆完成，将注册信息告知Native
     * @method finishedLogin
     * @memberof  Service.cMemberService
     * @param {object} options
     * @param {object} options.userInfo H5登录用户数据
     * @param {function} options.callback Native登录成功的回调
     */
    finishedLogin: function (options) {
      Facade.request({ name: Facade.METHOD_APP_FINISHED_LOGIN, userInfo: options.userInfo, callback: options.callback });
    }
  };

  return HybridMember;
});
