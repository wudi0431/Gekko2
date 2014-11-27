/**
 * Created by shbzhang on 14/10/13.
 */
/**
 * @File c.head.store.js
 * @author zsb张淑滨 <oxz@ctrip.com|shbzhang@ctrip.com>
 * @description Restful 服务的HeadStore
 */
/**
 * Restful 服务的HeadStore
 * @namespace Store.cCommonStore.cHeadStore
 * @example
 * {
   *  "cid": "27410422-09d4-867b-1458-42d7fa238ee5",  //设备唯一标示，hybird下为10位数字
   *  "ctok": "351858059049938",                      //ctok，遗留结构
   *  "cver": "1.0",                                  //版本号,web为1.0，hybrid为实际内部版本号如509
   *  "lang": "01",                                   //语言，遗留结构，默认01
   *  "sid": "8888",                                  //渠道号，默认8888
   *  "syscode": '09',                                //默认09
   *  "auth": ""                                      //用户auth,未登录为“”
   *  }
 */
define(['cCoreInherit','cLocalStore', 'cUtilCommon'], function (cCoreInherit, cLocalStore,cUtilCommon) {


  var HeadStore = new cCoreInherit.Class(cLocalStore, {
    __propertys__: function () {
      /**
       * HeadStore的键值，默认为HEADSTORE
       * @var {string} cHeadStore.key
       */
      this.key = 'HEADSTORE';
      /**
       * HeadStore的数据过期时间,默认为15D
       * @var {string} cHeadStore.lifeTime
       */
      this.lifeTime = '15D';
      /*
       * HeadStore的默认数据
       * @type {object} cCommonStore.HeadStore.defaultData
       */
      this.defaultData = {
        "cid": cUtilCommon.getGuid(),
        "ctok": "351858059049938",
        "cver": "1.0",
        "lang": "01",
        "sid": "8888",
        "syscode": '09',
        "auth": ""
      };

      //this.defaultData = "sssss";
    },
    /*
     * @method cCommonStore.HeadStore.initialize
     * @param $super
     * @param options
     * @description 复写自顶层Class的initialize，赋值队列
     */
    initialize: function ($super, options) {
      $super(options);
    },

    /**
     * 设置head中的auth字段
     * @method cHeadStore.setAuth
     * @param {string} auth 用户auth
     */
    setAuth: function (auth) {
      this.setAttr('auth', auth);
    }
  });


  return HeadStore;
});