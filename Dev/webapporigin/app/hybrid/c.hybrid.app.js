define(['cUtilPath', 'cCoreInherit', 'cAbstractApp', 'cHybridShell'], function(path, cCoreInherit, APP, cHybridShell){
  var targetModeMap = {'refresh':0, 'app':1, 'h5':2, 'browser':3, 'open':4, 'open_relative':5};
  return cCoreInherit.Class(APP, {
    bindEvents: function($super) {      
      $super();
      $(window).bind('hashchange', _.bind(function(e){        
        if (!this.stopListening) this.loadFromRoute(this._getCurrentView(), 0); 
        Lizard.__fakeViewNode && Lizard.__fakeViewNode.remove();
      }, this));      
    },
    
    start: function()
    {      
      this.startUrl = this._getCurrentView();
      this.loadFromRoute(this.startUrl, 1);      
    },
    
    loadFromRoute: function(landingpath, landingpage)    
    {
      var localRouteRet = Lizard.localRoute.mapUrl(landingpath);
      if (localRouteRet) {
        requirejs([localRouteRet], _.bind(function(text) {
          if (landingpath == this._getCurrentView())
          {
            this.loadView(landingpath, text, {pushState: false, renderAt: Lizard.renderAt, landingpage: landingpage});  
          } else {
            console.log('fast click back!!!');
          }       
        }, this));
      }
    },
    
    _getCurrentView: function()
    {
      var landingpath = decodeURIComponent(window.location.hash);
      if (landingpath.indexOf('#') == 0)
      {
        landingpath = landingpath.substr(1);
      }
      else
      {
        landingpath = Lizard.localRoute.config.defaultView || _.first(_.keys(Lizard.localRoute.config));
      }
      return landingpath;
    },
    
    
    /**
     * Hybrid下的页面跳转方法
     * @param {String|url} URL信息
     * @param {Object|opt} 设置信息
     * @method Lizard.goTo
     * @example
     * Lizard.goTo(Lizard.appBaseUrl + 'osd/osdindex', {targetModel: 'open', pageName: 'webViewOsd'})
     * 新开WebView的方式打开 osd/osdindex webView的名称指定为webViewOsd
     * Lizard.goTo(Lizard.appBaseUrl + 'osd/osdindex') 在同一个webView中直接跳转到osd/osdindex
     × Lizard.goTo('', {pageName: 'webViewOsd'})  直接跳转到之前打开的webView名称为webViewOsd的webView
     */
    goTo: function(url, opt)
    {
      if ((opt && opt.targetModel) || Lizard.targetModel) {
        var fn = new cHybridShell.Fn('open_url'), 
            targetModel = opt?opt.targetModel:Lizard.targetModel, 
            pageName = (opt && opt.pageName)?opt.pageName:url;
        if (_.indexOf(['open', 'open_relative'], targetModel) > -1) {
          url = Lizard.appBaseUrl.substr(8) + 'index.html#' + url;
        } 
        fn.run(url, targetModeMap[targetModel], document.title,  pageName);
      } else if (opt && opt.pageName) {
        var fn = new cHybridShell.Fn('back_to_page');
        fn.run(opt.pageName);
      }
      else {
        this.endObserver();      
        window.location.hash = encodeURIComponent(url); 
        if (opt && opt.viewName && Lizard.viewHtmlMap[opt.viewName])
        {
          this.loadView(url, Lizard.viewHtmlMap[opt.viewName], {pushState: false});
          return;
        }
        else
        {
          this.loadFromRoute(url, 0); 
        }
        setTimeout(_.bind(this.startObserver, this), 1);  
      }      
    },
    
    
    /**
     * Hybrid下的页面回退方法
     * @param {String|url} URL信息 
     * @param {Object|opt} 设置信息
     * @method Lizard.goBack
     * @example
     * Lizard.goBack() 简单页面回退 框架会判断如果是webview最先打开的页面会直接回退到上一个native页
     * Lizard.goBack(Lizard.appBaseUrl + 'osd/osdindex', {targetModel: 'open', pageName: 'webViewOsd'}) 同Lizard.goTo(Lizard.appBaseUrl + 'osd/osdindex', {targetModel: 'open', pageName: 'webViewOsd'})
     */
    goBack: function()
    {
      if (arguments.length == 0)
      {
        var prelocation = window.location.hash;
        history.back();
        setTimeout(_.bind(function(){
          if (prelocation == window.location.hash) {
            var fn = new cHybridShell.Fn('back_to_last_page');
            fn.run("", false);  
          }
        }, this), 100); 
      } else {
        this.goTo.apply(this, arguments);
      }
    },
    
    startObserver: function () {
      this.stopListening = false;
    },

    endObserver: function () {
      this.stopListening = true;
    },
    
    judgeForward: function(url)
    {
      if (window.location.hash)
      {
        return url == decodeURIComponent(window.location.hash).substr(1);
      }
      else
      {
        return url == (Lizard.localRoute.config.defaultView || _.first(_.keys(Lizard.localRoute.config)));
      }
    }
  })
})