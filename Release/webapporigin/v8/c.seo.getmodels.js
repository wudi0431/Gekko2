define(['cSeoEntendUtil'], function (ParserUtil) {
  var pd_script = '';
  function transfuncToVal(obj) {
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (_.isString(obj[p]) && obj[p].indexOf('function') == 0) {
          funcStr = '(function(){\r\n' + pd_script + '; return (' + obj[p] + ')();})()';
          obj[p] = vm.eval(funcStr);
        } else if (_.isObject(obj[p]) || _.isArray(obj[p])) {
          transfuncToVal(obj[p]);
        }
      }
    }
  }
  
  LizardGetModels = function () {
    var url = arguments[0],
    html = arguments[1],
    fetchedDatas = arguments[2],
    funcStr,
    parser = new htmlParse(html),
    pdInitScript = parser.root.find('script', {
        pd_init : 1
      });

    if (!fetchedDatas) {
      if (pdInitScript) {
        return JSON.stringify({
          bProceed : true,
          models : [{
              url : ParserUtil.hostMapping(null, pdInitScript._attrs['src']),
              postdata : '',
              name : '100'
            }
          ],
          fetchedDatas : arguments[2]
        });
      } else {
        fetchedDatas = {
          100 : ''
        };
      }
    } else if (!pdInitScript) {
      fetchedDatas[100] = '';
    }
    pd_script = fetchedDatas[100];
    Lizard.P.lizParam = ParserUtil.getPageParams(url, ParserUtil.getPageUrlschema(parser.root.find('script', {
      type : 'text/lizard-config'
    }).text()));
    Lizard.T.lizTmpl = ParserUtil.getPageTemplates(parser);
    var pageConfig = ParserUtil.getPageConfig(parser, fetchedDatas[100]);    
    var models = Lizard.getModels(pageConfig);

    _.each(models, function (api) {
      var url = ParserUtil.hostMapping(null, api.url);
      var postdata = api.postdata || {};
      if (!postdata.head) {
        postdata.head = {
          "cid" : (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()),
          "ctok" : "351858059049938",
          "cver" : "1.0",
          "lang" : "01",
          "sid" : "8888",
          "syscode" : '09',
          "auth" : ""
        };
      }
      postdata.head.syscode = "09";
    });

    var indexMap = {};
    _.each(models, function (model, index) {
      if (model.name) {
        indexMap[index] = model.name;
      }
      model.name = index;
    });
    var leftmodels = models;

    if (_.size(fetchedDatas) > 0) {
      Lizard.D = function (name) {
        for (var p in indexMap) {
          if (indexMap[p] == name) {
            return fetchedDatas[p]
          }
        }
      }
      leftmodels = _.filter(models, function (model, index) {
          if (fetchedDatas[index]) {
            return false;
          }
          if (_.every(model.depends, function (depend) {
            if (fetchedDatas) {
              for (var p in indexMap) {
                if (indexMap[p] == depend && fetchedDatas[p]) {
                  return true;
                }
              }
            }
            return false;
            }) && model.suspend && vm.eval('(function(){\r\n' + fetchedDatas[100] + ';return (' + model.suspend + ')()})()')) {
              return false;
            }
          return true;
        });
    }
    if (leftmodels.length) {
      leftmodels = _.filter(leftmodels, function (model) {
          return !model.depends || _.every(model.depends, function (depend) {
            if (fetchedDatas) {
              for (var p in indexMap) {
                if (indexMap[p] == depend && fetchedDatas[p]) {
                  return true;
                }
              }
            }
            return false;
          });
        });
    }

    if (leftmodels.length) {
      _.each(leftmodels, function (model) {
        funcStr = '(function(){\r\n' + fetchedDatas[100] + ';transfuncToVal(model);})()';
        model = vm.eval(funcStr, {
            model : model,
            transfuncToVal : transfuncToVal
          });
      })
    }
    return JSON.stringify({
      bProceed : (leftmodels.length + _.size(fetchedDatas) < models.length + 1) && leftmodels.length != 0,
      models : leftmodels,
      fetchedDatas : arguments[2]
    });
  }  

  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
});
