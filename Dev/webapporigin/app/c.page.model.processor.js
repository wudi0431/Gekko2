define(['cModel', 'cMemoryStore', 'cUtilPath', 'cUtilCacheView', 'cCoreInherit', 'cLocalStore'], function(cModel, mStore, path, CacheViews, cCoreInherit, cStore){
  var cacheModels = new CacheViews;
  function callModels(pageConfig, callback, errorback)
  {
    Lizard.ajaxDatas = {};
    pageConfig.models = Lizard.getModels(pageConfig);
    _.each(pageConfig.models, function(model, index){
      model.modelIndex = index;
    });    
    _processModels(pageConfig, pageConfig.models, [], callback, errorback)
  }
  
  function _processModels(pageConfig, models, datas, callback, errorback)
  {
    if (models.length == 0) {
      callback(datas, pageConfig);
    }    
    else if (!_.some(models, function(model){ return models.error;}))
    {
      var sortedModels = _resortModels(models);
      _.each(sortedModels['todo'], function(model){
        var index = model.modelIndex;
        var url = model.url, emodel = cacheModels.findById(url);
        if (!emodel) {
          emodel = cCoreInherit.Class(cModel, {
            __propertys__: function() {
              this.urlParseRet = path.parseUrl(url);
              this.protocol = this.urlParseRet.protocol.substr(0, this.urlParseRet.protocol.length - 1);
              this.checkAuth = false;
            }
          }).getInstance();
          emodel.setAttr('url', Lizard.restfullApi?path.parseUrl(Lizard.restfullApi).domain +  emodel.urlParseRet.pathname: emodel.urlParseRet.domain + emodel.urlParseRet.pathname);
          _transfuncToVal(model.postdata);
          emodel.setAttr('param', model.postdata);
          var cacheStore = emodel.getResultStore();
          if (!cacheStore) {
            var cachStore = model.storeKey?new cStore({
                key: model.storeKey
            }): new mStore({
                key : url
            });            
            emodel.setAttr('result', cachStore);
          }
          cacheModels.add(url, emodel);
        } else {
          _transfuncToVal(model.postdata);
          emodel.setAttr('param', model.postdata);
        }
        if (model.suspend && eval('(' + model.suspend + ')()'))
        {
          model.done = true;
          datas[index] = {};
          if (_.every(models, function(model){ return model.done; }))
          {
            callback(datas, pageConfig);  
          }       
        }
        else
        {
          emodel.excute(function(data) {
            model.done = true;
            datas[index] = data;
            if (model.name) Lizard.ajaxDatas[model.name] = data;
            onSuccess(pageConfig, datas, sortedModels, callback, errorback);
          },
          function(error) {
            if (_.isFunction(pageConfig.validate) || !(error instanceof XMLHttpRequest)) {
              model.done = true;
              datas[index] = error;              
              onSuccess(pageConfig, datas, sortedModels, callback, errorback);
            } else {
              model.error = true;
              errorback(datas, pageConfig.errorBack);              
            }
          },
          model.ajaxOnly, this)
        }
      });  
    }    
  }
  
  function onSuccess(pageConfig, datas, sortedModels, callback, errorback)
  {    
    if (_.every(pageConfig.models, function(model){return model.done}))
    {
      callback(datas, pageConfig);
    } else if (_.every(sortedModels['todo'], function(model){return model.done})){
      _processModels(pageConfig, sortedModels['left'], datas, callback, errorback)
    }
  }
  
  function _transfuncToVal(obj) {
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (_.isString(obj[p]) && obj[p].indexOf('function') == 0) {
          obj[p] = eval('(' + obj[p] + ')()');
        } else if (_.isObject(obj[p]) || _.isArray(obj[p])) {
          _transfuncToVal(obj[p]);
        }
      }
    }
  }
  
  function _resortModels(models)
  {
    return _.groupBy(models, function(model){
      if (!model.depends || _.every(model.depends, function(depend) {
          return (depend in Lizard.ajaxDatas);
      }))
      {
        return 'todo';
      }
      else
      {
        return 'left';
      }        
    });    
  }
  
  return callModels;
});