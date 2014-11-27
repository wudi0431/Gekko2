define(['cParserUtil'], function(ParserUtil){
  ParserUtil.getPageConfig = function(parser, pd_init_script) {
    var lizardExpansions = ["appBaseUrl", "webresourceBaseUrl", "restfullApi", "restfullApiHttps", "WebresourcePDBaseUrl"];
    var metas = parser.root.findAll('meta');
    _.each(metas, function (meta) {
      if (meta._attrs && (meta._attrs['lizardExpansion'] || _.contains(lizardExpansions, meta._attrs['name']))) {
        Lizard[meta._attrs['name']] = meta._attrs['content'];
      }
    });
    
    var defaultStr = JSON.stringify({
        "url_schema" : "",
        "model" : {
          "apis" : []
        },
        "view" : {}

      });
    try {
      var configStr = parser.root.find('script', {
          type : 'text/lizard-config'
        }).text();
    } catch (e) {
      var configStr = defaultStr
    }
    if (!configStr)
      configStr = defaultStr;
    var dataexpr = ParserUtil.parseDepend(configStr);
    var ret = {};
    var funcStr = '(function(){' + pd_init_script + ';ret=' + configStr + ';return ret;})()';
    ret = vm.eval(funcStr);
    ret.dataexpr = dataexpr;
    return ret;
  }
  
  ParserUtil.getPageTemplates = function(parser){
    var ret={};
    var templates=parser.root.findAll('script',{
      type:'text/lizard-template'
    });
    
    _.each(templates, function(template){
      var id=template.attr('id');
      if (id){
        ret[id]={
          'runat': template.attr('runat')||'all',
          'text': removeTags(template.text(),'client')
        };
      }
    });    
    return ret;
  }
  
  ParserUtil.urlParse = function(url){
    var arr=url.match(/^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/)||[];
    return {
      href:arr[0]||'',
      hrefNoHash:arr[1]||'',
      hrefNoSearch:arr[2]||'',
      domain:arr[3]||'',
      protocol:arr[4]||'',
      doubleSlash:arr[5]||'',
      authority:arr[6]||'',
      username:arr[8]||'',
      password:arr[9]||'',
      host:arr[10]||'',
      hostname:arr[11]||'',
      port:arr[12]||'',
      pathname:arr[13]||'',
      directory:arr[14]||'',
      filename:arr[15]||'',
      search:arr[16]||'',
      hash:arr[17]||''
    };
  }
 
  ParserUtil.urlFormat = function(urlObj){
    return urlObj.protocol+urlObj.doubleSlash+urlObj.authority+urlObj.pathname+urlObj.search+urlObj.hash;
  }
  
  ParserUtil.hostMapping = function(env,url){
    var objUrl=ParserUtil.urlParse(url);
    objUrl.authority=objUrl.authority.replace(/^([^@]*@)?m.ctrip.com(:\d+)?/i,'$1h5seo.mobile.ctripcorp.com$2');
    var ret=ParserUtil.urlFormat(objUrl);
    return ret;
  }
  
  function removeTags(html,runat){
    var ret=html||'';
    if (/runat=/.test(ret)){
      var hash={};
      var guid='';
      var re;
      while (1){
        guid=(Math.random()*10000).toFixed(0);
        re=new RegExp('lizard_'+guid+'_\\d+','g');
        if (!re.test(ret)){
          break;
        }
      }
      var i=0;
      ret=ret.replace(/<%[\s\S]*?%>/g,function(a){
        var id='/*lizard_'+guid+'_'+i+'*/';
        hash[i]=a;
        i++;
        return id;
      });
      var parser=new htmlParse(ret),node;
      while (node=parser.root.find('*',{
        'runat':runat
      })){
        node.remove();
      }
      ret=parser.root.html();
      re=new RegExp('\\/?\\*lizard_'+guid+'_(\\d+)\\*\\/?','g');
      ret=ret.replace(re,function(a,b){
        return hash[b]||'';
      });
    }
    return ret;
  }
  
  return ParserUtil;
});