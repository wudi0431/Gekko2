/**
 * @File c.page.parser.js
 * Lizard 解析类
 * @author wxj@ctrip.com/luwei@ctripcom
 * @version V2.1
 */
define(['cCoreInherit', 'cLocalStore', 'cCommonStore', 'cParserUtil'], function(cCoreInherit, cStore, CommonStore, ParseUtil){
  var pageDocNode = null;
  _.each(_.keys(ParseUtil), function(key){
    window[key] = ParseUtil[key];
  })
  
  function getPageConfigStr()
  {    
    var configStr = pageDocNode.find('script[type="text/lizard-config"]').text();
    if (!configStr)
    {
      configStr = '{"url_schema": "","model": {"apis": []},"view":{}}';
    }
    return configStr;
  }
  /**
    获取页面配置
   */
  function getPageConfig(){  
    var configStr = getPageConfigStr();  
    var dataexpr = parseDepend(configStr);
    eval('var ret = ' + configStr);
    if (!ret.viewName)
    {
      var viewName = ret.controller.substring(ret.controller.lastIndexOf('/') + 1);
      ret.viewName = viewName.substring(0, viewName.indexOf('.'));
    }
    ret.dataexpr = dataexpr;
    return ret;
  }
  /**
    获取页面templates
  */
  function getPageTemplates(){    
    var ret={}, templates = pageDocNode.find('script[type="text/lizard-template"]');
    _.each(templates, function(template){
      var tmplNode = $(template);
      if (tmplNode.attr('id')){
        ret[tmplNode.attr('id')]={
          'runat': tmplNode.attr('runat')||'all',
          'text': removeTags(tmplNode.text(), 'client')
        };
      }
    });
    return ret;
  }
  function removeTags(html,runat){
    var pageNode = $('<SCRIPT>' + html + '</SCRIPT>');
    pageNode.find('[runat=' + runat + ']').remove();
    return pageNode.text();
  }
  
  Lizard._initParser = function(url, html)
  {
    pageDocNode = $('<DIV>' + html + '</DIV>'); 
    Lizard.T.lizTmpl = getPageTemplates();
    Lizard.P.lizParam = getPageParams(url, getPageUrlschema(getPageConfigStr()));
    var pageConfig = getPageConfig();
    pageConfig.pageUrl = url;
    return pageConfig;
  }  

  /**
   * 获取localStorage, 主要是在模板的filter中使用
   * @param {String} storeName 要存取到localStorage中的key
   * @param {String} [key]  返回对象的某个属性值
   * @param {Object|*} defaultvalue 缓存中没有值时，默认返回的值
   * @returns {Object|*} 返回存储的数据
   * @Method Global.Lizard.S
   * @example
   * //参数 storename值
   * 'SALES','SALES_OBJECT','UNION'等等
   */
  Lizard.S = function(stroename, key, defaultvalue)
  {
    if (!this.loacaStores)
    {
      this.loacaStores = {};
    }
    if (!this.loacaStores[stroename])
    {
      if (stroename == 'SALES')
      {
        this.loacaStores[stroename] = CommonStore.SalesStore;
      }
      else if (stroename == 'SALES_OBJECT')
      {
        this.loacaStores[stroename] = CommonStore.SalesObjectStore;
      }
      else if (stroename == 'UNION')
      {
        this.loacaStores[stroename] = CommonStore.UnionStore;
      }
      else
      {
        this.loacaStores[stroename]  = new cCoreInherit.Class(cStore, {
          __propertys__: function () {
            this.key = stroename;
          }
        });
      }
    }
    if (!key)
    {
      return this.loacaStores[stroename].getInstance().get();
    }
    if (!this.loacaStores[stroename].getInstance().get())
    {
      return defaultvalue;
    }
    return this.loacaStores[stroename].getInstance().get().hasOwnProperty(key)? this.loacaStores[stroename].getInstance().get()[key] :defaultvalue;         
  }

 /**
  * 根据lizard-config的Models的配置，获取相应ajax请求值
  * @param {String} apiName  models中的apis
  * @return {Object| null} api的请求返回值
  * @Method Global.Lizard.D
  * @example
  * "model":{
  *    apis:[
  *       {
  *         url:'http://m.ctrip.com/d/list2',
  *         postdata: {
  *           limit: 2
  *         },
  *         name: 'list2'
  *       }
  *    ]
  * }
  * Lizard.D('list2')
  */
  Lizard.D = function(apiName)
  {
    if (this.ajaxDatas && this.ajaxDatas[apiName])
    {
      return this.ajaxDatas[apiName];
    }       
    return null;
  }  
  
  function _setTDKInfo(datas, pageConfig)
  {
    var TDKStr = [];
    var TDK = pageConfig.model.setTDK ? pageConfig.model.setTDK(datas) : {};
    var title = pageDocNode.find('title');
    if (TDK.title) {
      if(title) title.remove();
      TDKStr.push('<title>'+TDK.title+'</title>');
    }
    _.each(TDK, function(val, key){
      if (!val)
      {
        return;
      } 
      var metaNode = pageDocNode.find('meta[name="' + key + '"]');
      if (metaNode) metaNode.remove();
      TDKStr.push('<meta name="' + key + '" content="' + val + '" />');
    });
            
    return {TDK: TDK, TDKStr: TDKStr.join('')};            
  }
  
  function _setUBTInfo()
  {
    var varNames = ['page_id', 'bf_ubt_orderid', 'ab_testing_tracker'];
    _.each(varNames,function(varName){
      var values = '';
      var node = pageDocNode.find('#' + varName);
      if (node.get(0))
      {
        values = node.val();
      }
      eval(varName + ' = \'' + values + '\'')
    });
    if(_.isArray(ab_testing_tracker) ){
      var ret = [];
      _.each(ab_testing_tracker, function(val,key){
        _.each(val.attr("value").split(";"),function(val1,key1){
          if(val1){
            ret.push(val1);
          }
        });
      });
      ab_testing_tracker = ret.join(";");
    }
  }
  
  Lizard.render = function(pageConfig, datas, dialogInfo)
  {
    var ret = {
      header: '',
      viewport: ''
    };
    
    var validateRet = true;
    if (_.isFunction(pageConfig.validate))
    {
      validateRet = pageConfig.validate(datas);
      if (!validateRet && _.isFunction(pageConfig.modelOnError))
      {
        ret = pageConfig.modelOnError(datas);
      }         
    }
    else
    {
      var result = _setTDKInfo(datas, pageConfig);
      if (arguments.length == 2)
      {
        _setUBTInfo();
      }
      if (pageConfig.model.filter){
        datas = pageConfig.model.filter.call(this, datas, result.TDK);
      }
    }
    
    for (var tmplName in pageConfig.view){
      if (pageConfig.view.hasOwnProperty(tmplName)){
        ret[tmplName] = _runUnderscore(pageConfig.view[tmplName],datas);
      }
    }

    var id = dialogInfo? dialogInfo.pageID + "$" + dialogInfo.dialogName: getID(pageConfig.pageUrl); 
    
    ret.viewport = ['<div id="', id, '" page-url="', pageConfig.pageUrl, '">', ret.viewport, '</div>'].join('').trim();
    ret.id = id;
    ret.controller = pageConfig.controller;
    ret.config = pageConfig;
    ret.datas = datas;
    ret.lizTmpl = Lizard.T.lizTmpl;
    ret.lizParam = Lizard.P.lizParam;
    ret.TDK = result.TDKStr;
    ret.validateRet = validateRet;
    if (dialogInfo)
    {
      ret = _.extend(ret, dialogInfo.ubtInfo)
    }
    else
    {
      ret.page_id = page_id;
      ret.ab_testing_tracker = ab_testing_tracker;
      ret.bf_ubt_orderid = bf_ubt_orderid;
    }
    return ret; 
  }
  
  Lizard.getController = function(pageConfig)
  {
    return pageConfig.controller
  }
});