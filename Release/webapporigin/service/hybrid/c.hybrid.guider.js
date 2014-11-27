/**
 * @description 与hybrid 相关的操作
 * @File c.hybrid.guider
 * @author shbzhang@ctrip.com
 * @date  2014-09-22 13:47:55
 * @version V1.0
 */
/**
 * @descrption 与hybrid 相关的操作
 */
define(['cHybridFacade', 'cHybridShell'], function (Facade, Hish) {
  "use strict";

  var HybridGuider = {
    /**
     * @description Hybrid页面，打开链接URL地址，兼容App和浏览器
     * @method Service.cGuiderService.jump
     * @param {object} options 输入参数
     * @example
     * 参数：
     * {
     *    targetModel：refresh，//{String }refresh|app|h5|browser|open|open_relative
     *    title:"",// {String} 标题栏 当targetModel = 'h5'    时，新打开的H5页面的title
     *    url:''  ,  // {String } 需要打开的URL，可以为ctrip://,http(s)://,file://等协议的URL
     *    pageName:'' , //{String} 当targetModel = 'refresh'|'h5'|'open'时，本页面，或者新打开的H5页面，此时pageName有效，pageName当作H5页面唯一标识，可用于刷新页面；5.6版本加入
     *    isShowLoadingPage:false  //{boolean} 开启新的webview的时候，是否加载app的loading
     * }
     */
    jump: function (options) {
      var model = {
        refresh: function () {
          Facade.request({ name: Facade.METHOD_OPEN_URL, targetMode: 0, title: options.title, pageName: options.pageName });
        },
        app: function () {
          if (options && options.module) {
            var openUrl = Facade.getOpenUrl(options);
            Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: openUrl, targetMode: 1, title: options.title, pageName: options.pageName });
          } else if (options && options.url) {
            Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: options.url, targetMode: 1, title: options.title, pageName: options.pageName });
          }
        },
        h5: function () {
          if (options && options.url) {
            Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: options.url, targetMode: 2, title: options.title, pageName: options.pageName, isShowLoadingPage: options.isShowLoadingPage});
          }
        },
        browser: function () {
          if (options && options.url) {
            Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: options.url, targetMode: 3, title: options.title, pageName: options.pageName, isShowLoadingPage: options.isShowLoadingPage});
          }
        },
        open: function () {
          if (options && options.url) {
            Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: options.url, targetMode: 4, title: options.title, pageName: options.pageName, isShowLoadingPage: options.isShowLoadingPage});
          }
        },
        open_relative: function () {
          if (options && options.url) {
            Facade.request({ name: Facade.METHOD_OPEN_URL, openUrl: options.url, targetMode: 5, title: options.title, pageName: options.pageName, isShowLoadingPage: options.isShowLoadingPage});
          }
        }
      };

      if (typeof model[options.targetModel] === 'function') {
        model[options.targetModel]();
      }
    },

	  /**
	   * 根据环境不同执行不同的函数分支
	   * @method Service.cGuiderService.apply
	   * @param {Object} options 输入参数
     * @param {function} [options.hybridCallback] hybrid环境下的执行函数
     * @param {function} [options.callback] web环境下的执行函数
	   * @example
	   * //参数
	   * {
	   *   hybridCallback：function(){}
	   *  }
	   */
    apply: function (options) {
      if (_.isObject(options) && _.isFunction(options.hybridCallback)) {
        options.hybridCallback();
      }
    },

	  /**
	   * @description  进入H5模块，初始化数据 H5接收到web_view_did_finished_load的回调之后，调用该函数，初始化数据会通过callback传递给H5
	   * @method Service.cGuiderService.init
	   * @param {object} options 输入参数
     * @param {function} options.callback 回调
	   * @example
	   * //参数：
	   * {
	   *    version:5.8，callback:function(){}
	   * }
	   */
    init: function (options) {
      if (options && window.parseFloat(options.version) < 5.2) {
        Facade.request({ name: Facade.METHOD_ENTRY, callback: options.callback });
      } else {
        Facade.request({ name: Facade.METHOD_INIT, callback: options.callback });
      }
    },

	  /**
	   * @description,上传日志至服务端, H5页面调用该函数，需要将增加的event_name告知native，native需要整理纪录
	   * @method Service.cGuiderService.log
	   * @param {object} options 输入参数
     * @param {string} name 日志
	   * @example
	   * //参数：
	   * {name:""}
	   */
    log: function (options) {
      Facade.request({ name: Facade.METHOD_LOG_EVENT, event_name: options.name });
    },

	  /**
	   * @description 将log写入到native的日志界面
	   * @method Service.cGuiderService.print
	   * @param {object} options 输入参数
     * @param {string} options.log 需要打印打log
     * @param {string} [options.result] 上一句log执行的结果，可以为空,打印的时候会自动换行，加入时间
	   * @example
	   * //参数：
	   * {log:"",result:""}
	   */
    print: function (options) {
      Facade.request({ name: Facade.METHOD_NATIVE_LOG, log: options.log, result: options.result });
    },

	  /**
	   * @description 拨打ctrip呼叫中心号码
	   * @method Service.cGuiderService.callService
	   */
    callService: function () {
      Facade.request({ name: Facade.METHOD_CALL_SERVICE_CENTER });
    },

	  /**
	   * @description 退回到H5页面的上一个页面，离开H5. v5.3开始支持带参数给上一个H5页面
	   * @method Service.cGuiderService.backToLastPage
	   * @param {Object} options 输入参数
     * @param {object} options.param 参数
     * @since v5.3
	   * @example
	   * //参数：
	   * {
	   *    param:Object //跳转到上一个页面的参数
	   * }
	   */
    backToLastPage: function (options) {
      var param = options ? options.param : '';
      Facade.request({ name: Facade.METHOD_BACK_TO_LAST_PAGE, param: param });
    },

	  /**
	   * @description 检查App的版本更新
	   * @method Service.cGuiderService.checkUpdate
	   */
    checkUpdate: function () {
      Facade.request({ name: Facade.METHOD_CHECK_UPDATE });
    },

	  /**
	   * @description 推荐携程旅行给好友
	   * @method Service.cGuiderService.recommend
	   */
    recommend: function () {
      Facade.request({ name: Facade.METHOD_RECOMMEND_APP_TO_FRIEND });
    },

	  /**
	   * @description 添加微信好友
	   * @method Service.cGuiderService.addWeixinFriend
	   */
    addWeixinFriend: function () {
      Facade.request({ name: Facade.METHOD_ADD_WEIXIN_FRIEND });
    },

	  /**
	   *  @description 查看最新版本功能介绍
	   *  @method Service.cGuiderService.showNewestIntroduction
	   */
    showNewestIntroduction: function () {
      Facade.request({ name: Facade.METHOD_SHOW_NEWEST_INTRODUCTION });
    },

	  /**
	   * @description 自定义注册需要hybrid回调执行的方法（确保此方法会在hybrid中执行，不然不会执行回调函数
	   * @method Service.cGuiderService.register
	   * @param {Object} options 输入参数
     * @param {string} options.tagname 事件名
     * @param {string} options.callback 回调
	   * @example
	   * //参数:
	   * {tagname:"non_member_login",callback:function(){}}
	   */
    register: function (options) {
      if (options && options.tagname && options.callback) {
        Facade.register({ tagname: options.tagname, callback: options.callback });
      }
    },

	  /**
	   * @description 进入H5模块，初始化数据 H5接收到web_view_did_finished_load的回调之后，调用该函数，初始化数据会通过callback传递给H5
	   * @method Service.cGuiderService.create
	   */
    create: function () {
      Facade.init();
    },

	  /**
	   * @description 退回到首页，离开H5
	   * @method Service.cGuiderService.home
	   */
    home: function () {
      Facade.request({ name: Facade.METHOD_BACK_TO_HOME });
    },


	  /**
	   * @description 检查是否安装App
	   * @method Service.cGuiderService.checkAppInstall
	   * @param {Object} options 输入参数
     * @param {string} options.url 尝试打开的URL
     * @param {string} options.callback 返回检查的回调
	   * @example
	   * //参数:
	   * {
	   *    url:"ctrip://wireless", //尝试打开的URL
	   *    packageName:"com.ctrip.view" //app的包名，android使用
	   *    callback: function(data){ //回调数据：
	   *      var data =  {
	   *       isInstalledApp:false //布尔值返回是否有安装
	   *      }
	   *    }
	   */
    checkAppInstall: function (options) {
      Facade.request({ name: Facade.METHOD_CHECK_APP_INSTALL, url: options.url, package: options.package, callback: options.callback });
    },

	  /**
	   * @description 拨打电话
	   * @method Service.cGuiderService.callPhone
	   * @param {Object} options 输入参数
     * @param {object} options.tel  电话号码
	   * @example
	   * //参数：
	   *  {
	   *    tel:"13800138000"
	   *  }
	   */
    callPhone: function (options) {
      Facade.request({ name: Facade.METHOD_CALL_PHONE, tel: options.tel });
    },

	  /**
	   * @description H5跨模块/站点跳转
	   * @method Service.cGuiderService.cross
	   * @param {Object} options 输入参数
     * @param {string} options.path 模块名称，如hotel, car, myctrip,
     * @param {string} optiosn.param  作为URL，拼接在path后面的页面和其它参数 index.html#cashcouponindex?cash=xxxx
	   * @example
	   * //参数：
	   * {
	   *    param:"index.html#cashcouponindex?cash=xxxx",
	   *    path:"myctrip"
	   * }
	   */
    cross: function (options) {
      Facade.request({ name: Facade.METHOD_CROSS_JUMP, param: options.param, path: options.path });
    },

	  /**
	   * @description H5通知Native刷新
	   * @method Service.cGuiderService.refreshNative
	   * @param {Object} options 输入参数
     * @param {string} package 要刷新的页面名字,该字段需要H5和native共同约定，H5调用之后，native需要捕获该名字的boardcast/notification
     * @param {string} json //刷新该页面需要的参数
	   * @example
	   * //参数：
	   * {
	   *    pakage:"xxxxPageName"
	   *    json:"xxxx_json_string"
	   * }
	   */
    refreshNative: function (options) {
      Facade.request({ name: Facade.METHOD_REFRESH_NATIVE, package: options.package, json: options.json });
    },

	  /**
	   * @description 复制文字到粘贴板
	   * @method Service.cGuiderService.copyToClipboard
	   * @param {Object} options 输入参数
     * @param {string} options.content 文字内容
	   * @example
	   * //参数：
	   * {
	   *    content:"" // String 需要复制的文字
	   * }
	   */
    copyToClipboard: function (options) {
      Facade.request({ name: Facade.METHOD_COPY_TO_CLIPBOARD, content: options.content });
    },
	  /**
	   * @description 从粘贴板读取复制的文字
	   * @method Service.cGuiderService.readFromClipboard
	   * @param {Object} options 输入参数
     * @param {function} callback 读取后回调
	   * @example
	   * //参数：
	   * {
	   *    callback:function(content){
	   *      //content 回调函数
	   *    }
	   * }
	   */
    readFromClipboard: function (options) {
      Facade.request({ name: Facade.METHOD_READ_FROM_CLIPBOARD, callback: options.callback });
    },

	  /**
	   * @description 调用App的分享
	   * @method Service.cGuiderService.shareToVendor
	   * @param {Object} options 输入参数
     * @param {string} options.imgUrl 将要分享的图片相对路径，相对webapp的路径
     * @param {string} options.text 需要分享的文字,微博分享文字限制在140
     * @param {string} options.title 需要分享的标题, v5.4开始支持该字段，微信和email支持
     * @param {string} options.linkUrl 需要分享的链接, v5.4开始支持该字段
     * @param {boolean} options.isIOSSystemShare 是否支持IO6系统
	   * @example
	   * //参数：
	   * {
	   *    imgUrl:'',
	   *    text:'',
	   *    title:'',
	   *    linkUrl:','
	   *    isIOSSystemShare:false //是否是ios系统
	   * }
	   */
    shareToVendor: function (options) {
      Facade.request({ name: Facade.METHOD_SHARE_TO_VENDOR, imgUrl: options.imgUrl, text: options.text, title: options.title, linkUrl: options.linkUrl, isIOSSystemShare: options.isIOSSystemShare });
    },

	  /**
	   * @description 根据URL下载数据
	   * @method Service.cGuiderService.downloadData
	   * @param {Object} options 输入参数
     * @param {string} options.url 下载url
     * @param {string} options.suffix 需要保存文件
     * @param {boolean} [options.isIgnoreHttpsCertification=false] 是否忽略非法的HTTPS证书
     * @param {string} options.callback 回调
	   * @example
	   * //参数：
	   * {
	   *    url:"",//需要下载内容的URL
	   *    //data.downloadUrl 下载地址
	   *    //data.savedPath 保存地址
	   *    //data.isSuccess 是否成功
	   *    //error_code 错误码 param_error/download_fail
	   *    callback:function(data, error_code){
	   *      data = {
	   *
	   *      },
	   *      error_code  //错误码
	   *    },
	   *    suffix:'' //保存文件的后缀
	   * }
	   * //回调参数,此参数成功时只回调param,错误时可获取error_code
	   * //成功：
	   * {
	   *    downloadUrl:"http://www.baidu.com/bdlogo.gif",
	   *    savedPath:"../wb_cache/pkg_name/md5_url_hash", false
	   *  }
	   *  //错误error_code:"xxxxx",//param_error,download_faild
	   */
    downloadData: function (options) {
      Facade.request({ name: Facade.METHOD_DOWNLOAD_DATA, url: options.url, callback: options.callback, suffix: options.suffix });
    },

	  /**
	   * @description base64 UTF8编码
	   * @method Service.cGuiderService.encode
	   * @param {Object} options 输入参数
     * @param {string} options.info 需要做base64 encode的字符串
     * @param {function} options.callback 编码完成后执行的回调方法
	   * @example
	   * //参数：
	   * {
	   *    callback:function(data){}, //编码完成后执行的回调方法
	   *    info:'' //需要做base64 encode的字符串
	   * }
	   * //回调参数：
	   *  {
     *      inString:"xxxxxx", //传入的String
     *      encodedString:"eHh4eHh4", // 编码之后的String
     *  }
	   */
    encode: function (options) {
      if (options && options.mode === 'base64') {
        Facade.request({ name: Facade.METHOD_ENCRYPT_BASE64, callback: options.callback, info: options.info });
      }
    },

	  /**
	   * @description 从通讯录选取联系人
	   * @method Service.cGuiderService.chooseContactFromAddressbook
	   * @param {Object} options 输入参数
     * @param {function} options.callback 选取联系人之后的回调
	   * @example
	   * //回调参数:
	   *{
     *  name:"xxx",
     *  phoneList:[{"家庭":1320000000}, {"工作":021888888888}], //手机号码有一个标签＋号码
     *  emailList:[{"家庭":a@gmail.com}, {"工作":b@yahoo.com}]  //email有标签＋号码
	   *}
	   */
    chooseContactFromAddressbook: function (options) {
      Facade.request({ name: Facade.METHOD_CHOOSE_CONTACT_FROM_ADDRESSBOOK, callback: options.callback });

    },

	  /**
	   * @description 隐藏native的loading界面
	   * @method Service.cGuiderService.hideLoadingPage
	   */
    hideLoadingPage: function () {
      Facade.request({ name: Facade.METHOD_HIDE_LOADING_PAGE });
    },

	  /**
	   * @description 显示native的loading界面
	   * @method Service.cGuiderService.showLoadingPage
	   */
    showLoadingPage: function () {
      Facade.request({ name: Facade.METHOD_SHOW_LOADING_PAGE });
    },

	  /**
	   * @description 选择常用发票title
	   * @method Service.cGuiderService.choose_invoice_title
	   * @param {Object} options 输入参数
     * @param {string} options.title 标题
     * @param {function} options.callback 回调函数
	   * @example
	   * //参数：
	   * {
	   *    callback:function(){},// {function}回调函数
	   *    title:"" // {String} 当前已经选择好的发票title
	   * }
	   * //回调参数：
	   *  {
     *     selectedInvoiceTitle:"所选择的发票title"
     *   }
	   */
    choose_invoice_title: function (options) {
      Facade.request({ name: Facade.METHOD_APP_CHOOSE_INVOICE_TITLE, callback: options.callback, title: options.title });
    },

	  /**
	   * @description 获取设备相关信息，相关部门需要
	   * @method Service.cGuiderService.get_device_info
	   * @param {Object} options 输入参数
     * @param {function} options.callback 回调
	   * @example
	   * //回调参数：
	   * {
     *  IP:"",
     *  OS:"\U82f9\U679c",
     *  account:"",
     *  areaCode:"",
     *  baseStation:"",
     *  clientID:12933032900000135327,
     *  latitude:0,
     *  longitude:0,
     *  mac:"10:DD:B1:CF:C1:80",
     *  port:"",
     *  wifiMac:""
     * };
	   */
    get_device_info: function (options) {
      Facade.request({ name: Facade.METHOD_APP_GET_DEVICE_INFO, callback: options.callback });
    },

	  /**
	   * @description 进入语音搜索,5.7版本，语音搜索之后的结果，不需要BU处理，只需调用即可，后续版本，可能只做语音解析，解析结果传递给H5，BU自行处理
	   * @method Service.cGuiderService.show_voice_search
	   * @param {Object} options
     * @param {number} options.bussinessType 业务类型(0. 无（默认）1. 机票 2. 酒店3 . 火车票 5. 目的地 6. 攻略 7.景点门票 8.周末/短途游) 61：团队游 62：周末游 63：自由行 64：邮轮
	   * @example
	   * //参数：
	   * {
	   *    bussinessType:0 //业务类型(0. 无（默认）1. 机票 2. 酒店3 . 火车票 5. 目的地 6. 攻略 7.景点门票 8.周末/短途游) 61：团队游 62：周末游 63：自由行 64：邮轮
	   * }
	   */
    show_voice_search: function (options) {
      Facade.request({ name: Facade.METHOD_APP_SHOW_VOICE_SEARCH, bussinessType: options.bussinessType });
    },

	  /**
	   * @description 选取图片/拍摄照片，base64返回图片
	   * @method Service.cGuiderService.choose_photo
	   * @param {Object} options 输入参数
     * @param {number} [options.maxFileSize=200*1024] 最大的图片文件大小，单位是bit，默认200*1024
     * @param {number} [options.maxPhotoCount=1]  最多支持选择的图片个数,默认为1张，此时不显示多选
     * @param {object} {options.meta} 图片选取相关配置信息，5.8新增，5.8版本开始支持1个key， canEditSinglePhoto:单选能否编辑
     * @param {function} {options.callback} 回调
	   * @example
	   * //参数：
	   * {
	   *    maxFileSize: 200*1024 , //{int} 最大的图片文件大小，单位是bit，默认200*1024
	   *    maxPhotoCount:1,        // {int} 最多支持选择的图片个数,默认为1张，此时不显示多选
	   *    meta:{},                 //{Object} 图片选取相关配置信息，5.8新增，5.8版本开始支持1个key， canEditSinglePhoto:单选能否编辑
	   *    callback:function(data){} //{function} 图片选取后的回调函数
	   * }
	   * //回调参数
	   * {
     *    photoList:["xx089xessewz....", "xx089xessewz...."]
     * }
	   */
    choose_photo: function (options) {
      Facade.request({ name: Facade.METHOD_APP_CHOOSE_PHOTO, maxFileSize: options.maxFileSize, maxPhotoCount: options.maxPhotoCount, meta: options.meta, callback: options.callback });
    },

	  /**
	   * @description H5完成注册，将注册信用户息告知Native，native做登录
	   * @method Service.cGuiderService.finished_register
	   * @param {Object} options 输入参数
     * @param {object} options.userInfo 用户信息
     * @param {string} options.userInfo.userID userID
     * @param {string} options.userInfo.phone phone
     * @param {string} options.userInfo.password password
	   */
    finished_register: function (options) {
      Facade.request({ name: Facade.METHOD_APP_FINISHED_REGISTER, userInfo: options.userInfo });
    },

	  /**
	   * @description 调用app共享
	   * @method Service.cGuiderService.app_call_system_share
	   * @param {Object} options 输入参数
     * @param {string} options.imageRelativePath 将要分享的图片相对路径，相对webapp的路径
     * @param {string} options.text 需要分享的文字,微博分享文字限制在140
     * @param {string} options.title 需要分享的标题, v5.4开始支持该字段，微信和email支持；
     * @param {string} options.linkUrl 需要分享的链接
	   * @example
	   * //参数：
	   * {
	   *    imageRelativePath:'',//将要分享的图片相对路径，相对webapp的路径
	   *    text:'',//需要分享的文字,微博分享文字限制在140
	   *    title:'',//需要分享的标题, v5.4开始支持该字段，微信和email支持；
	   *    linkUrl:'' //需要分享的链接, v5.4开始支持该字段
	   *    isIOSSystemShare:false //是否是ios系统
	   * }
	   */
    app_call_system_share: function (options) {
      Facade.request({ name: Facade.METHOD_APP_CALL_SYSTEM_SHARE, imageRelativePath: options.imageRelativePath,
        text: options.text, title: options.title, linkUrl: options.linkUrl, isIOSSystemShare: options.isIOSSystemShare});
    },

	  /**
	   * @description 检查当前App网络状况
	   * @method Service.cGuiderService.app_check_network_status
	   * @param {Object} options
     * @param {function} options.callback 检查完成后的回调
	   * @example
	   * //回调参数：
	   * {
	   *    tagname:"check_network_status",
     *    hasNetwork:true,//布尔值返回是否有网络
     *    networkType:"4G", //5.8开始加入， None-无网络, 2G-蜂窝数据网EDGE/GPRS, 3G-蜂窝数据网HSPDA,CDMAVOD, 4G-LTE(4G为5.9加入), WIFI-WLAN网络
	   * }
	   */
    app_check_network_status: function (options) {
      Facade.request({ name: Facade.METHOD_APP_CHECK_NETWORK_STATUS, callback: options.callback });
    },

	  /**
	   * @description 检查渠道包信息 此方法目前不可用，后期会改成app_check_app_package_info
	   * @method Service.cGuiderService.app_check_android_package_info
	   * @param {Object} options
     * @param {funcion} options.callback 检查完成后的回调函数
	   * @example
	   * //回调参数：
	   * {
	   *    isHideAdv:true,
	   *    isHideAppRecommend:true
	   * }
	   */
    app_check_android_package_info: function (options) {
      Facade.request({ name: Facade.METHOD_APP_CHECK_ANDROID_PACKAGE_INFO, callback: options.callback });
    },

	  /**
	   * @description 记录google remarkting的screenName
	   * @method Service.cGuiderService.app_log_google_remarkting
	   * @param {String} url 需要纪录的页面名
	   */
    app_log_google_remarkting: function (url) {
      Facade.request({ name: Facade.METHOD_APP_LOG_GOOGLE_REMARKTING, url: url });
    },

	  /**
	   * @description 获取短信中的验证码
	   * @method Service.cGuiderService.app_read_verification_code_from_sms
	   * @param {Object} options 输入参数
     * @param {function} options.callback 获取验证码之后的回调{callback:function(data){}}
	   * @example
	   * //回调参数：
	   * {
	   *    verificationCode = "8890
	   * }
	   */
    app_read_verification_code_from_sms: function (options) {
      Facade.request({ name: Facade.METHOD_APP_READ_VERIFICATION_CODE_FROM_SMS, callback: options.callback });
    },

	  /**
	   * @description H5页面加载完成，通知native app，app会隐藏loading界面
	   * @method  Service.cGuiderService.app_h5_page_finish_loading
	   */
    app_h5_page_finish_loading: function (options) {
      Facade.request({ name: Facade.METHOD_H5_PAGE_FINISH_LOADING });
    },

	  /**
	   * @description 保存照片到相册
	   * @method Service.cGuiderService.save_photo
	   * @param {Object} options 输入参数
     * @param  {string} options.photoUrl 需要保存图片的URL
     * @param {string} options.photoBase64String 需要保存图片的base64字符串,UTF8编码
     * @param {string} options.imageName  图片保存到相册的名字
     * @param {function} options.callback 保存完成后的回调
	   * @example
	   * //参数：
	   * {
	   *    photoUrl:'',//{String} 需要保存图片的URL， 注：当photoBase64String字段不为空的时候，base64图片内容优先，URL不处理
	   *    photoBase64String:'',//{String} 需要保存图片的base64字符串,UTF8编码
	   *    imageName:"", //图片保存到相册的名字，android有效，ios无效. 不传的时候，默认android存储为image.jpg
	   *    callback；function(){} //保存完成后的回调
	   * }
	   * //回调参数：
	   *    error_code:"xxxxx",//error_code有内容时候，代表有错误，否则表示保存成功.error_code分为以下几种
	   *    //(-200)参数错误, base64字符串转换成图片失败
	   *    //(-201)下载成功，图片格式不正确
	   *    //(-202)下载图片失败
	   *    //(-203)保存到相册失败
	   */
    save_photo: function(options)
    {
      if (!options.photoUrl) options.photoUrl = null;
      if (!options.photoBase64String) options.photoBase64String = null;
      options.name = Facade.METHOD_SAVE_PHOTO;
      Facade.request(options);
    },

    /**
     * @description 注册webview appear 事件(webview 显示时，hybrid会调用此回调)
     * @method Service.cGuiderService.registerAppearEvent
     * @param {Function} callback webview 显示时的回调函数
     */
    registerAppearEvent: function (callback) {
      Facade.register({tagname: Facade.METHOD_WEB_VEW_DID_APPEAR, callback: callback})
    },
    /**
     * @description 注销webview appear 事件 配合registerAppearEvent方法使用（webview销毁时，hybrid会调用此方法）
     * @method Service.cGuiderService.unregisterAppearEvent
     */
    unregisterAppearEvent: function () {
      Facade.unregister(Facade.METHOD_WEB_VEW_DID_APPEAR)
    }
  };

  /**
   * @description 文件操作相关类
   * @namespace Service.cGuiderService.file
   */
  HybridGuider.file = {
    /**
     * @description 检查文件是否存在。可以指定文件名，或者相对路径
     * @method Service.cGuiderService.file.isFileExist
     * @param {object} options 输入参数
     * @param {string} options.fileName 需要读取文件大小的文件路径
     * @param {string} options.relativeFilePath 需要读取文件大小的文件相对路径，需要调用app_get_current_sandbox_name获取sandbox的名字+路径
     * @param {function} options.callback 检查过后的回调
     * @example
     * 参数:
     * {
     *    fileName:"", // {String}需要读取文件大小的文件路径
     *    relativeFilePath:"", // {String} 需要读取文件大小的文件相对路径，需要调用app_get_current_sandbox_name获取sandbox的名字+路径
     *    callback:function(data){} //检查过后的回调
     * }
     * 回调参数为
     * param : {
     *      isExist: true
     * }
     */
    isFileExist: function (options) {
      Facade.request({ name: Facade.METHOD_CHECK_FILE_EXIST, callback: options.callback, fileName: options.fileName, relativeFilePath: options.relativeFilePath });
    },

    /**
     * @description 删除文件/目录。可以指定文件名，或者相对路径
     * @method Service.cGuiderService.file.deleteFile
     * @see http://jimzhao2012.github.io/api/classes/CtripFile.html#method_app_delete_file
     * @param {object} options 输入参数
     * @example
     * 参数：
     * {
     *    fileName:'', //{String} 需要删除的文件路径
     *    relativeFilePath:'', //{String} 需要删除的文件相对路径，需要调用app_get_current_sandbox_name获取sandbox的名字+路径
     *    callback；fucntion(data){} //{Function}删除文件后的回调
     * }
     * 回调参数：
     *  {
     *     isSuccess: true
     *  }
     */
    deleteFile: function (options) {
      Facade.request({ name: Facade.METHOD_DELETE_FILE, callback: options.callback, fileName: options.fileName, relativeFilePath: options.relativeFilePath });
    },

    /**
     * @description 获取当前web页面的sandbox目录，在webapp/wb_cache/xxxx/目录下xxxx即为当前sandbox的名字
     * @method Service.cGuiderService.file.getCurrentSandboxName
     * @see http://jimzhao2012.github.io/api/classes/CtripFile.html#method_app_get_current_sandbox_name
     * @param {object} options 输入参数{callback:function(data){}}
     * @example
     * 回调参数:
     *   {
     *     sandboxName: "car"
     *   }
     */
    getCurrentSandboxName: function (options) {
      Facade.request({ name: Facade.METHOD_GET_CURRENT_SANDBOX_NAME, callback: options.callback });
    },

    /**
     * @description 读取文件大小。可以指定文件名，或者相对路径
     * @method Service.cGuiderService.file.getFileSize
     * @param {object} options 输入参数
     * @example
     * //参数：
     * {
     *    fileName:"", //{String} 需要读取文件大小的文件路径
     *    relativeFilePath :"",//{String} relativeFilePath
     *    callback:function(data){} //获取之后的回调
     * }
     * //回调参数:
     *   {
     *     fileSize: 8
     *   }
     */
    getFileSize: function (options) {
      Facade.request({ name: Facade.METHOD_GET_FILE_SIZE, callback: options.callback, fileName: options.fileName, relativeFilePath: options.relativeFilePath });
    },


    /**
     * @description 创建文件夹。可以指定文件名，或者相对路径
     * @method Service.cGuiderService.file.makeDir
     * @param {object} options 输入参数
     * @example
     * //参数
     * {
     *    dirname:"",//{String}需要创建的文件夹路径
     *    relativeDirPath :"", //{String} 需要创建的文件夹相对路径，需要调用app_get_current_sandbox_name获取sandbox的名字+路径
     *    callback:function(data){} //{Function} 创建成功后的回调
     * }
     * //回调参数：
     *  {
     *    isSuccess: true
     *  }
     */
    makeDir: function (options) {
      Facade.request({ name: Facade.METHOD_MAKE_DIR, callback: options.callback, dirname: options.dirname, relativeFilePath: options.relativeFilePath });
    },

    /**
     * @description 读取文本文件内容，UTF-8编码。可以指定文件名，或者相对路径
     * @method Service.cGuiderService.file.readTextFromFile
     * @param {object} options 输入参数
     * @example
     * //参数：
     * {
     *    fileName:"", //{String} 需要读取内容的文件路径
     *    relativeFilePath:"",//{String}需要读取内容的文件相对路径，需要调用app_get_current_sandbox_name获取sandbox的名字+路径
     *    callback:function(data){} //读取完成后的回调
     * }
     * //回调参数：
     * {
     *      text: "Hello,世界"
     *  }
     */
    readTextFromFile: function (options) {
      Facade.request({ name: Facade.METHOD_READ_TEXT_FROM_FILE, callback: options.callback, fileName: options.fileName, relativeFilePath: options.relativeFilePath });
    },

    /**
     * @description 文本写入文件中，UTF8编码。可以指定文件名，或者相对路径
     * @method Service.cGuiderService.file.writeTextToFile
     * @see http://jimzhao2012.github.io/api/classes/CtripFile.html#method_app_write_text_to_file
     * @param {object} options 输入参数
     * @example
     * //参数;
     * {
     *    fileName:"", //{String} 写入的文件路径
     *    relativeFilePath:"",//{String}写入的文件相对路径，需要调用app_get_current_sandbox_name获取sandbox的名字+路径
     *    text:"",//{String} 需要写入文件的文本内容
     *    isAppend:false,//{String} 是否是将当前文件append到已有文件
     *    callback:function(data){} // {Function} 写完之后的回调
     * }
     * //回调收到参数为
     * {
     *      isSuccess: true
     *  }
     */
    writeTextToFile: function (options) {
      Facade.request({ name: Facade.METHOD_WRITE_TEXT_TO_FILE, callback: options.callback, text: options.text, isAppend: options.isAppend, fileName: options.fileName, relativeFilePath: options.relativeFilePath });
    }
  };

  /**
   * @description 管道相关类
   * @namespace Service.cGuiderService.pipe
   */
  HybridGuider.pipe = {
    /**
     * @description H5通过App发送服务 发送socket请求
     * @method Service.cGuiderService.pipe.socketRequest
     * @param {object} options 输入参数
     * @example
     * //参数：
     * {
     *    serviceCode:"", //{String} 需要发送服务的服务号
     *    header:"",   //{String} 服务的header
     *    data:""，    //{String} 服务所需要的数据部分，各个服务都不同
     *    pipeType:1  //{Int}  管道类型，因mobileServer原因，5.4的管道是支付专用，默认是0=支付管道，1＝公共管道
     *    callback:function(data){} //{Function}请求返回后的回调
     * }
     * //回调参数：
     * //成功
     *{
		 *  sequenceId:"13523333333",
		 *  resultMessage:"eHh4eHh4",
		 *  resultHead:"eHh4eHh4",
		 *  resultBody:"eHh4eHh4",
		 *  result:1,
     * },
     * //失败
     * //  code定义，返回给Hybrid时候，为负数，iOS/Android －200开始，递减
     * //  CONN_FAIL_TYPE_NO_FAIL = 200------------------正确，无错误
     * // CONN_FAIL_TYPE_GETCONN_UNKOWN = 201-----------从连接池获取长连接失败
     * //  CONN_FAIL_TYPE_GETIP = 202--------------------获取IP地址失败
     * //  CONN_FAIL_TYPE_CONNECT = 203------------------创建连接失败
     * //  CONN_FAIL_TYPE_SEND_DATA = 204----------------发送数据失败
     * //  CONN_FAIL_TYPE_RECEIVE_LENGTH = 205-----------读报文头失败
     * //  CONN_FAIL_TYPE_RECEIVE_BODY = 206-------------读报文体失败
     * //  CONN_FAIL_TYPE_BUILE_REQUESTDATAFAIL = 207----创建请求报文失败
     * //  CONN_FAIL_TYPE_BUILE_RESPONSEDATAFAIL = 208---解析返回报文失败
     * //  CONN_FAIL_TYPE_SERIALIZE_REQUEST_FAIL = 209---序列化请求报文失败
     * //  CONN_FAIL_TYPE_SERIALIZE_RESPONSE_FAIL = 210--序列化返回报文失败
     * //  CONN_FAIL_TYPE_RESPONSE_REPEAT = 211----------服务端下发需要重试
     *
     *{
		 * sequenceId:"13523333333",
		 * errorInformation:"抱歉！加载失败，请重试(-203)", //括号内的code为errorCode，5.8.1加入
		 * serverErrorCode:"eHh4eHh4",
     *},
     */
    socketRequest: function (options) {
      var timestamp = Date.now();
      Facade.request({ name: Facade.METHOD_SEND_H5_PIPE_REQUEST, callback: options.callback, serviceCode: options.serviceCode, header: options.header, data: options.data, sequenceId: timestamp, pipeType: options.pipeType });
      return timestamp;
    },

    /**
     * @description H5通过App发送服务 发送http请求
     * @method Service.cGuiderService.pipe.httpRequest
     * @param {object}  options 输入参数
     * @example
     * //参数：
     * {
     *    url:"", //{String}HTTP请求发送的URL地址
     *    method:"", //{String} HTTP请求方式GET/POST
     *    header:"", //{String} HTTP头，JSON字符串格式key/value，cookie作为一个key存储再HEADER内部
     *    param:{}, //key=value形式的字符串数组,请做好参数的Encode，app端只负责拼接
     *    sequenceId:"", //发送服务的序列号，随机生存即可
     *    retry:{} ,// 貌似bridge.js中未处理
     *    callback:function(data){} //请求成功的回调
     * }
     * //回调参数：
     * param:
     *{
		 *responseString:"eHh4eHh4",
		 *responseCookie : {
		 *			"BAIDUID":"2959D035E2F5D7C979687934D558DCD3:FG=1",
		 *			"BDSVRTM":10,
		 *			"BD_CK_SAM":1,
		 *			"H_PS_PSSID":"1429_5225_5287_5722_5848_4261_5830_4759_5659_5857"
		 *    },
		 *sequenceId:"13222222"
     *},
     */
    httpRequest: function (options) {
      var timestamp = Date.now();
      Facade.request({ name: Facade.METHOD_SEND_HTTP_PIPE_REQUEST, callback: options.callback, target: options.url, method: options.method, header: options.header, queryData: options.param, retryInfo: options.retry, sequenceId: timestamp });
      return timestamp;
    },

    /**
     * @description 根据发送的sequenceId，终止正在发送的HTTP请求 取消http请求
     * @method Service.cGuiderService.pipe.abortRequest
     * @param {object} options 输入参数
     * @param {string} [options.type=socket] 请求类型 http/socket
     * @param {string} options.id 需要取消的服务id
     * @example
     * //参数：
     * {
     *    type:"",//{String} 请求类型 'socket'/'http'
     *    id:发送服务的序列号，随机生存即可 对应socket
     *    sequenceId:发送服务的序列号，随机生存即可 对应http
     * }
     */
    abortRequest: function (options) {
      if(options.type == 'socket'){
        Facade.request({ name: Facade.METHOD_ABORT_HTTP_PIPE_REQUEST, sequenceId: options.id });
      }else{
        Facade.unregister({ name: Facade.METHOD_SEND_H5_PIPE_REQUEST, sequenceId: options.sequenceId });
      }
    }
  };

  /**
   * 支付相关类
   * @namespace Service.cGuiderService.pay
   */
  HybridGuider.pay = {

    /**
     * @description  检查支付相关App安装情况
     * @method Service.cGuiderService.pay.checkStatus
     * @see  http://jimzhao2012.github.io/api/classes/CtripPay.html#method_app_check_pay_app_install_status
     * @param {object} options 参数对象
     * @param {function} options.callback 检查支付之后的回调 {callback:function(param){}}
     * @example
     * //回调数据
     *    {
     *       platform:"iOS", //Android
     *       weixinPay:true,
     *       aliWalet:true,
     *       aliQuickPay:true,
     *    }
     */
    checkStatus: function (options) {
      Facade.request({ name: Facade.METHOD_CHECK_PAY_APP_INSTALL_STATUS, callback: options.callback });
    },

    /**
     * @description 根据URL打开支付App
     * @method Service.cGuiderService.pay.payOut
     * @see http://jimzhao2012.github.io/api/classes/CtripPay.html#method_app_check_pay_app_install_status
     * @param {object} options
     * @example
     * //参数:
     * {
     *    payAppName:"" , // {String} 支付App的URL，暂固定为以下4个， aliWalet/aliQuickPay/wapAliPay/weixinPay(微信支付暂未支持)
     *    payURL:"",//{String}服务器返回的支付配置信息，ali相关为URL，微信支付为xml
     *    successRelativeURL:"" //{String} 支付成功跳转的URL
     *    detailRelativeURL :"" //{String} 支付失败或者支付超时跳转的url
     * }
     */
    payOut: function (options) {
      Facade.request({ name: Facade.METHOD_OPEN_PAY_APP_BY_URL, payAppName: options.payAppName, payURL: options.payURL, successRelativeURL: options.successRelativeURL, detailRelativeURL: options.detailRelativeURL });
    },

    callPay: function(options) {
      Hish.Fn('call_pay').run(options);
    }
  };

  /**
   * @description 自有加解密操作类
   * @namespace Service.cGuiderService.encrypt
   */
  HybridGuider.encrypt = {

    /**
     * @description Ctrip私有加解密算法
     * @method Service.cGuiderService.encrypt.ctrip_encrypt
     * @param {object} options 参数对象
     * @param {string} options.inStr 加密字符串
     * @param {function} options.callback 
     * @example
     * //参数：
     * {
     *    inStr:"", // {String}需要做加解密的字符串
     *    callback:function(){} //{Function} 加密成功的回调
     * }
     * //回调参数
     * param:
	   *  {
		 *	 inString:"abcdxxxx",
		 *	 outString:"ABScdXkYZunwXVF5kQpffnY+oL/MFmJGkn8ra8Ab5cI=",
		 *	 encType:1
     * }
     */
    ctrip_encrypt: function (options) {
      Facade.request({ name: Facade.METHOD_ENCRYPT_CTRIP, callback: options.callback, inString: options.inStr, encType: 1 });
    },
    /**
     * @description 携程自有解密
     * @method Service.cGuiderService.encrypt.ctrip_decrypt
     * @param {object} options 参数对象
     * @param {function} options.callback 回调参数
     * @param {string} opitions.inStr 解密字符串
     * @example
     * //参数：
     * {
     *    inStr:"", // {String}需要做加解密的字符串
     *    callback:function(){} //{Function} 加密成功的回调
     * }
     * //回调参数
     * param:
     *  {
		 *	 inString:"abcdxxxx",
		 *	 outString:"ABScdXkYZunwXVF5kQpffnY+oL/MFmJGkn8ra8Ab5cI=",
		 *	 encType:1
     * },
     */
    ctrip_decrypt: function (options) {
      Facade.request({ name: Facade.METHOD_ENCRYPT_CTRIP, callback: options.callback, inString: options.inStr, encType: 2 });
    }
  };

  return HybridGuider;

});
