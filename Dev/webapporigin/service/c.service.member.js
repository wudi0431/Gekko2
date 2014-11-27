/**
 * @File c.member
 * @Description: 成员登录
 * @author shbzhang@ctrip
 * @date 2014-09-22 13:45:07
 * @version V1.0
 */

/**
 * 与用户登录相关的工具方法
 * @namespace Service.cMemberService
 */
define([(Lizard.isHybrid || Lizard.isInCtripApp) ? 'cHybridMember' : 'cWebMember', 'cUserStore'], function (Member, UserStore) {

  /**
   * 判断当前用户是否登陆
   * @method Service.cMemberService.isLogin
   * @returns {Object|boolean} isLogin 当前用户是否登陆
   */
  Member.isLogin = UserStore.getInstance().isLogin;

  /**
   * 返回用户信息
   * @method Service.cMemberService.getUser
   * @returns {Object} userinfo 用户信息
   */
  Member.getUser = UserStore.getInstance().getUser;

  /**
   * 返回当前登陆用户的用户名
   * @method Service.cMemberService.getUserName
   * @returns {String} UserName 用户名
   */
  Member.getUserName = UserStore.getInstance().getUserName;


  /**
   * 返回当前登陆用户的ID
   * @method Service.cMemberService.getUserId
   * @returns {*|string} userId 用户Id
   */
  Member.getUserId = UserStore.getInstance().getUserId;


  return Member;
})