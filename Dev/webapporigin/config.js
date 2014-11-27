define(function () {
  //TODO jquery 加载判断
  var libs = Lizard.dir + '3rdlibs/zepto';
  var iswinphone = window.navigator.userAgent.indexOf('IEMobile') > -1;
  if (iswinphone) {
    version = window.navigator.userAgent.match(/IEMobile\/\d+/);
    if (version.length > 0) {
      version = version[0].split('/');
      version = version[1];
    }
    ;
  }
  ;
  /*by wxj start*/
  if (!('__proto__' in {}) || (iswinphone && version < 10))
  /*by wxj end*/
  {
    //if ( (isie && !iswinphone) || (iswinphone && version < 10)){
    libs = Lizard.dir + '3rdlibs/jquery';
  }

  require.config({
    shim: {
      $: {
        exports: 'zepto'
      },
      _: {
        exports: '_'
      },
      B: {
        deps: ['_', '$'],
        exports: 'Backbone'
      },
      F: {
        deps: ['$'],
        exports: 'Fastclick'
      },
      libs: {
        deps: ['_', '$', 'B'],
        exports: 'libs'
      },
      common: {
        deps: ['libs']
      },
      cAjax: {
        exports: 'cAjax'
      },
      UIView: {
        deps: ['B'],
        exports: 'UIView'
      },
      cServiceGuider: {
        deps: ['_'],
        exports: 'cServiceGuider'
      }
    },
    "paths": {
      "json2": Lizard.dir + "3rdlibs/json2",
      "bridge": Lizard.dir + "3rdlibs/bridge",
      "R": Lizard.dir + "3rdlibs/require",
      '$': libs,
      "_": Lizard.dir + "3rdlibs/underscore",
      "B": Lizard.dir + "3rdlibs/backbone",
      "F": Lizard.dir + "3rdlibs/fastclick",
      "libs": Lizard.dir + "3rdlibs/libs",
      "text": Lizard.dir + "3rdlibs/require.text",
      "cCoreInherit": Lizard.dir + "common/c.class.inherit",

      "cBusinessCommon": Lizard.dir + "app/c.app.interface",

      "cMessageCenter": Lizard.dir + "common/c.message.center",
      "cAjax": Lizard.dir + "common/c.ajax",
      "cImgLazyload": Lizard.dir + "common/c.img.lazyload",

      "cUtil": Lizard.dir + "util/c.util",
      "cUtilCacheView": Lizard.dir + "util/c.util.cacheview",
      "cUtilCommon": Lizard.dir + "util/c.util.common",
      "cUtilDate": Lizard.dir + "util/c.util.date",
      "cUtilHybrid": Lizard.dir + "util/c.util.hybrid",
      "cUtilObject": Lizard.dir + "util/c.util.object",
      "cUtilPath": Lizard.dir + "util/c.util.path",
      "cUtilPerformance": Lizard.dir + "util/c.util.performance",
      "cUtilValidate": Lizard.dir + "util/c.util.validate",
      "cUtilCryptBase64": Lizard.dir + "util/crypt/c.crypt.base64",
      "cUtilCryptRSA": Lizard.dir + "util/crypt/c.crypt.rsa",

      "cPageParser": Lizard.dir + "app/c.page.parser",
      "cParserUtil": Lizard.dir + "app/c.parser.util",
      "cPageModelProcessor": Lizard.dir + "app/c.page.model.processor",

      "cPageView": Lizard.dir + "page/c.page.view",
      "cPageList": Lizard.dir + "page/c.page.list",

      "cAbstractModel": Lizard.dir + "data/model/c.abstract.model",
      "cModel": Lizard.dir + "data/model/c.model",
      "cUserModel": Lizard.dir + "data/model/c.user.model",

      "cAbstractStore": Lizard.dir + "data/store/c.abstract.store",
      "cLocalStore": Lizard.dir + "data/store/c.local.store",
      "cSessionStore": Lizard.dir + "data/store/c.session.store",
      "cMemoryStore": Lizard.dir + "data/store/c.memory.store",
      "cCommonStore": Lizard.dir + "data/store/c.common.store",
      "cHeadStore": Lizard.dir + "data/store/common/c.head.store",
      "cUserStore": Lizard.dir + "data/store/common/c.user.store",
      "cMarketStore": Lizard.dir + "data/store/common/c.market.store",

      "cAbstractStorage": Lizard.dir + "data/storage/c.abstract.storage",
      "cLocalStorage": Lizard.dir + "data/storage/c.local.storage",
      "cSessionStorage": Lizard.dir + "data/storage/c.session.storage",
      "cMemoryStorage": Lizard.dir + "data/storage/c.memory.storage",

      "cUIInputClear": Lizard.dir + "ui/c.ui.input.clear",
      "cUIBase": Lizard.dir + "ui/c.ui.base",

      //新UI组件
      'UIView': Lizard.dir + 'ui/ui.abstract.view',
      'UILayer': Lizard.dir + 'ui/ui.layer',
      'UIAlert': Lizard.dir + 'ui/ui.alert',
      'UIMask': Lizard.dir + 'ui/ui.mask',
      'UILoadingLayer': Lizard.dir + 'ui/ui.loading.layer',
      'UIToast': Lizard.dir + 'ui/ui.toast',
      'UIInlineView': Lizard.dir + 'ui/ui.inline.view',
      'UINum': Lizard.dir + 'ui/ui.num',
      'UISwitch': Lizard.dir + 'ui/ui.switch',
      'UIBubbleLayer': Lizard.dir + 'ui/ui.bubble.layer',
      'UITab': Lizard.dir + 'ui/ui.tab',
      'UIScroll': Lizard.dir + 'ui/ui.scroll',
      'UIScrollLayer': Lizard.dir + 'ui/ui.scroll.layer',
      'UIRadioList': Lizard.dir + 'ui/ui.radio.list',
      'UISelect': Lizard.dir + 'ui/ui.select',
      'UIGroupSelect': Lizard.dir + 'ui/ui.group.select',
      'UIGroupList': Lizard.dir + 'ui/ui.group.list',
      'UICalendar': Lizard.dir + 'ui/ui.calendar',
      'UISlider': Lizard.dir + 'ui/ui.slider',
      'UIImageSlider': Lizard.dir + 'ui/ui.image.slider',
      'UIWarning404': Lizard.dir + 'ui/ui.warning404',
      'UIHeader': Lizard.dir + 'ui/ui.header',

      'UIIdentitycard': Lizard.dir + 'ui/ui.identitycard',
      'UILayerList': Lizard.dir + 'ui/ui.layer.list',
      'UIAnimation': Lizard.dir + 'ui/c.ui.animation',

      //所有模板在此
//      'UITemplates': Lizard.dir + 'ui/ui.templates',

      "cGeoService": Lizard.dir + "service/c.service.geo",
      "cMemberService": Lizard.dir + "service/c.service.member",
      "cGuiderService": Lizard.dir + "service/c.service.guider",

      "cHybridMember": Lizard.dir + "service/hybrid/c.hybrid.memberService",
      "cHybridGuider": Lizard.dir + "service/hybrid/c.hybrid.guider",
      "cHybridGeolocation": Lizard.dir + "service/hybrid/c.hybrid.geolocation",
      "cGeoHelper": Lizard.dir + "service/web/c.geo.helper",
      "cWebMember": Lizard.dir + "service/web/c.web.memberService",
      "cWebGuider": Lizard.dir + "service/web/c.web.guider",
      "cWebGeolocation": Lizard.dir + "service/web/c.web.geolocation",

      "cStatic": Lizard.dir + "app/web/c.web.static",
      "cBaseInit": Lizard.dir + "app/c.base.init",
      "cAbstractApp": Lizard.dir + "app/c.abstract.app",
      "cWebApp": Lizard.dir + "app/web/c.web.app",
      "cHybridApp": Lizard.dir + "app/hybrid/c.hybrid.app",
      "cWebViewApp": Lizard.dir + "app/hybrid/c.webview.app",
      "cHybridFacade": Lizard.dir + "app/hybrid/c.hybrid.facade",
      "cHybridShell": Lizard.dir + "app/hybrid/c.hybrid.shell",
      //"cHybridHeader": Lizard.dir + "app/hybrid/c.hybrid.header",
      "cHybridAppInit": Lizard.dir + "app/hybrid/c.hybrid.init",
      "cWebAppInit": Lizard.dir + "app/web/c.web.init"
    },
    "map": {
      "*": {
        "cUtility": "cUtilCommon",
        "cStore": "cLocalStore",
        "cGuider": "cGuiderService",
        "CommonStore":"cCommonStore"
      }
    }
  }); 
})