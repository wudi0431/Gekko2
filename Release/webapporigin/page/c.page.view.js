/**
 * @File c.page.view.js
 * @Description:多数UI View的基类，提供基础方法，以及自建事件机
 * @author shbzhang@ctrip.com
 * @date 2014-09-30 15:23:20
 * @version V1.0
 */
/**
 * View 基类,继承自Bacbone.View
 * @namespace View.cPageView
 * @example
 * defined('cPageView',function(cPageView){
 *  var view = cPageView.extend({
 *    //view初始化调用,在生命周期中只调用一次
 *    onCreate:function(){
 *    },
 *    //view显示时调用
 *    onShow:function(){
 *    ),
 *    //view隐藏调用
 *    onHide:function(){
 *    },
 *    //view获得视口时调用,此方法仅在hybrid有效
 *    onAppear:function(){
 *    }
 *  })
 * })
 */
define(['libs', 'UIHeader', 'cGuiderService'],
  function (libs, Header, Guider) {
    "use strict";


    var PageView = Backbone.View.extend({
      /**
      * 滚动条位置
      * @var
      * @private
      */
      scrollPos: { x: 0, y: 0 },
      /**
      * 标题组件
      * @var View.cPageView.header
      * @type UIHeader
      */
      header: null,


      /**
      * web 环境下使用pageid
      * @var View.cPageView.pageid
      * @type {number|string}
      */
      pageid: 0,

      /**
      * hybrid 环境下使用pageid
      * @var View.cPageView.hpageid
      * @type {number|string}
      */
      hpageid: 0,

      /**
      * 页面切换时，是否要滚动至顶部
      * @var View.cPageView.scrollZero
      * @type {boolean}
      */
      scrollZero: true,

      /**
      * 页面切换时，是否执行onShow onHide
      * @var View.cPageView.triggerShow
      * @type {boolean}
      */
      triggerShow: true,

      /**
      * 页面切换时，是否执行onShow onHide
      * @var View.cPageView.triggerHide
      * @type {boolean}
      */
      triggerHide: true,

      /**
      * View构造函数
      */
      initialize: function () {
        this.id = this.$el.attr("id");
        this.create();
      },

      /**
      * 生成头部
      */
      _createHeader: function () {
        var hDom = $('#headerview');
        this.header = this.headerview = new Header({ 'root': hDom, 'wrapper': hDom });
      },

      /**
      * create 方法,View首次初始化是调用
      * @method View.cPageView.onCreate
      */
      create: function () {
        //调用子类onCreate
        this.onCreate && this.onCreate();
      },

      /**
      * view 销毁方法
      * @method View.cPageView.destroy
      */
      destroy: function () {
        this.$el.remove();
      },

      /**
      * View 显示时调用的方法
      * @method View.cPageView.onShow
      */
      show: function () {
        // fix ios 页面切换键盘不消失的bug shbzhang 2014-10-22 10:44:29
        document.activeElement && document.activeElement.blur();
        //生成头部
        this._createHeader();
        //调用子类onShow方法
        !this.switchByOut && this.$el.show();

        this.triggerShow && this.onShow && this.onShow();

        this.onAfterShow && this.onAfterShow();

        //注册Web_view_did_appear 事件
        Guider.registerAppearEvent(this.onAppear);

        if (this.onBottomPull) {
          this._onWidnowScroll = $.proxy(this.onWidnowScroll, this);
          this.addScrollListener();
        }

        if (this.scrollZero) {
          window.scrollTo(0, 0);
        }

        this.triggerShow = true;
        this.triggerHide = true;

        //如果定义了addScrollListener,说明要监听滚动条事,此方法在cListView中实现
        this.addScrollListener && this.addScrollListener();
      },

      /**
      * View 隐藏
      * @method View.cPageView.onHide
      */
      hide: function () {
        //取消web_view_did_appear 事件的注册
        Guider.unregisterAppearEvent();
        //调用子类onHide方法
        this.triggerHide && this.onHide && this.onHide();
        this.removeScrollListener && this.removeScrollListener();
        this.$el.hide();
      },

      /**
      * View 从Native 回来，重新获取焦点时调用，此方法只在hybrid可用
      * @method View.cPageView.onAppear
      * @param {String} data 再次唤醒事由Native传来的参数
      */
      onAppear: function (data) {
        console.log('onAppear --------------');
      },

      /**
      * 跨频道跳转
      * @param {String|JSON} opt
      */
      jump: function (opt) {
        if (_.isString(opt)) {
          window.location.href = opt;
        } else {
          Guider.jump(opt);
        }
      },
      /*add by wxj 20140527 22:33 end*/
      /**
      * 前进
      * @method View.cPageView.forward
      * @param url
      */
      forward: function (url, opt) {
        Lizard.forward.apply(null, arguments);
      },
      /**
      * 回退至前一页面
      * @method View.cPageView.back
      * @param url
      */
      back: function (url, opt) {
        Lizard.back.apply(null, arguments);
      },

      /**
      * 刷新页面
      */
      refresh: function () {

      },
      /**
      * 唤醒App,要求返回一个app接受的字符串
      * @method View.cPageView.getAppUrl
      * @return {String} url
      */
      getAppUrl: function () {
        return "";
      },

      /**
      * 返回URL中参数的值
      * @method View.cPageView.getQuery
      * @param key
      * @returns {string} value 返回值
      */
      getQuery: function (key) {
        return Lizard.P(key);
      },
      /**
      * 保存滚动条位置
      */
      saveScrollPos: function () {
        this.scrollPos = {
          x: window.scrollX,
          y: window.scrollY
        };
      },

      /**
      * 恢复原滚动条位置
      * @method View.cPageView.restoreScrollPos
      */
      restoreScrollPos: function () {
        window.scrollTo(this.scrollPos.x, this.scrollPos.y);
      },

      /**
      * 空方法,兼容1.1
      */
      turning: function () {

      },
      /**
      * 显示单个按钮的alert框
      * @param message 内容
      * @param title 标题
      */
      showMessage: function (params) {
        Lizard.showMessage(params);
      },

      /**
      * 隐藏Alert框
      */
      hideMessage: function () {
        Lizard.hideMessage();
      },

      /**
      * 显示两个按钮的confirm 对话框
      * @param message 内容
      * @param title 标题
      * @param okFn  按钮1回调
      * @param cancelFn 按钮2回调
      * @param okTxt   按钮1文本
      * @param cancelTxt 按钮2文本
      */
      showConfirm: function (params) {
        Lizard.showConfirm(params);
      },

      /**
      * 隐藏confirm对话框
      */
      hideConfirm: function () {
        Lizard.hideConfirm();
      },


      /**
      * 显示showWarnig404,此组件有一个拨打电话和一个重试按钮
      *
      */
      showWarning404: function (params) {
        Lizard.showWarning404(params);

      },

      /**
      * 隐藏waring404组件
      */
      hideWarning404: function () {
        Lizard.hideWarning404();
      },

      /**
      * 显示Toast
      * @method View.cPageView.showToast
      * @param {object} params
      * @param {string} params.title 标题
      * @param {number} params.timeout 显示时长
      * @param {callback} params.callback 隐藏时回调
      * @param {boolean} params.clickToHide 是否允许点击界面任一处,隐藏Toast
      */
      showToast: function (params) {
        Lizard.showToast(params);
      },

      /**
      * 隐藏toast
      * @method View.cPageView.hideToast
      */
      hideToast: function () {
        Lizard.hideToast();
      },

      /**
      * 显示Loading
      * @method View.cPageView.showLoading
      */
      showLoading: function (params) {
        Lizard.showLoading(params);
        //        this.loading.firer = this;
      },

      /**
      * 隐藏Loading
      * @method View.cPageView.hideLoading
      */
      hideLoading: function () {
        //        if (!this.loading.firer || this.loading.firer == this)
        Lizard.hideLoading();
      },


      /**
      * 设置html的title
      * @method View.cPageView.setTitle
      * @param title
      */
      setTitle: function (title) {
        document.title = title;
      },


      /**
      * 发送UBT统计代码
      * @method View.cPageView.sendUbt
      */
      sendUbt: function (retry) {
        var view = this;
        if (!window.__bfi) window.__bfi = [];
        var url = this.$el.attr('page-url'),
            pageId = Lizard.isHybrid ? view.hpageid : view.pageid,
            orderid = Lizard.P("orderid") || Lizard.P("oid") || "";
        if (pageId === 0) {
          return;
        }
        $('#bf_ubt_orderid').val(orderid);
        var ubtURL = window.location.protocol + '//' + window.location.host + url;
        var refererView = Lizard.instance.views[this.referrer];
        window.__bfi.push(['_asynRefresh', {
          page_id: pageId,
          orderid: orderid,
          url: this._hybridUrl(ubtURL),
          refer: refererView ? refererView._hybridUrl(window.location.protocol + '//' + window.location.host + refererView.$el.attr('page-url')) : document.referrer
        }]);
      },


      /**
      * 获得页面Url,hyrbid会增加一个虚拟域名
      */
      _getViewUrl: function () {
        var url = this._hybridUrl(location.href);
        return url;
      },

      _hybridUrl: function (url) {
        if (Lizard.isHybrid) {
          return 'http://hybridm.ctrip.com' + this.$el.attr('page-url');
        } else {
          return url;
        }
      }
    })
    return PageView;

  });