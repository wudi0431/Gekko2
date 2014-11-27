define(['cUtilPath', 'cCoreInherit', 'cAbstractApp'], function(path, cCoreInherit, APP){
  return cCoreInherit.Class(APP, {
    bindEvents: function($super) {      
      $super();
      $(window).bind('hashchange', _.bind(function(e){
        if (!this.stopListening) this.goTo(this._getCurrentView(), {pushState: false, renderAt: Lizard.renderAt, landingpage: 1});  
        Lizard.__fakeViewNode && Lizard.__fakeViewNode.remove();
      }, this));      
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
    
    start: function()
    {
      var landingpath = path.parseUrl(location.href).pathname;
      if (landingpath == '/')
      {
        landingpath = '/index'
      }
      else
      {
        landingpath = location.href.substring(location.href.indexOf(path.parseUrl(location.href).pathname))
      }
      Lizard.localRoute.config.defaultView = landingpath;
      this.loadView(landingpath, document.documentElement.innerHTML, {pushState: false, renderAt: Lizard.renderAt, landingpage: 1, hideloading: Lizard.config.isFirstPageHideLoading});      
    },
    
    goTo: function(url, opt)
    {
      this.endObserver();
      window.location.hash = encodeURIComponent(url);
      var self = this;
      if (opt && opt.viewName && Lizard.viewHtmlMap[opt.viewName])
      {
        this.loadView(url, Lizard.viewHtmlMap[opt.viewName], {pushState: true});
        return;
      }
      $.get(url, opt?opt.data:{}, function(html){
        self.loadView(url, html, {pushState: true});        
      }); 
      setTimeout(_.bind(this.startObserver, this), 1);
    },
    
    goBack: function()
    {
      if (arguments.length == 0)
      {
        history.back()
      }
      else
      {
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
        return url == Lizard.localRoute.config.defaultView
      }
    }
  })
})