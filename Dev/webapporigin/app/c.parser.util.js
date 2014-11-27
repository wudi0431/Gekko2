/**
 * @File c.parser.util.js
 * parser的工具类
 * @author luwei@ctrip.com
 * @version V2.1
 */
define(function(){
  var ParseUtil = {}, uuid = 0;
  ParseUtil.getID = function(url){
    var id= "client_id_viewport_"+(++uuid)+"_"+(new Date().getTime());
    return id;
  }
  
  ParseUtil._containFunc = function(obj, expr)
  {
    var ret = false;
    for (var p in obj)
    {
      if (ret)
      {
        return true;
      }
      if (_.isFunction(obj[p]) && obj[p].toString().indexOf(expr.trim()) > -1)
      {
        obj[p] = obj[p].toString().trim();
        return true;
      }   
      else if (_.isObject(obj[p]) || _.isArray(obj[p]))
      {
        ret = ParseUtil._containFunc(obj[p], expr);
      }       
    }
    return ret;         
  }  
  
  function reString(str) {
    var h = {
        '\r': '\\r',
        '\n': '\\n',
        '\t': '\\t'
    };
    var re1 = /([\.\\\/\+\*\?\[\]\{\}\(\)\^\$\|])/g;
    var re2 = /[\r\t\n]/g;
    return str.replace(re1, "\\$1").replace(re2, function (a) {
      return h[a];
    });
  }
  
  function fixReString(str){
    var chars=str.split('');
    var isInCharDict=false; // []
    var t='';
    var ret=[];
    while (t=chars.shift()){
      ret.push(t);
      if (t=='\\'){
        ret.push(chars.shift());
      }else if (t=='['&&!isInCharDict){
        isInCharDict=true;
      }else if (t==']'&&isInCharDict){
        isInCharDict=false;
       }else if (t=='('&&!isInCharDict){
        if (chars[0] == '?') {
          if (chars[1] == '!') {
          } else if (chars[1] == ':' || chars[1] == '=') {
            chars.shift();
            chars.shift();
            ret.push('?');
            ret.push(':');
          } else {
            ret.push('?');
            ret.push(':');    
          }
        }
      }
    }
    return ret.join('');
  }
  
  function urlParse(urlSchema, url){    
    var paraArr = [], tArr = [], params = {};
    var reStr = urlSchema.replace(/\{\{(.+?)\}\}/g,function(a,b){
      tArr.push(b);
      return '{@'+(tArr.length-1)+'}';
      }).replace(/\{(@?)(.+?)\}|[^\{\}]+/g,function(a,b,c){
        var ret = '';
        if (c){
          if (b){
            var pArr=tArr[c].match(/^(?:(?:\((\w+)\))?([^!=]+?)|([^!=]+?)=(.*))$/);
            if (pArr){
              if (pArr[2]){
                switch (pArr[1]){
                  case 'number':
                    ret='(\\d+(?:\\.\\d*)?|\\.\\d+)';
                    break;
                  case 'int':
                    ret='(\\d+)';
                    break;
                  case 'letter':
                    ret='([a-z _\\-\\$]+)';
                    break;
                  default:
                    ret='([^\\\/]*)';
                    break;
                }
                paraArr.push(pArr[2]);
              }else{
                paraArr.push(pArr[3]);
                if (/^\/.*\/$/.test(pArr[4])){
                  ret='('+fixReString(pArr[4].slice(1,-1))+')';
                }else{
                  var arr = pArr[4].split('||');
                  for (var j = 0;j < arr.length; j++){
                    arr[j]=reString(arr[j]);
                  }
                  ret='('+arr.join('|')+')';
                }
              }
            }else{
              ret='';
            }
          }else{
            paraArr.push(c);
            ret='([^\\\/]*)';
          }
        }else{
          ret=reString(a);
        }
        return ret;
    });        
 
    url = url.replace(/[#\?].*$/g,'');    
    var matches = url.match(new RegExp(reStr,'i')), pathRe = '/([^\/]*)';
    if (reStr[reStr.length - 1] != '\\')
    {
      pathRe = '\\/([^\/]*)'
    }     
    var morePathmatches = url.match(new RegExp(reStr + pathRe,'i'));
    if (matches && !morePathmatches){
      for (var i=0;i<paraArr.length;i++) {
        params[paraArr[i]] = matches[i+1]||null;
      }
      return {reStr: reStr, param: params, index: matches.index};
    } 
    return {};
  }
  
  ParseUtil.getPageUrlschema = function(configStr)
  {
    var ret = '';
    var arr=configStr.match(/([\'\"])?url_schema\1\s*:\s*([\'\"])(.*?)\2/) || configStr.match(/([\'\"])?url_schema\1\s*:\s*\[\s*([\'\"])((.|\s)*?)\2(\s*|,)]/);
    if (arr){
      eval('ret = {' + arr[0] + '}[\'url_schema\']');
      return ret;
    }
    else
    {
      return '';
    }
  }
  
  ParseUtil.getPageParams = function(url, urlschema) {
    url = decodeURIComponent(url);
    var ret = {};
    if (typeof urlschema == 'string')
    {
      urlschema = [urlschema];
    }
    _.each(urlschema, function(item){
      var paraArr = [], paraHash = {};
      var parseRet = Lizard.schema2re(item, url);
      if (parseRet.reStr && parseRet.param)       
      {
        ret = parseRet.param;
      }        
    }); 
    // parseQuery: here cant replace hash to blank coz someone use querystring "from" which contain hash to show where the page come from  
    var queryStr=url.replace(/^[^\?#]*\??/g,'').replace(/#DIALOG_.*$/g,'').replace(/#\|cui-.*$/g,'');
    var searchReg = /([^&=?]+)=([^&]+)/g;
    var urlReg = /\/+.*\?/;
    var arrayReg = /(.+)\[\]$/;
    var match, name, value, isArray;    
    while (match = searchReg.exec(queryStr)) {
      name = match[1].toLowerCase();
      value = match[2];
      isArray = name.match(arrayReg);
      if (urlReg.test(value)) {
        ret[name] = queryStr.substr(queryStr.indexOf(value));
        break;
      } else {
        if (isArray) {
          name = isArray[1];
          ret[name] = ret[name] || [];
          ret[name].push(value);
        } else {
          ret[name] = value;
        }
      }
    }
    
    return ret;
  }
  
  ParseUtil.parseDepend = function(configStr) {
    var ajaxDataMatch = configStr.match(/Lizard.D\(([\'\"])(.*?)([\'\"])\)(.*?)(,|\s)/g), dataexpr = [];
    if (ajaxDataMatch)
    {
      _.each(ajaxDataMatch, function(match){
        var dataexprStr = match.split(',').join('').split('}').join('');
        dataexpr.push(dataexprStr);
      })
    }
    return dataexpr;
  }
  
  ParseUtil._runUnderscore = function(tmpl,datas){
    if (!datas){
      datas={};
    }
    var ret='';
    if (tmpl){
      var compiled = _.template(tmpl);
      var handler = Lizard.T;      
      ret = compiled(datas,{
        Lizard:Lizard
      }).trim();
    }
    return ret;
  }
  
  Lizard.getModels = function(pageConfig)
  {
    if(!pageConfig.model) pageConfig.model= {};
    var apis = pageConfig.model.apis || [], ret = [], dataexpr = pageConfig.dataexpr;
    _.each(apis, function(api){
      api.runat = api.runat||"all";
      if((api.runat == Lizard.renderAt) || api.runat=="all"){
        ret.push(api);
      }   
      if ('suspend' in api)
      {
        api.suspend = api.suspend.toString();
      }
      else
      {
        api.suspend = false;
      }
      _.each(dataexpr, function(p)
      {
        var postdataStr = JSON.stringify(api.postdata);
        if (JSON.stringify(postdataStr).indexOf(p) > -1 || ParseUtil._containFunc(api.postdata, p) || (api.suspend && api.suspend.indexOf(p) > -1))
        {
          if (!api.depends)
          {
            api.depends = [];
            api.expressionMap = {};
          }
          api.depends.push(eval(p.match(/Lizard.D\(([\'\"])(.*?)([\'\"])\)/g)[0].split('Lizard.D').join('')));
          api.expressionMap[p] = dataexpr[p];
        }
      });
    });
    if (_.isFunction(pageConfig.errorBack))
    {
      Lizard.errorBack = pageConfig.errorBack;
    }
    else
    {
      Lizard.errorBack = null;
    }
    return apis;
  } 
    
  /**
   * 根据ID 获取相应的模板
   * @param {String} tmplId 模板的id
   * @param {Object} datas 模板中对应变量属性值
   * @returns {String} result
   * @Method Global.Lizard.T
   * @example
   * //返回值
   * var domString  = Lizard.T("testId")
   * console.log(domString) //" < d i v > < s p a n> 测试字符串</ s p a n></ d i v>"
   */
  Lizard.T = Lizard._T = function(tmplId,datas)
  {
    if (arguments.length == 1)
    {
      var ret = "";
      var t=Lizard.T.lizTmpl[tmplId];
      if (t&&t.runat!=('server')){
        ret = t.text;
      }
      return ret;
    }
    else
    {
      return _runUnderscore(Lizard._T(tmplId),datas);
    }
}
  /**
   * 根据属性Key,获取Url中得参数值
   * @param {String} key 参数名
   * @param {Object|*} [val] 参数值
   * @returns {Object | *}
   * @Method Global.Lizard.P
   * @example
   * //location.href = 'http://ctrip.com/html5/search/index?k=1&from=http:/ctrip.com?a=1&b=3';
   * var k = Lizard.P('k');
   * console.log(k)  //1
   * Lizard.P('k',5)
   * console.log(k)  //5
   */
  Lizard.P = function(key, val)
  {
    var ret=null;
    if (_.isUndefined(val)){
      ret= Lizard.P.lizParam[key] || Lizard.P.lizParam[key.toLowerCase()];
    }else{
      ret=Lizard.P.lizParam[key]=val;
    }
    return ret;
  }  
  Lizard.schema2re = urlParse;

  return ParseUtil;  
});