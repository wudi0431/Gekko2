/**
* @author zsb张淑滨 <shbzhang@Ctrip.com> / ghj龚汉金 <hjgong@Ctrip.com>
* @class cLog
* @description 提供App在手机端的后门
* @comment 需要zsb与新代码再核对一遍
*/
define([], function () {

  return {
    //        slideleft: function (inView, outView, callback, scope) {
    //            this.body.addClass('hiddenx');
    //            inView.$el.addClass('animatestart');
    //            outView.$el.addClass('slideleftout');
    //            inView.$el.addClass('sliderightin');
    //            var self = this;
    //            return setTimeout(function () {
    //                self.body.removeClass('hiddenx');
    //                inView.$el.removeClass('animatestart');
    //                inView.$el.removeClass('sliderightin');
    //                inView.$el.show();
    //                outView.$el.removeClass('slideleftout');
    //                outView.$el.hide();
    //                callback && callback.call(scope);
    //            }, 700);
    //        },
    //        slideright: function (inView, outView, callback, scope) {
    //            this.body.addClass('hiddenx');
    //            inView.$el.addClass('animatestart');
    //            outView.$el.addClass('sliderightout');
    //            inView.$el.addClass('slideleftin');
    //            var self = this;
    //            return setTimeout(function () {
    //                self.body.removeClass('hiddenx');
    //                inView.$el.removeClass('animatestart');
    //                inView.$el.removeClass('slideleftin');
    //                inView.$el.show();
    //                outView.$el.removeClass('sliderightout');
    //                outView.$el.hide();
    //                callback && callback.call(scope);
    //            }, 700);
    //        },

    //以下为复写
    //                slideleft: function (inView, outView, callback, scope) {
    //                    this.body.addClass('hiddenx');
    //                    var self = this;
    //                    inView.$el.addClass('animatestart');
    //                    inView.$el.css({
    //                        '-webkit-transform': 'translate3d(100%, 0px, 0px)',
    //                        '-moz-transform': 'translate3d(100%, 0px, 0px)'
    //                    });

    //                    inView.$el.animate({
    //                        '-webkit-transform': 'translate3d(0px, 0px, 0px)',
    //                        '-moz-transform': 'translate3d(0px, 0px, 0px)'
    //                    }, 300, 'linear', function () {
    //                        self.body.removeClass('hiddenx');
    //                        inView.$el.removeClass('animatestart');
    //                        outView.$el.hide();
    //                        callback && callback.call(scope);
    //                    })
    //                },
    //                slideright: function (inView, outView, callback, scope) {
    //                    this.body.addClass('hiddenx');
    //                    var self = this;
    //                    outView.$el.addClass('animatestart');
    //                    outView.$el.css({
    //                        '-webkit-transform': 'translate3d(0%, 0px, 0px)',
    //                        '-moz-transform': 'translate3d(0%, 0px, 0px)'
    //                    });
    //                    outView.$el.animate({
    //                        '-webkit-transform': 'translate3d(100%, 0px, 0px)',
    //                        '-moz-transform': 'translate3d(100%, 0px, 0px)'
    //                    }, 300, 'linear', function () {
    //                        self.body.removeClass('hiddenx');
    //                        outView.$el.removeClass('animatestart');
    //                        outView.$el.hide();
    //                        callback && callback.call(scope);
    //                    });
    //                },

    //        slideleft: function (inView, outView, callback, scope) {
    //            this.body.addClass('hiddenx');
    //            inView.$el.addClass('animatestart');
    //            inView.$el.addClass('sliderightin');

    //            outView.$el.addClass('animatestart');
    //            outView.$el.addClass('slideleftout');

    //            var self = this;
    //            return setTimeout(function () {
    //                self.body.removeClass('hiddenx');
    //                inView.$el.removeClass('animatestart');
    //                inView.$el.removeClass('sliderightin');

    //                outView.$el.removeClass('animatestart');
    //                outView.$el.removeClass('slideleftout');

    //                outView.$el.hide();
    //                callback && callback.call(scope);
    //            }, 390);
    //        },

    //        slideright: function (inView, outView, callback, scope) {
    //            this.body.addClass('hiddenx');
    //            inView.$el.addClass('animatestart');
    //            inView.$el.addClass('slideleftin');

    //            outView.$el.addClass('animatestart');
    //            outView.$el.addClass('sliderightout');

    //            var self = this;
    //            return setTimeout(function () {
    //                self.body.removeClass('hiddenx');
    //                inView.$el.removeClass('animatestart');
    //                inView.$el.removeClass('slideleftin');

    //                outView.$el.removeClass('animatestart');
    //                outView.$el.removeClass('sliderightout');

    //                outView.$el.hide();
    //                callback && callback.call(scope);
    //            }, 390);
    //        },

    //    fadeIn: function (inView, outView, callback, scope) {
    //      this.mainframe.hide();
    //      //原逻辑存在两个view可能同时出现在页面中的bug，这里强制先将所有view隐藏，在显示当前view
    //      this.viewport.children('.sub-viewport').hide();
    //      inView.$el.show();
    //      this.mainframe.show();
    //      callback && callback.call(scope || this);
    //    },

    slideleft: function (inView, outView, callback, scope) {
      var $inView = inView.$el;
      var $outView = outView.$el;
      outView.hide();
      $inView.show();
      $inView.bind('webkitAnimationEnd',
        function (event) {
          $inView.unbind('webkitAnimationEnd');
          $('body').removeClass('hiddenx');
          $inView.removeClass('animatestart');
          $inView.removeClass('sliderightin');
          inView.show();
          (typeof callback == 'function' && (scope?callback.call(scope, inView, outView): callback(inView, outView)));
        });
      $('body').addClass('hiddenx');
      $inView.addClass('animatestart');
      $inView.addClass('sliderightin');
      /***
      $('body').addClass('hiddenx');
      inView.addClass('animatestart');
      inView.addClass('sliderightin');

      inView.__show();

      var self = this;
      return setTimeout(function () {
        $('body').removeClass('hiddenx');
        inView.removeClass('animatestart');
        inView.removeClass('sliderightin');

        if (outView) outView.__hide(inView.viewname);

        callback && callback.call(scope, inView, outView);
      }, 340);
      **/
    },
    slideright: function (inView, outView, callback, scope) {
      /***    
      $('body').addClass('hiddenx');

      if (outView) {
        outView.addClass('animatestart');
        outView.addClass('sliderightout');
      }

      inView.__show();

      var self = this;
      return setTimeout(function () {
        $('body').removeClass('hiddenx');
        if (outView) {
          outView.removeClass('animatestart');
          outView.removeClass('sliderightout');
          outView.__hide(inView.viewname);
        }

        callback && callback.call(scope, inView, outView);

      }, 340);
      ****/
      var $inView = inView.$el;
      var $outView = outView.$el;
      //l_wang 缺少兼容处理
      $outView.bind('webkitAnimationEnd', function (event) {
        $outView.unbind('webkitAnimationEnd');
        $('body').removeClass('hiddenx');
        $outView.removeClass('animatestart');
        $outView.removeClass('sliderightout');
        outView.hide();
        inView.show();
        (typeof callback == 'function' && (scope?callback.call(scope, inView, outView): callback(inView, outView)));
      });

      $('body').addClass('hiddenx');
      $outView.addClass('animatestart');
      $outView.addClass('sliderightout');
    },


    noAnimate: function (inView, outView, callback, scope) {
      //减少重绘和回流，但是会引起页面滚动条BUG
//      this.mainframe.hide();

      //in 一定会有 out则不一定
      if (outView) outView.__hide(inView.viewname);
      inView.__show();

//      this.mainframe.show();

      callback && callback.call(scope, inView, outView);

    }

  };
});