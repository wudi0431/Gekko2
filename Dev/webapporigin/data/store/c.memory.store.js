/**
 * @File c.memory.store.js
 * @author zsb张淑滨 <oxz@ctrip.com|shbzhang@ctrip.com>
 * @description 将数据放到内存中，根据useLocalStore属性判断是否放到本地
 */
/**
 * 将数据放到内存中，根据useLocalStore属性判断是否放到本地
 * @namespace Store.cMemoryStore
 */
define(['cCoreInherit','cAbstractStore','cMemoryStorage'], function(cCoreInherit,cAbstractStore,cMemoryStorage){
  "use strict";
  var MemStore = new cCoreInherit.Class(cAbstractStore,{
    __propertys__: function () {

	    /**
	     * 内存区数据
	     * @var {*|Object} Store.cMemoryStore.data
	     */
      this.data = null;

      this.key = "memory_store";

      this.sProxy = cMemoryStorage.getInstance();
    },

		/**
		 * @method Store.cMemoryStore.initialize
		 * @param {Object} options
		 * @description 复写自顶层Class的initialize，赋值队列
		 */
    initialize: function ($super,options) {
      $super(options);
    }

  });


  return MemStore;
});