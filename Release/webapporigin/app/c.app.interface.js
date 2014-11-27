/**
 * @author l_wang王磊 <l_wang@Ctrip.com>
 * @class cBusinessCommon
 * @description 分离公共业务逻辑至此
 */
define(['cGuiderService', 'cMessageCenter','cLocalStorage'], function (Guider, MessageCenter,cStorage) {

  return function () {
    //add by byl 添加saveAppUrl方法，保存BU中getAppUrl中返回值到隐藏域app_url中
    Lizard.saveAppUrl = function (inView) {
      //add by byl 在此处判断inView中的getAppUrl是否存在,如果存在将返回值添加到隐藏域app_url
      var appUrlDoom = $('#app_url');
      var isNewAppUrl = false;
      if (inView && inView.getAppUrl && typeof inView.getAppUrl === 'function') {
        var newAppUrl = inView.getAppUrl();
        if (newAppUrl && _.isString(newAppUrl)) {
          isNewAppUrl = true;
          if (!appUrlDoom.length) {
            //创建隐藏域节点
            $('<INPUT type="hidden" id="app_url" value="' + newAppUrl + '"/>').appendTo($('body'));
          } else {
            appUrlDoom.val(newAppUrl);
          }
        }
      }
      if (!isNewAppUrl) {
        if (appUrlDoom.length > 0) {
          appUrlDoom.val("");
        }
      }
    }
    //GA
    MessageCenter.subscribe('viewReady', function (inView) {
      if (typeof _gaq !== 'undefined') {
        _gaq.push(['_trackPageview', window.location.href]);
      }

      if (Lizard.isHybrid) {
        //处理inView._getViewUrl不存在的问题
        if (!inView || !inView._getViewUrl)
          return;
        var url = inView._getViewUrl();
        Guider.app_log_google_remarkting(url);
      } else {
        _sendGA();
      }
      //add by byl 将BU 实现的getAppUrl的返回值绑定到隐藏域app_url中
      Lizard.saveAppUrl(inView);
      //Kenshoo统计代码 add by byl
      _sendKenshoo();
      _sendMarin();

	    //add by byl  在此处删除过期缓存
	    try {
		    cStorage.getInstance().removeOverdueCathch();
	    } catch (e) {
		    console && console.log(e);
	    }
    });

    /**
     * Kenshoo统计代码
     */
    var _sendKenshoo = function () {
      var orderID = Lizard.P("orderID"), // || Lizard.P("oId") ; 此处暂不写oid的统计，没有明确文档说明oid需要统计
      type = Lizard.P("type") || Lizard.P("busType") || '',
      val = Lizard.P("val") || Lizard.P("price") || '';
      if (orderID) {
        var kurl = "https://2113.xg4ken.com/media/redir.php?track=1&token=8515ce29-9946-4d41-9edc-2907d0a92490&promoCode=&valueCurrency=CNY&GCID=&kw=&product="
        kurl += "&val=" + val + "&orderId=" + orderID + "&type=" + type;
        var imgHtml = "<img style='position: absolute;' width='1' height='1' src='" + kurl + "'/>"
        $('body').append(imgHtml);
      }
    };

    /**
     * 发送Marinsm 统计
     */
    var _sendMarin = function () {
      var orderID = Lizard.P("orderID"), // || Lizard.P("oId") ;
      type = Lizard.P("type") || Lizard.P("busType") || '',
      val = Lizard.P("val") || Lizard.P("price") || '';
      if (orderID) {
        var murl = "https://tracker.marinsm.com/tp?act=2&cid=6484iki26001&script=no"
        murl += "&price=" + val + "&orderid=" + orderID + "&convtype=" + type;
        var imgHtml = "<img style='position: absolute;' width='1' height='1' src='" + murl + "'/>"
        $('body').append(imgHtml);
      }
    };

    /**
     * GA统计
     */
    var _sendGA = function () {
      if (typeof ga !== 'undefined') {
        ga('send', 'pageview', location.href);
      }
    }

  };
});
