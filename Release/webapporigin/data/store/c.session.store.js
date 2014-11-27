/**
 * @File c.session.store.js
 * @author zsb张淑滨 <shbzhang@Ctrip.com>
 * @description 以SessionStorage为数据存储的Store
 */
/**
 * 以SessionStorage为数据存储的Store
 * @namespace Store.cSessionStore
 * @augments Store.cAbstractStore
 * @example
 *  define(['cCoreInherit','cSessionStore'], function (cCoreInherit,cSessionStore ) {
 *    var StoreCase = new cCoreInherit.Class(cSessionStore, {
 *      __propertys__: function () {
 *        this.key = 'STORAGE_EXAMPLE', //设置key值
 *        this.lifeTime = '2D',          //浏览器不关闭情况下,超时时间两天
 *        this.defaultData = {
 *          name : ""
 *        }
 *      },
 *      initialize:    function ($super, options) {
 *        $super(options);
 *      }
 *    });
 *
 *    return  StoreCase;
 *  });
 *
 * var demoStore = StoreCase.getInstance();
 * var data = {'name':'擎天柱'}
 * demoStore.set(data);
 */
define(['cCoreInherit','cAbstractStore','cSessionStorage'], function (cCoreInherit,cAbstractStore,cSessionStorage) {

  var sessionStore = new cCoreInherit.Class(cAbstractStore,{
    __propertys__: function () {
	    /*
	     *store的数据存储对象
	     * @type {*|e.UnionStore.getInstance|e.SalesStore.getInstance|Object|c.common.store.UnionStore.getInstance|c.common.store.SalesStore.getInstance}
	     */
      this.sProxy = cSessionStorage.getInstance();
    },
	  /**
	   * @method cSessionStore.initialize
	   * @param $super
	   * @param options
	   * @description 复写自顶层Class的initialize，赋值队列
	   */
    initialize: function ($super, options) {
      $super(options);
    }
  });

  return sessionStore;
});