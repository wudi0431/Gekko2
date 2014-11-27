/**
 * Created by shbzhang on 14/10/13.
 */
/**
 * @File c.common.store.js
 * @author zsb张淑滨 <oxz@ctrip.com|shbzhang@ctrip.com>
 * @description 存放H5使用的一些通用Store,如用户信息Store,HeadStore,分销联盟Store,渠道参数Store,渠道信息Store
 */

/**
 * 市场营销Store
 * @nameSpace Store.cMarketStore
 */
define(['cCoreInherit', 'cLocalStore', 'cLocalStorage', 'cUtilCommon'], function (cCoreInherit, cLocalStore, cLocalStorage,cUtilCommon) {
  var Common = {};
  var ls = cLocalStorage.localStorage;


  /**
   * @namespace Store.cMarketStore.UnionStore
   * @description 分销联盟Store
   */
  Common.UnionStore = new cCoreInherit.Class(cLocalStore, {
    __propertys__: function () {
      /**
       * UnionStore的键值
       * @var {String} UnionStore.key
       */
      this.key = 'UNION';
      /**
       * UnionStore的数据过期时间
       * @var {String} [UnionStore.lifeTime=7D] 过期时间，默认七天
       */
      this.lifeTime = '7D';
      /*
       * UnionStore的本地存储对象
       * @var {object} UnionStore.store
       */
      this.store = cLocalStorage.localStorage;
    },
    /**
     * @method CommonStore.UnionStore.initialize
     * @param $super
     * @param options
     * @description 复写自顶层Class的initialize，赋值队列
     */
    initialize: function ($super, options) {
      $super(options);
    },

    /**
     * 返回分销联盟数据
     * @method UnionStore.get
     * @returns {*|null} data 分销联盟数据
     */
    get: function () {
      var data = this.store.oldGet(this.key);
      return data && data.data || null;
    }
  });

  /**
   * 保存渠道参数Store
   * @namespace Store.cMarketStore.SalesStore
   */
  Common.SalesStore = new cCoreInherit.Class(cLocalStore, {
    __propertys__: function () {
      /**
       * SalesStore 的键值
       * @var {String} [Store.cMarketStore.SalesStore.key=SALES]
       */
      this.key = 'SALES';
      /**
       * SalesStore的数据过期时间
       * @var {String} [Store.cMarketStore.SalesStore.lifeTime = 30D]
       */
      this.lifeTime = '30D';
      /*
       * SalesStore的数据过期时间
       * @var {Object} SalesStore.store
       */
      this.store = cLocalStorage.localStorage;
    },
    /*
     * @method SalesStore.initialize
     * @param $super
     * @param options
     * @description 复写自顶层Class的initialize，赋值队列
     */
    initialize: function ($super, options) {
      $super(options);
    },

    /**
     * @method SalesStore.get
     * @returns {Object} data
     * @description 返回Store中保存的数据
     */
    get: function () {
      var data = this.store.oldGet(this.key);
      return data && data.data || null;
    }

  });

  /**
   * @description   渠道信息Store
   * @namespace Store.cMarketStore.SalesObjectStore
   */
  Common.SalesObjectStore = new cCoreInherit.Class(cLocalStore, {
    __propertys__: function () {
      /*
       * SalesObjectStore的键值
       * @type {String}
       */
      this.key = 'SALES_OBJECT';
      /*
       * SalesObjectStore的过期时间
       * @type {string}
       */
      this.lifeTime = '30D';
    },
    /**
     * @method CommonStore.SalesObjectStore.initialize
     * @param $super
     * @param options
     * @description 复写自顶层Class的initialize，赋值队列
     */
    initialize: function ($super, options) {
      $super(options);
    }
  });

  Common.UnionStore.getInstance = Common.SalesStore.getInstance = function() {
    return this.instance || new this();
  };
  return Common;
});