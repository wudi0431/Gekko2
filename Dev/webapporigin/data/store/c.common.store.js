/**
 * @File c.common.store.js
 * @author zsb张淑滨 <oxz@ctrip.com|shbzhang@ctrip.com>
 * @description 存放H5使用的一些通用Store,如用户信息Store,HeadStore,分销联盟Store,渠道参数Store,渠道信息Store
 */
/**
 * 与用户登录相关的工具方法
 * @namespace Store.cCommonStore
 */
define(['cCoreInherit', 'cUserStore', 'cHeadStore', 'cMarketStore'], function (cCoreInherit, cUserStore, cHeadStore, cMarketStore) {
  var Common = {};

  /**
   * {@link Store.cCommonStore.cUserStore} 的引用
   * @var Store.cCommonStore.UserStore
   */
  Common.UserStore = cUserStore;

  /**
   * {@link Store.cCommonStore.cHeadStore} 的引用
   * @var Store.cCommonStore.HeadStore
   */
  Common.HeadStore = cHeadStore;
	/**
   * 分销联盟Store,{@link Store.cMarketStore.UnionStore} 的引用,不建议BU使用
	 * @var Store.cCommonStore.UnionStore
   * @deprecated
	 */
  Common.UnionStore = cMarketStore.UnionStore;

  /**
   * 保存渠道参数Store,{@link Store.cMarketStore.SalesStore} 的引用,不建议BU使用
   * @var Store.cCommonStore.SalesStore
   * @deprecated
   */
  Common.SalesStore = cMarketStore.SalesStore;

  /**
   * 保存渠道参数Store,{@link Store.cMarketStore.SalesObjectStore} 的引用,不建议BU使用
   * @var Store.cCommonStore.SalesObjectStore
   * @deprecated
   */
  Common.SalesObjectStore = cMarketStore.SalesObjectStore;


  return Common;
});