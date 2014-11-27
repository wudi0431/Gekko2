define(['cUtilPath', 'cCoreInherit', 'cAbstractApp', 'cUtilPath', 'cAjax'], function (path, cCoreInherit, APP, Path, cAjax) {
  return cCoreInherit.Class(APP, {
    bindEvents: function ($super) {
      $super();
      $(window).bind('popstate', _.bind(function (e) {
        var data = e.state || (e.originalEvent && e.originalEvent.state);
        if (data.options) {
          data.options.pushState = false;
          data.options.landingpage = 0;
          data.options.hideloading = true;
          delete data.options.renderAt;
        }
        if (Lizard.stopStateWatch || !data) {
          return;
        }
        history.replaceState({url: data.url, text: data.text, options: data.options}, document.title, data.url);
        this.showView(data);
        Lizard.__fakeViewNode && Lizard.__fakeViewNode.remove();
      }, this));
    },

    start: function () {
      var landingpath = path.parseUrl(location.href).pathname;
      if (landingpath == '/') {
        landingpath = '/index'
      }
      else {
        landingpath = location.href.substring(location.href.indexOf(path.parseUrl(location.href).pathname))
      }
      history.replaceState({url: landingpath, text: document.documentElement.innerHTML, options: {pushState: false, renderAt: Lizard.renderAt, landingpage: 1, hideloading: Lizard.config.isFirstPageHideLoading}}, document.title, landingpath);
      this.loadView(landingpath, document.documentElement.innerHTML, {pushState: false, renderAt: Lizard.renderAt, landingpage: 1, hideloading: Lizard.config.isFirstPageHideLoading});
    },

    goTo: function (url, opt) {
      var self = this;
      if (opt && opt.viewName && Lizard.viewHtmlMap[opt.viewName]) {
        var pushState = true;
        if (opt.pushState === false) {
          pushState = false
          history.replaceState({url: url, text: Lizard.viewHtmlMap[opt.viewName], options: {pushState: false}}, document.title, url);
        }
        else {
          history.pushState({url: url, text: Lizard.viewHtmlMap[opt.viewName], options: {pushState: true}}, document.title, url);
        }
        this.loadView(url, Lizard.viewHtmlMap[opt.viewName], {pushState: pushState});
        return;
      }
      cAjax.get(url, opt ? opt.data : {}, function (html) {
        if (opt && opt.pushState === false) {
          pushState = false
          history.replaceState({url: url, text: html, options: {pushState: false}}, document.title, url);
        }
        else {
          history.pushState({url: url, text: html, options: {pushState: true}}, document.title, url);
        }
        self.loadView(url, html, {pushState: true});
      }, _.bind(function () {
        this.showWarning404(function () {
          Lizard.goTo(url);
        });
      }, this));
    },

    goBack: function () {
      if (arguments.length == 0) {
        history.back()
      }
      else {
        this.goTo.apply(this, arguments);
      }
    },

    judgeForward: function (url) {
      var parseResult = Path.parseUrl(window.location.protocol + '//' + window.location.host + (url.indexOf('/') == 0 ? url : '/' + url)), reg = new RegExp(parseResult.pathname + "$");
      return reg.test(window.location.pathname);
    }
  })
})