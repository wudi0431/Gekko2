/**
 * @File c.page.view.js
 * @Description:多数UI View的基类，提供基础方法，以及自建事件机
 * @author shbzhang@ctrip.com
 * @date 2014-09-30 15:23:20
 * @version V1.0
 */
/**
 *  ListView提供了列表的分次加载功能
 *  @namespace View.cListView
 *  @example
 *  defined('cListView',function(cListView){
 *    var listView = cListView.extend({
 *      //底部刷新
 *      onBottomPull:function(){
 *      },
 *
 *      //顶部刷新
 *      onTopPull:function(){
 *        //用法1:使用默认loading
 *        var self = this;
 *        //显示loading
 *        this.showTopLoading();
 *        setTimeout(function(){
 *          self.hideRefreshLoading();
 *        },500)
 *
 *        //用法2:不使用默认loading的时候调用
 *        //this.endPull();
 *      }
 *    });
 *  });_
 *
 */
define(['cPageView', 'cUIBase'],
  function (CPageView, cUIBase) {
    "use strict";
    var options = {};

    options._onWidnowScroll = null;
    options.__isComplete__ = false;
    options.__isLoading__ = false;
    options.refreshLoading = null;

    /*
     * 增加监听
     */
    options.addScrollListener = function () {
      this.__isComplete__ = false;
      this.__isLoading__ = false;
      $(window).bind('scroll', this._onWidnowScroll);
      var self = this;
      if (this.onTopPull) {
        _.flip(this.$el, 'down', function () {
          var pos = cUI.Tools.getPageScrollPos();
          if (pos.top <= 10 && !self.__isLoading__) {
            self.__isLoading__ = true;
            self.onTopPull();
          }
        }, function (dir) {
          var pos = cUI.Tools.getPageScrollPos();
          return  dir != 'down'||  pos.top >=10 ;
        }, 0, 5);
      }
    };

    /*
     * 移除监听
     */
    options.removeScrollListener = function () {
      $(window).unbind('scroll', this._onWidnowScroll);
      if (this.refreshLoading) {
        this.refreshLoading.remove();
        this.refreshLoading = null;
      }
      _.flipDestroy(this.$el);
    };

    options.onWidnowScroll = function () {
      var pos = cUIBase.getPageScrollPos();
      if (pos.top == 0) return;
      var h = pos.pageHeight - (pos.top + pos.height);
      //fix ios 不容易加载更多数据问题 shbzhang 2014/1/6
      if (h <= 81 && !this.__isComplete__ && !this.__isLoading__) {
        this.__isLoading__ = true;
        this.onBottomPull && this.onBottomPull();
      }
    };


    /**
     * 当滚动条位于底部时, 上拉操作时出发
     * @method View.cListView.onBottomPull
     */

    /**
     * 当滚动条位于顶部时, 下拉操作时出发
     * @method View.cListView.onTopPull
     */

    /**
     * 通知本次下拉操作完成,在不使用默认的showLoading是,需调用endPull
     * @method View.cListView.endPull
     */
    options.endPull = function () {
      this.__isLoading__ = false;
    };

    /**
     * 关闭下拉通知功能
     * @method View.cListView.closePull
     */
    options.closePull = function () {
      this.__isComplete__ = false;
    };

    /**
     * 打开下拉通知功能
     * @method View.cListView.openPull
     */
    options.openPull = function () {
      this.__isComplete__ = true;
    };
    /**
     * 在当前list顶部显示loading
     * @method View.cListView.showTopLoading
     * @param {dom} [listRoot] list的根节点,如果不指定,默认会选当前页面的第一个select 元素
     */
    options.showTopLoading = function (listRoot) {
      var listRoot = listRoot || this.$el.find('section');
      if (listRoot.length > 0) {
        listRoot.before(this.getLoading());
        this.refreshLoading.show();
      }
    };
    /**
     * 在当前list底部显示loading
     * @method View.cListView.showBottomLoading
     */
    options.showBottomLoading = function () {
      //保证每次bottomload在最下面
      this.$el.append(this.getLoading());
      this.refreshLoading.show();
    };

    /**
     * 隐藏loading图标,建议使用hideRefreshLoading代替
     * @View.cListView.showBottomLoading
     * @deprecated
     */
    options.hideBottomLoading = function () {
      this.hiderefreshLoading();
    };

    /**
     * 隐藏loading图标
     * @View.cListView.showBottomLoading
     */
    options.hideRefreshLoading = function () {
      if (this.refreshLoading) {
        this.refreshLoading.hide();
      }
      this.__isLoading__ = false;
    };

    /*
     * 活动默认的loading图标
     * @returns {null|*}
     */
    options.getLoading = function () {
      if (!this.refreshLoading) {
        this.refreshLoading = $('<div class="cui-zl-load" id="zlLoading"> <div class="cui-i cui-b-loading"></div><div class="cui-i  cui-mb-logo"></div> <p>加载中</p></div>');
      }
      return this.refreshLoading;
    };

    var PageView = CPageView.extend(options);
    return PageView;
  });