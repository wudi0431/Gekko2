/**
 * @File c.local.storage.js
 * @author zsb张淑滨 <shbzhang@Ctrip.com>
 * @description LocalStorage 存储类
 */
/**
 * 内存对象模拟LocalStorage储类,继承自cAbstractStorage
 * @namespace Storage.cMemoryStorage
 * @extends Storage.cAbstractStorage
 */
define(['cCoreInherit', 'cUtilDate', 'cAbstractStorage'], function (cCoreInherit, cDate, cAbstractStorage) {
  var MemoryStorage = {
    dataMap : {},
    setItem : function(key,val){
      this.dataMap[key] = val
    },
    getItem: function(key){
      return this.dataMap[key];
    },
    removeItem :function(key){
      delete this.dataMap[key]
    },
    clear :function(){
      this.dataMap = {}
    }
  }


  var Storage = new cCoreInherit.Class(cAbstractStorage, {
    __propertys__: function () {

    },

    /**
     * @method Storage.cMemoryStorage.initialize
     * @param {Object} $super
     * @param {Object} options
     * @description 复写自顶层继承自cAbstractStorage的initialize，赋值队列
     */
    initialize: function ($super, opts) {
      this.proxy = MemoryStorage;
      $super(opts);
    }
  });

  Storage.getInstance = function () {
    if (this.instance) {
      return this.instance;
    } else {
      return this.instance = new this();
    }
  };

  return Storage;

});