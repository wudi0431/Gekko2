/**
 * 面向 H5 开发人员，提供调用 HybridAPI 的界面。
 * 此界面为向前兼容而写作，新开发中请尽量直接使用 cHybridShell 中提供的方法。
 * @author jiangjing@ctrip.com （旧版作者 cmli@Ctrip.com）
 * @deprecated since Lizard 2.1 / APP 6.0
 * @see cHybridShell
 */
define(['cHybridShell', 'cCommonStore'], function(cHybridShell, CommonStore) {
	'use strict'

	// 针对每一个方法索引名：
	// ⑴ 在旧版本中，所有 cHybridFacade.request() 调用均以参数集合为为唯一参数，因此：
	//    如果方法索引名对应的 Hybrid API 方法需要参数，请将其对应的参数集合键值按顺序放在 argnames 数组中；
	// ⑵ 如果方法标签名（Hybrid）无法由方法索引名按约定规则生成，请用 tagname 属性指示其正确的方法标签名（Hybrid）；
	// ⑶ 如果方法参数需要特殊处理，请指定 parseArgs 函数；
	// ⑷ 如果方法回调函数需要特殊处理，请指定 parseCallback 函数。

	// e.g. 
	//   INDEX_NAME: { 
	//     // 匹配的方法标签名（Hybrid）
	//     tagname: 'TAG_NAME', 
	//
	//     // 参数表，顺序应与 Hybrid API 方法形参一致，以下假设 options 为 cHybridFacade.request(options) 实参。
	//     argnames: [ 
	//       // 该位置实参将取值 options.p1
	//       'p1',
	//       // 该位置实参将忽略 options，直接取值为 1000
	//       [ 1000 ],
	//       // 若 option.p3 为非真值，该位置实参取值为 0 
	//       { p3: 0 },
	//       // 将 options.p4 作为函数参数，取返回值为该位置实参
	//       { p4: function(value) { if (!value) return 1000; } }
	//     ],
	//     
	//     // Hybrid API 将以该方法的返回值为实参
	//     parseArgs: function(options) { return options; },
	//     
	//     // 回调函数预处理
	//     parseCallback: function(options) { return function() {}; } //
	//   },
	var METHOD_INFO = {
		ABORT_HTTP_PIPE_REQUEST             : { argnames: [ 'sequenceId' ] },
		ADD_WEIXIN_FRIEND                   : {},
		APP_CALL_SYSTEM_SHARE               : { argnames: [ 'imageRelativePath', 'text', 'title', 'linkUrl', 'isIOSSystemShare' ] },
		APP_CHECK_ANDROID_PACKAGE_INFO      : {},
		APP_CHECK_NETWORK_STATUS            : {},
		APP_CHOOSE_INVOICE_TITLE            : { argnames: [ 'title' ] },
		APP_CHOOSE_PHOTO                    : { argnames: [ {maxFileSize: 200}, {maxPhotoCount: 1}, {meta: { canEditSinglePhoto: false }} ] },
		APP_FINISHED_LOGIN                  : { argnames: [ 'userInfo' ] },
		APP_FINISHED_REGISTER               : { argnames: [ 'userInfo' ] },
		APP_GET_DEVICE_INFO                 : {},
		APP_LOG_GOOGLE_REMARKTING           : { argnames: [ {url: function() { return window.location.href; }} ] },
		APP_NETWORK_DID_CHANGED             : {},
		APP_READ_VERIFICATION_CODE_FROM_SMS : {},
		APP_SHOW_MAP_WITH_POI_LIST          : { tagname: 'show_map_with_POI_list', argnames: [ 'poiList' ] },
		APP_SHOW_VOICE_SEARCH               : { argnames: [ 'bussinessType' ] },
		AUTO_LOGIN                          : { tagname: 'member_auto_login' },
		BACK                                : {},
		BACK_TO_BOOK_CAR                    : {},
		BACK_TO_HOME                        : {},
		BACK_TO_LAST_PAGE                   : { argnames: [ {param: ''} ] },
		BECOME_ACTIVE                       : {},
		CALL_PHONE                          : { argnames: [ 'tel' ] },
		
		// @todo 不需要提供电话号码吗？
		CALL_SERVICE_CENTER                 : { tagname: 'call_phone' },

		CHECK_APP_INSTALL                   : { tagname: 'check_app_install_status', argnames: [ 'url', 'package' ] },
		CHECK_FILE_EXIST                    : { argnames: [ 'fileName', 'relativeFilePath' ] },
		CHECK_PAY_APP_INSTALL_STATUS        : {},
		CHECK_UPDATE                        : {},
		CHOOSE_CONTACT_FROM_ADDRESSBOOK     : {},
		CITY_CHOOSE                         : { tagname: 'cityChoose' },
		COMMIT                              : {},
		COPY_TO_CLIPBOARD                   : { tagname: 'copy_string_to_clipboard', argnames: [ 'content' ] },
		CROSS_DOMAIN_HREF                   : { argnames: [ 'moduleType', 'anchor', 'param' ] },
		CROSS_JUMP                          : { tagname: 'cross_package_href', argnames: [ 'path', 'param' ] },
		DELETE_FILE                         : { argnames: [ 'fileName', 'relativeFilePath' ] },
		DOWNLOAD_DATA                       : { argnames: [ 'url', 'suffix' ]},
		ENABLE_DRAG_ANIMATION               : { argnames: [ 'show' ] },
		ENCRYPT_BASE64                      : { tagname: 'base64_encode', argnames: [ 'info' ] },
		ENCRYPT_CTRIP                       : { tagname: 'ctrip_encrypt', argnames: [ 'inString', 'encType' ] },

		// @deprecated
		ENTRY                               : {}, 

		FAVORITE                            : {},
		FAVORITED                           : {},
		GET_CURRENT_SANDBOX_NAME            : {},
		GET_FILE_SIZE                       : { argnames: [ 'fileName', 'relativeFilePath' ] },
		GO_TO_BOOK_CAR_FINISHED_PAGE        : { argnames: [ 'url' ] },
		GO_TO_HOTEL_DETAIL                  : { argnames: [ 'hotelId', 'hotelName', 'cityId', 'isOverSea' ] },
		H5_NEED_REFRESH                     : {},
		H5_PAGE_FINISH_LOADING              : {},
		HIDE_LOADING_PAGE                   : {},
		INIT                                : { tagname: 'init_member_H5_info' },

		LOCATE                              : { 
			argnames: [ [3000], [true] ], 
			parseCallback: function(options) {
				return function(params) {
					try { options.success(params); } catch (ex) { options.error(params); }
				};
			}
		},

		LOG_EVENT                           : { argnames: [ 'event_name' ] },
		MAKE_DIR                            : { argnames: [ 'dirname', 'relativeFilePath' ] },
		MEMBER_LOGIN                        : { argnames: [ 'isShowNonMemberLogin' ] },
		NATIVE_LOG                          : { tagname: 'log' },
		NON_MEMBER_LOGIN                    : {},
		OPEN_ADV_PAGE                       : { argnames: [ 'url' ] },
		OPEN_PAY_APP_BY_URL                 : { argnames: [ 'payAppName', 'payURL', 'successRelativeURL', 'detailRelativeURL' ] },
		OPEN_URL                            : { argnames: [ 'openUrl', 'targetMode', {title: ''}, {pageName: ''}, {isShowLoadingPage: false}] },
		PHONE                               : {},
		READ_FROM_CLIPBOARD                 : { tagname: 'read_copied_string_from_clipboard' },
		READ_TEXT_FROM_FILE                 : { argnames: [ 'fileName', 'relativeFilePath' ] },
		RECOMMEND_APP_TO_FRIEND             : { tagname: 'recommend_app_to_friends' },
		REFRESH_NATIVE                      : { tagname: 'refresh_native_page', argnames: [ 'package', 'json' ] },
		REFRESH_NAV_BAR                     : { argnames: [ 'config' ] },
		REGISTER                            : { tagname: 'member_register' },
		SAVE_PHOTO                          : { argnames: [ 'photoUrl', 'photoBase64String', 'imageName' ] },
		SEARCH                              : {},
		SEND_H5_PIPE_REQUEST                : { argnames: [ 'serviceCode', 'header', 'data', 'sequenceId', {pipeType: ''} ] },
		SEND_HTTP_PIPE_REQUEST              : { argnames: [ 'target', 'methods', 'header', 'queryData', 'retryInfo', 'sequenceId' ] },
		SET_NAVBAR_HIDDEN                   : { argnames: [ 'isNeedHidden' ] },
		SET_TOOLBAR_HIDDEN                  : { argnames: [ 'isNeedHidden' ] },
		SHARE                               : {},
		SHARE_TO_VENDOR                     : { tagname: 'call_system_share', argnames: [ 'imgUrl', 'text', {title: ''}, {linkUrl: ''}, {isIOSSystemShare: false} ] },
		SHOW_LOADING_PAGE                   : {},
		SHOW_MAP                            : { argnames: [ 'latitude', 'longitude', 'title', 'subtitle' ] },
		SHOW_NEWEST_INTRODUCTION            : {},
		WEB_VEW_DID_APPEAR                  : { tagname: 'web_view_did_appear' },
		WEB_VIEW_DID_APPEAR                 : {},
		WEB_VIEW_FINISHED_LOAD              : {},
		WRITE_TEXT_TO_FILE                  : { argnames: [ 'text', 'fileName', 'relativeFilePath', 'isAppend' ] } 
	};

	var _ME = {
		methodInfo: function(name) {
			var info = METHOD_INFO[name];

			// 如未指定匹配的方法标签名（Hybrid），则按默认规则自动生成。
			if (!info.tagname) {
				info.tagname = name.toLowerCase().replace(/^app_/, '');
			}

			return info;
		},

		// 方法索引名转换成方法标签名（Lizard）
		name2var: function(name) { return 'METHOD_' + name; },

		// 方法标签名（Lizard）转换成方法索引名
		var2name: function(varname) { return varname.substr(7); },

		var2tagname: function(varname) {
			var name = _ME.var2name(varname), info = _ME.methodInfo(name);
			return info.tagname;
		}
	};

	var exports = {
		/**
		 * 初始化。
		 * @singleton
		 */
		init: function() {
			var _me = exports.init;
			if (_me.called) return; _me.called = true;
			
			// 执行初始化。
			cHybridShell.init();

			// 按 cHybridFacade 在程序架构中的角色，它的任务应是忠实地代理 Hybrid API，而不应介入业务逻辑处理。
			// 如确需作全局处理，应在其他特定的工具类中进行封装。
			var callback, pretreater, posttreater;

			pretreater = function(log, result) {
				if (!window.localStorage.getItem('isPreProduction')) cHybridShell.abort();
				return [ '@[Wireless H5] ' + log, result ];
			};
			cHybridShell.preTreat('log', pretreater);

			callback = function(params) {
				if (params && params.data) {
					var userStore = CommonStore.UserStore.getInstance();
					var userInfo = userStore.getUser();
					userStore.setUser(params.data);

					var headStore = CommonStore.HeadStore.getInstance();
					var headInfo = headStore.get();
					headInfo.auth = params.data.Auth;
					headStore.set(headInfo);
				}
			};
			cHybridShell
				.upon('init_member_H5_info', callback)
				.upon('member_auto_login'  , callback)
				.upon('member_login'       , callback)
				.upon('member_register'    , callback)
				.upon('non_member_login'   , callback);

			callback = function(params) {
				if (typeof params == 'undefined') return;

				var store = {
					SERVERDATE      : params.timestamp       ,
					SOURCEID        : params.sourceId        ,
					isPreProduction : params.isPreProduction 
				};

				if (params.device) {
					store.DEVICEINFO = JSON.stringify({ device: params.device });
				}   
				
				if (params.appId) {
					store.APPINFO = JSON.stringify({
						version       : params.version,
						appId         : params.appId,
						serverVersion : params.serverVersion,
						platform      : params.platform
					});
				}

				_.each(store, function(value, key) {
					if (value) window.localStorage.setItem(key, value);
				});
			};
			cHybridShell.upon('init_member_H5_info', callback);

			// 主动获取网络状态，并保持监听。
			callback = function(params) { Lizard.networkType = params.networkType; };
			cHybridShell
				.on('network_did_changed', callback)
				.fn('check_network_status', callback)();

			// 有些回调函数的开发人员认为错误代码应在主参数集中取得。
			posttreater = function(params, err) {
				if (!params) params = {};
				if (err) params.error_code = err.number;
				return params;
			};
			cHybridShell.postTreat('save_photo', posttreater);
		},

		/**
		 * @deprecated since Lizard 2.1 / APP 6.0
		 */
		getOpenUrl: function(options) {
			var url = (Internal && Internal.isYouthApp ? 'ctripyouth' : 'ctrip') + '://wireless/' + options.module + '?';
			var params = [];
			for (var i in options.param) params.push(i + '=' + options.param[i]);
			return url + params.join('&');
		},

		/**
		 * 注册方法，绑定指定的回调函数，使与 Hybrid 约定的全局回调函数能够适时地通过 window.app.callback() 调用该回调函数。
		 * 本方法是调用 Hybrid 方法前的预处理，并不会实际调用任何 Hybrid 内置方法。
		 * 特别注意：本方法参数集合中的 tagname 并不是 unix_style 而是 METHOD_UNIX_STYLE。
		 * @method cHybridFacade.register
		 * @param  {object}   options               参数集合
		 * @param  {string}   options.tagname       方法标签名（Lizard）
		 * @param  {function} options.callback      回调函数
		 * @deprecated since Lizard 2.1 / APP 6.0
		 */
		register: function(options) {
			// 因为上述的特别注意，故删除
			// cHybridShell.on(options.tagname, options.sequenceId, options.callback);

			// 有些意外的情况，程序员会不先调用 registerOne() 而直接使用 register() 为一个自定义功能注册回调函数，
			// 此时，var2tagname() 方法会报错。
			try {
				var tagname = _ME.var2tagname(options.tagname);
			} catch (ex) { return; }  // 在旧版中，遇此类情况不作为，不报错！

			cHybridShell
				.off(tagname, options.sequenceId)
				.on(tagname, options.sequenceId, options.callback);
		},

		/**
		 * 方法注册前预处理。
		 *
		 * @method cHybridFacade.registerOne
		 * @param  {string}   varname               方法标签名（Lizard）
		 * @param  {string}   [tagname]             方法标签名（Hybrid）
		 * @deprecated since Lizard 2.1 / APP 6.0
		 */
		// 在旧版中，该方法用于生成一个注册方法（用于完成方法注册的方法），以 tagname 为索引保存在 defaultRegisterHandler 中。
		// 该注册方法被调用时：
		// ⑴ 将生成一个间接回调方法，以 tagname 和 sequenceId 为索引保存在 defaultHandler 中；
		// ⑵ 将用户提供的回调函数，以 tagname 和 sequenceId 为索引保存在 defaultCallback 中。
		registerOne: function(varname, tagname) {
			METHOD_INFO[_ME.var2name(varname)] = { tagname: tagname };
		},

		/**
		 * 调用方法（通常需设定一个或多个回调函数）。
		 * @method cHybridFacade.request
		 * @param  {object}   options               参数集合
		 * @param  {string}   options.name          方法标签名（Hybrid）
		 * @param  {MIXED}    options.*             其他参数视具体方法而定
		 */
		request: function(options) {
			var info = _ME.methodInfo(_ME.var2name(options.name));      

			// ⑵ 处理参数；
			var args = [];
			if (info.parseArgs) args = info.parseArgs(options);
			else if (info.argnames) {
				_.each(info.argnames, function(argname) {
					var arg;
					if (_.isString(argname)) arg = options[argname];
					else if (_.isArray(argname)) arg = argname[0];
					else {
						var p = _.pairs(argname)[0], t = typeof p[1];
						arg = options[p[0]];
						if (typeof p[1] == 'function') arg = p[1](arg);
						else if (!arg) arg = p[1];
					}
					args.push(arg);
				});
			}
			
			// ⑴ 处理回调函数；
			var callback = info.parseCallback ? info.parseCallback(options) : options.callback;

			// ⑶ 通过代理方法发起对 Hybrid API 的请求。
			cHybridShell
				.off(info.tagname, options.sequenceId)
				.fn(info.tagname, options.sequenceId, callback).apply(null, args);
		},

		/**
		 * 解除方法注册。
		 * @method cHybridFacade.unregister
		 * @param  {object}   options               参数集合
		 * @param  {string}   options.tagname       方法标签名（Hybrid）
		 * @deprecated since Lizard 2.1 / APP 6.0
		 */
		/**
		 * 解除方法注册。
		 * @method cHybridFacade.unregister
		 * @param  {string}   tagname               参数集合
		 * @deprecated since Lizard 2.1 / APP 6.0
		 */
		unregister: function(tagname) {
			// 参数兼容
			if (typeof arguments[0] == 'object') tagname = arguments[0].tagname;
			
			// 取消回调函数登记
			cHybridShell.off(tagname);
		}
	};
	
	// 初始化常量定义
	_.each(METHOD_INFO, function(info, name) {
		var varname = _ME.name2var(name);
		exports[varname] = varname;
	})
	
	return exports;
});