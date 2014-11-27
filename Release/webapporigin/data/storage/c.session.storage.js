/**
 * @File c.session.storage.js
 * @author zsb张淑滨 <shbzhang@Ctrip.com>
 * @description SessionStorage 存储类
 */
/**
 * 封装SessionStore存储类,继承自cAbstractStorage
 * @namespace Storage.cSessionStorage
 * @extends Storage.cAbstractStorage
 */
define(['cCoreInherit', 'cAbstractStorage'], function (cCoreInherit, cAbstractStorage) {

  var Storage = new cCoreInherit.Class(cAbstractStorage, {
    __propertys__: function () {

    },

    /**
     * @method Storage.cSessionStorage.initialize
     * @param {Object} $super
     * @param {Object} options
     * @description 复写自顶层继承自cAbstractStorage的initialize，赋值队列
     */
    initialize: function ($super, opts) {
      this.proxy = window.sessionStorage;
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

  Storage.sessionStorage = Storage.getInstance();
  return Storage;
});