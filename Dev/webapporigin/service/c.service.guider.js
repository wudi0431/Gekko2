/**
 * @File c.guider.js
 * @Description: 屏蔽hybrid与web环境的不同
 * @author shbzhang@ctrip.com
 * @date 2014-09-24 11:06:12
 * @version V1.0
 */

/**
 * 屏蔽hybrid与web环境的不同,只在Hybrid的调用的方式, 建议使用cHybridShell代替
 * @namespace Service.cGuiderService
 */
define([(Lizard.isHybrid || Lizard.isInCtripApp) ? 'cHybridGuider' : 'cWebGuider'], function (TGuider) {

  /*
   * guilder所有的实现方法
   */
  var metheds = [
    'jump', 'apply', 'call', 'init', 'log', 'print', 'callService', 'backToLastPage',
    'checkUpdate', 'recommend', 'addWeixinFriend', 'showNewestIntroduction', 'register',
    'create', 'home', 'jumpHotel', 'checkAppInstall', 'callPhone', 'cross', 'refreshNative',
    'copyToClipboard', 'readFromClipboard', 'shareToVendor', 'downloadData', 'encode',
    'chooseContactFromAddressbook', 'hideLoadingPage', 'showLoadingPage', 'choose_invoice_title',
    'get_device_info', 'show_voice_search', 'choose_photo', 'finished_register', 'app_call_system_share',
    'app_check_network_status', 'app_check_android_package_info', 'app_log_google_remarkting', 'app_read_verification_code_from_sms',
    'app_h5_page_finish_loading','registerAppearEvent','unregisterAppearEvent','save_photo',
    {file: ['isFileExist', 'deleteFile', 'getCurrentSandboxName', 'getFileSize', 'makeDir', 'readTextFromFile', 'writeTextToFile']},
    {pipe: ['socketRequest', 'httpRequest', 'abortRequest', 'abortSocketRequest']},
    {pay: ['checkStatus', 'payOut', 'callPay']},
    {encrypt: ['ctrip_encrypt', 'ctrip_decrypt']}
  ]

  var Guider = {},emptyFun = function(){return false};

  //先将空方法实现
  _.each(metheds,function(item){
    if(_.isString(item)){
      Guider[item] = emptyFun;
    }else if(_.isObject(item)){
      var keys = _.keys(item);
      _.each(keys,function(key){
        Guider[key] = {};
        _.each(item[key],function(subItem){
          Guider[key][subItem] = emptyFun;
        })
      })
    }
  })

  //将各环境的实现继承出来
  _.extend(Guider,TGuider);
  return Guider;
})