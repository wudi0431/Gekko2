/**
 * @File c.util.perfomance.js
 * @Description: 性能统计工具类
 * @author jiangjing@ctrip.com
 * @date 2014-09-28 13:11:48
 * @version V1.0
 */

/**
 * 与性能统计相关方法,内部使用
 * @namespace Util.cUtilPerformance
 */
define(function(){
    /*ubt性能采集*/
    function Performance() {
      this.performance = {};
      this.isapp = Lizard.isHybrid ? "1" : "0";
      this.defaults = {
        "Domready":       {
          "name": "JS.Lizard.Domready",
          "tags": {}
        },
        "Onload":         {
          "name": "JS.Lizard.Onload",
          "tags": {}
        },
        "AjaxReady":      {
          "name": "JS.Lizard.AjaxReady",
          "tags": {
            "url": ""
          }
        },

        /* JIANG Jing … 2014-08-19 */
        /* 记录 AJAX 响应的消息体长度信息 */
        "AjaxMessageSize":     {
          "name": "JS.Lizard.AjaxMessageSize",
          "tags": {
            "url": ""
            /*"contentEncoding" : "" tag暂时不能传空字符串，java端没有修复完毕*/
            /* 暂不记录分布区间信息 */
          }
        },

        "TemplateRender": {
          "name": "JS.Lizard.TemplateRender",
          "tags": {
            "url":""
          }
        },
        "GeoRequest": {
          "name": "JS.Lizard.GeoRequest",
          "tags": {
            "url":"",
            //+1……2014-09-12……JIANGJing
            "errno":"0"
          }
        }
      }
      this.uuid = 0;
    }
    
    if (!window.__bfi) {
      window.__bfi = [];
    }

    Performance.prototype = {

      send:     function (name, tag, value, ts) {
        var sendKey = ['_trackMatrix', name, tag, value, ts];
        //+1……2014-09-10……JIANGJing……临时禁用GeoRequest中除指定之外的其他性能监控点
        if (name == 'JS.Lizard.GeoRequest' && (typeof tag.url != 'string' || !tag.url.match(/^(Native|Web) function (number|detail|error)$/))) { return; }
        window.__bfi.push(sendKey);
      },

      //+…2014-08-19
      /* 获取规范格式的当前时间 */
      getTime: function() {
        return (new Date).getTime();
      },
      
      //+…2014-08-19
      /* 初始化选项值 */
      initOptions: function(opt) {
        //opt.startTime = this.getTime();
        opt.version = Lizard.version; /*lizard版本号*/
        opt.isapp =  this.isapp;  /*web/hybrid*/
        opt.network   = Lizard.networkType || 'unknown';  /*网络状况2g/3g/wifi*/
      },
      
      //+…2014-08-19
      /* 用于记录非时间长度值 */
      /**
       * 用于记录非时间长度值
       * @param opt
       * @param value
       */
      log: function(opt, value) {
        if (opt.url && _.isString(opt.url)) 
        {
          opt.url = opt.url.replace(new RegExp((+new Date()+'').slice(0,8)+'\\d{5}'),'__TIME__');
        }
        var def  = this.defaults[opt.name], tags = {};

        this.initOptions(tags);

        // 标签数据
        for (var key in def.tags) {
          tags[key] = (opt[key] || def.tags[key]) + '';
        }

        
        
        /*if (tags.distribution) {
          tags.distribution = this.distribution(value);
        }*/
        if(opt.name != "AjaxMessageSize"){/*ajaxmessagesize暂时不记录distribution*/
          tags.distribution = this.distribution(value);
        }

        this.send(def.name, tags, value, this.getTime());
      },

      group:    function (id, opt) {
        //-1…2014-08-19
        // opt.startTime = (new Date).getTime();
        //+1…2014-08-19
        opt.startTime = this.getTime();
        //-1…2014-08-19
        // opt.network = Lizard.networkType || 'unknown';
        this.performance[id] = opt;        
      },

      //+……2014-09-12……JIANGJing……读写 tag 值
      groupTag: function(id, tagname, /*OPTIONAL*/ value) {        
        var opt = this.performance[id];
        if (!opt) { 
          this.performance[id] = opt = {};
        }

        if (arguments.length == 3) {
          opt[tagname] = value;
        }

        return opt[tagname];
      },

      groupEnd: function (id) {
        var opt = this.performance[id] || {};

        //-15…2014-08-19…主要功能移至 Performace.prototype.log()
        // var defaults = this.defaults
        // var def = defaults[opt.name];
        // var tags = def.tags;
        // var matrixName = def.name;
        // var matrixTag = {};
        // for (var key in tags) {
        //   matrixTag[key] = opt[key] || tags[key];
        // }
        // //matrixTag = { url: 'http://mubt.test.sh.ctriptravel.com/index.html', distribution: "200-800" }
        // var ts = (new Date).getTime();
        // var matrixValue = ts - opt["startTime"]; 
        // if (matrixTag.distribution) {
        //   matrixTag.distribution = this.distribution(matrixValue);
        // }
        // this.send(matrixName, matrixTag, matrixValue, ts)
        //+1…2014-08-19
        this.log(opt, this.getTime() - opt.startTime);
      },
      getUuid:  function () {
        return "Performance_" + (++this.uuid);
      },
      
      distribution: function (time) {
        var ret = "";
        if (0 <= time & time <= 500) {
          ret = '[0,500]';
        } else if (501 <= time & time <= 1000) {
          ret = '[501,1000]';
        } else if (1001 <= time & time <= 2000) {
          ret = '[1001,2000]';
        } else if (2001 <= time & time <= 3000) {
          ret = '[2001,3000]';
        } else if (3001 <= time & time <= 4000) {
          ret = '[3001,4000]';
        } else if (4001 <= time) {
          ret = '[4001,--]';
        }
        return ret + "(ms)";
      }
    }
    
    return new Performance; 
});
