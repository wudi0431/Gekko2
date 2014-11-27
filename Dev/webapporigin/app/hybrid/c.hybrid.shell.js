/**
 * @file c.hybrid.shell
 * @description 
 * 自 Lizard 1.1/2.0/2.1 for APP 6.0 起，对于 Native vs Hybrid / H5(inApp) 之间互相调用的封装，我们采用了新的策略： *
 * ⑴ 对于 H5 中尚未对等实现的功能（如调取系统联系人），我们将通过 cHybridShell 对 bridge.js 中的方法提供二次封装；
 * ⑵ 对于 H5 中已经对等实现的功能（如定位），我们将通过 Guider 等功能类提供二次封装；
 * 更多细节请参考{@link http://conf.ctripcorp.com/pages/viewpage.action?pageId=57531569|cHybridShell 使用方法}
 * @namespace Hybrid.cHybridShell
 * @author jiangjing@ctrip.com
 * @example
 *
 * // 不需要回调
 * cHybridShell.Fn('call_system_share').run(imageRelativePath, text, title, linkUrl);
 *
 * // 需要一次性回调函数
 * cHybridShell.Fn('choose_photo’, callback).run(maxFileSize, maxPhotoCount, meta);
 */

//--No.1--
// 根据 H5 vs Hybrid 的约定：
// ⑴ 调用 HybridAPI 的同时，将以方法标签名（Hybrid）为索引注册回调函数；
// ⑵ HybridAPI 异步执行，执行完毕后将调用 window.app.callback() 反馈信息，其中应包括同样的方法标签名（Hybrid）；
// ⑶ 方法标签名应与 HybridAPI（见 bridge.js）中对应的方法名除去前缀 app_ 后的剩余部分一致；
// ⑷ HybridAPI 必须确保不同的类中的方法不重名，否则无法以标签名为依据正确执行回调函数。

define([], function() {
	'use strict';

	var HYBRID = {};

	HYBRID.CLASSES = [];
	for (var i in window) if (i.substr(0, 5) == 'Ctrip') HYBRID.CLASSES.push(window[i]);
	// var HYBRID.CLASSES = [
	// 	CtripBar            ,
	// 	CtripBusiness       ,
	// 	CtripEncrypt        ,
	// 	CtripFile           ,
	// 	CtripGeoHelper      ,
	// 	CtripMap            ,
	// 	CtripPage           ,
	// 	CtripPay            ,
	// 	CtripPipe           ,
	// 	CtripSumSungWallet  ,
	// 	CtripTool           ,
	// 	CtripUser           ,
	// 	CtripUtil           ];

	HYBRID.FNINFO = {
		abort_http_pipe_request            : { realname: 'app_abort_HTTP_pipe_request' },
	//	check_network_status               : { paramsMixed: true },  // 反馈信息是否混淆在回调参数中。
		do_business_job                    : { sidIndex: 3 },  // sequenceId 在形参中的位置，顺序自 0 起始。
		send_h5_pipe_request               : { realname: 'app_send_H5_pipe_request' },
		send_http_pipe_request             : { realname: 'app_send_HTTP_pipe_request' }
	};
	// paramsMixed 指该方法回调时将反馈信息和元信息（tagname, error_code）混杂在一起，而没有单独放在 param 属性中。
	// e.g. locate: { klass: CtripMap, realname: 'app_locate' },

	// 	refresh_nav_bar                    : { klass: CtripBar },

	// 	choose_contact_from_addressbook    : { klass: CtripBusiness },
	// 	choose_invoice_title               : { klass: CtripBusiness },
	// 	get_device_info                    : { klass: CtripBusiness },
	// 	log_google_remarkting              : { klass: CtripBusiness },
	// 	read_verification_code_from_sms    : { klass: CtripBusiness },
		
	// 	base64_encode                      : { klass: CtripEncrypt },
	// 	ctrip_encrypt                      : { klass: CtripEncrypt },
		
	// 	check_file_exist                   : { klass: CtripFile },
	// 	delete_file                        : { klass: CtripFile },
	// 	get_current_sandbox_name           : { klass: CtripFile },
	// 	get_file_size                      : { klass: CtripFile },
	// 	make_dir                           : { klass: CtripFile },
	// 	read_text_from_file                : { klass: CtripFile },
	// 	write_text_to_file                 : { klass: CtripFile },
		
	// 	locate                             : { klass: CtripMap },
	// 	show_map_with_POI_list             : { klass: CtripMap },
		
	// 	enable_drag_animation              : { klass: CtripPage },
	// 	hide_loading_page                  : { klass: CtripPage },
	// 	show_loading_page                  : { klass: CtripPage },
		
	// 	check_pay_app_install_status       : { klass: CtripPay },
		
		
	// 	finished_login                     : { klass: CtripUser },
	// 	member_auto_login                  : { klass: CtripUser },
	// 	member_login                       : { klass: CtripUser },
	// 	member_register                    : { klass: CtripUser },
	// 	non_member_login                   : { klass: CtripUser },
		
	// 	check_app_install_status           : { klass: CtripUtil },
	// 	check_network_status               : { klass: CtripUtil },
	// 	choose_photo                       : { klass: CtripUtil },
	// 	download_data                      : { klass: CtripUtil },
	// 	init_member_H5_info                : { klass: CtripUtil },
	// 	read_copied_string_from_clipboard  : { klass: CtripUtil },
	// 	save_photo                         : { klass: CtripUtil },	

	// 获取 tagname 对应 Hybrid API 方法的相关信息。
	HYBRID.fninfo = function(tagname) {
		var info = _ME.ifHasnot(HYBRID.FNINFO, tagname, {});

		if (!info._READY) {
			// 关于 tagname 的命名规则，参见注释 No.1 第⑶条。
			_ME.ifHasnot(info, 'realname', 'app_' + tagname);

			// 此处不使用 _ME.ifHasnot() 方法系因 _.find() 运算成本较高。
			if (!info.hasOwnProperty('klass')) info.klass = _.find(HYBRID.CLASSES, function(klass) { return !!klass[info.realname]; });

			// 信息初始化不会反复尝试。
			info._READY = true;
		}

		return info;
	};

	// 仅供内部调用的成员集合（包括常量、变量和方法）。
	var _ME = {
		EXCEPTION: new Error('HYBRID-SHEL-2014'),

		SN: {
			DEFAULT : 0,
			UPON    : 'UPON.2014' ,
			PRE     : 'PRE.2014'  ,
			POST    : 'POST.2014' ,
			PX      : 'PX.2014'   ,

			gen     : function() { return (new Date).getTime(); }
		},

		// ⑴ 指定参数，则判断该异常是否为内部异常。
		//    对于非内部异常，仍然抛出以免干扰其他依赖类似机制的功能及程序调试。
		// ⑵ 未指定参数，则抛出内部异常。
		abort: function(ex) {
			if (ex) {
				if (ex == _ME.EXCEPTION) return true;
				throw ex;
			}
			else throw _ME.EXCEPTION;
		},

		// 根据方法标签名（Hybrid）取得对应的 HybridAPI 方法句柄。
		// 为确保方法在正确的上下文中执行，须对该方法进行封装，即返回的并非原始句柄。
		apiFn: function(tagname) {
			var method = function() {}, info = HYBRID.fninfo(tagname);
			if (info.klass) {
				method = function() {
					var args = arguments, abort = false;
					
					// 对参数进行预处理。
					// 在预处理过程中，如果预处理方法抛出错误，则中止执行后续预处理方法，并且阻断对 Hybrid API 的请求。
					_.find(_ME.fn('find', tagname, _ME.SN.PRE), function(fn) {
						try { args = fn.apply(null, args); }
						catch (ex) { return _ME.abort(ex); }
					});

					// 在 HybridAPI 类的上下文中执行关联方法。
					abort || info.klass[info.realname].apply(info.klass, args);
				};
			}
			return method;
		},

		fn: (function() {
			// 存储容器
			var STORAGE = {};

			return function(action, tagname, sequenceId, callback) {
				// 参数兼容
				if (!callback && (sequenceId instanceof Function)) {
					callback = sequenceId;
					// delete sequenceId; // Uncaught SyntaxError: Delete of an unqualified identifier in strict mode. 
					sequenceId = undefined;  // _.noop() returns undefined
				}

				// × 方法标签名（Hybrid）是大小写敏感的。
				// // 方法标签名（Hybrid）规范化
				// tagname = tagname.toLowerCase();

				// 设置默认顺序号。
				if (!sequenceId) sequenceId = _ME.SN.DEFAULT;

				// 初始化容器。
				var storage = _ME.ifHasnot(STORAGE, tagname, {});
				storage = _ME.ifHasnot(storage, sequenceId, { fns: [], times: {} });

				switch (action) {
					// 注册回调函数（仅供使用一次）。
					case 'once':
						if (callback) storage.times[callback] = 1;
					// 注册回调函数（可无限次使用）。
					case 'on':
						if (callback) storage.fns.push(callback);
						return;

					// 返回所有已注册的回调函数。
					case 'find':
						return storage.fns;

					// 削减已注册回调函数的可使用次数，自动删除即将失效的回调函数。
					case 'try':
						var i = storage.times[callback];
						if (_.isNumber(i)) {
							if (i == 1) { // 仅剩最后一次
								arguments[0] = 'off';
								_ME.fn.apply(_ME, arguments);
							}
							else storage.times[callback] -= 1;
						}
						return;

					// case 'pop':
					// 	storage[sequenceId] = [];
					// 	return callbacks;

					// 删除（取消注册）回调函数，如未指定回调函数，则删除所有的。
					case 'off':
						storage.fns = callback ? 
							_.reject(storage.fns, function(item) { return item === callback; })
							: 
							[];
						delete storage.times[callback];
						return;
				}
			};
			
			// return {
			// 	// 根据方法标签名（Hybrid）和顺序号登记回调函数。
			// 	push: function(tagname, sequenceId, callback) {
			// 		return fn('on', tagname, sequenceId, callback);
			// 	},

			// 	// 根据方法标签名（Hybrid）和顺序号读取回调函数。
			// 	/*Array*/ find: function(tagname, sequenceId) {
			// 		return fn('find', tagname, sequenceId);
			// 	},

			// 	// 根据方法标签名（Hybrid）和顺序号读取回调函数，并取消登记。
			// 	/*Array*/ pop: function(tagname, sequenceId) {					
			// 		return fn('pop', tagname, sequenceId);
			// 	},

			// 	// 根据方法标签名（Hybrid）和顺序号取消对指定回调函数的登记。
			// 	remove: function(tagname, sequenceId, callback) {
			// 		return fn('off', tagname, sequenceId, callback);
			// 	}
			// };
		})(),

		// 返回第一个非假的参数值，如均非真，则返回最后一个参数值（比如 0 或 ''）。
		// 辅助方法，仅供本模块内部为简化代码使用。
		ifEmpty: function() {
			for (var i = 0, args = arguments; i < args.length - 1; i++) if (args[i]) return args[i];
			return args[i];
		},

		// 判断对象是否存在指定属性，若不存在，则使用缺省值初始化该属性，并返回属性值。
		ifHasnot: function(obj, propname, value) {
			if (!obj.hasOwnProperty(propname)) obj[propname] = value;
			return obj[propname];
		},

		// @deprecated
		//
		// // ⑴ 判断父对象（obj）是否存在指定子对象（keyname），如果不存在，则将其初始化为一个空对象；
		// // ⑵ 如果指定了 subKeyname，则以 obj.keyname 为父对象，重复上述步骤；
		// // ⑶ 如果存在更多参数，则依次类推；
		// // ⑷ 返回最末端的对象。
		// initHash: function(/*object*/ obj, /*string*/ keyname, /*OPTIONAL string*/ subKeyname /*, ... */) {
		// 	for (var i = 1; keyname = arguments[i]; i++) {
		// 		if (!obj[keyname]) obj[keyname] = {};
		// 		obj = obj[keyname];
		// 	}
		// 	return obj;
		// },
		//
		findHash: function(/*object*/ obj, /*string*/ keyname, /*OPTIONAL string*/ subKeyname /*, ... */) {
			for (var i = 1; obj && (keyname = arguments[i]); i++) obj = obj[keyname];
			return obj;
		}
	};

	var exports = {
		/**
		 * 可在预处理函数或后处理函数中调用，用于中止本次与 Hybrid API 请求有关的后续任务的执行。
		 * @method Hybrid.cHybridShell.abort
		 */
		abort: _ME.abort,

		/**
		 * 返回 HybridAPI 句柄供调用，也可以同时注册回调方法。
		 * 建议按链式语法调用，如 
		 *   var callback = function(params) { alert(params.outString); };
		 *   cHybridShell.fn('ctrip_encrypt', callback)('hello world!', '1');		 
		 *
		 * @method Hybrid.cHybridShell.fn
		 * @param  {string}          tagname      方法标签名（Hybrid）
		 * @param  {string}         [sequenceId]  顺序号，并行调用同一方法时可能需要指定顺序号
		 * @param  {function}       [callback]    回调函数
		 * @return {function}                     对应的 HybridAPI 函数句柄
		 */
		// 此方法可取代原 request() 和 register() 的功能，但书写方式有所不同。
		fn: function(tagname, sequenceId, callback) {
			// 登记回调函数
			this.on(tagname, sequenceId, callback);

			// 取得对应的 HybridAPI 函数句柄。
			var fn = _ME.apiFn(tagname);

			// 为了与 .Fn() 在形式上相对应，有此兼容。
			fn.run = fn;

			return fn;
		},

		/**
		 * 初始化。
		 * @singleton
		 */
		init: _.once(function() {
			// var _me = this.init;
			// if (_me.called) return; _me.called = true;

			/**
			 * 与 Hybrid 约定的回调函数。
			 * 按约定 Hybrid 将按以下方式回调：
			 *   window.app.callback({ tagname: '...', param: { ... } });
			 *
			 * @method window.app.callback
			 * @param  {object}   options               参数集合
			 * @param  {string}   options.tagname       方法标签名（Hybrid）
			 * @param  {object}   options.param         返回的参数集合
			 * @return {boolen}   true = 成功执行回调，或毋须回调；false = 出现故障
			 */
			if (!window.app) window.app = {};
			window.app.callback = function(options) {
				var params, err;

				// 容错处理：某些 Hybrid 方法在回调时未严格遵守约定。
				if (typeof options == 'string') {
					try {
						options = window.JSON.parse(window.decodeURIComponent(options));
					} catch (ex) {
						return; // 老版本中此处未终止函数执行。
					}
				}

				var tagname = options.tagname;

				// params = _ME.ifEmpty(options.param, options); 
				// 容错处理：某些 Hybrid 方法在回调时未严格遵守约定，未将返回的参数集合放在回调参数的 param 属性中。
				// 但是这种容错也造成一个问题，即如果 param 不是一个集合，而是一个非真值，那么这种处理将会导致歧义。
				params = HYBRID.fninfo(tagname).paramsMixed ? options : options.param;

				// 容错处理
				if (typeof params == 'string') {
					// 老版本中此处未尝试捕获错误。
					// 但是，老版本中如果 options.param 为非真值（包括空字符串），则会以 options 替代，因此不会出现尝试解析空字符串导致出错的情形。
					try {
						params = window.JSON.parse(params); 
					} catch (ex) {}
				}

				// 错误信息规范化处理
				if (options.error_code) {
					/^(\((-?\d+)\))?(.+)$/.exec(options.error_code);
					err = new Error();
					err.number = parseInt(RegExp.$2);
					err.message = RegExp.$3;
				}

				// 根据 tagname 和 sequenceId 选择回调函数并执行该回调函数。
				// 如未发现匹配的回调函数，则认为毋须回调。
				/**
				 * @todo sequenceId 是 options 的属性还是 options.param 的属性？按常理它应当与 tagname 属同一级别，即应属前者，但现在是按后者处理。
				 */
				var sequenceId = params ? params.sequenceId : undefined;  // _.noop() returns undefined
				var 
					upons     = _ME.fn('find', tagname, _ME.SN.UPON),
					posts     = _ME.fn('find', tagname, _ME.SN.POST),
					callbacks = _ME.fn('find', tagname, sequenceId );
				var abort = false;
				
				if (upons.length + callbacks.length) {
					// 参数后处理：此处“后”的意思是指在调用 Hybrid API 之后，相对于回调函数，它们是“预”处理方法。
					// 如果扣处理函数抛出异常，将中止后续预处理函数及回调函数的执行。
					_.find(posts, function(fn) { 
						try { params = fn(params, err); }
						catch (ex) { return _ME.abort(ex); }			
					});

					var fnTry = function(sequenceId, callback) { 
						_ME.fn('try', tagname, sequenceId, callback);
						return abort = callback(params, err) === false;
					};

					// 执行全局回调
					// 如果回调函数返回 false，将中止后后续回调函数的执行。
					if (!abort) _.find(upons, function(callback) { return fnTry(_ME.SN.UPON, callback); });

					// 执行回调
					// 如果回调函数返回 false，将中止后后续回调函数的执行。
					if (!abort) _.find(callbacks, function(callback) { return fnTry(sequenceId, callback); });

					return true;
				}

				// 明确一点：如果参数应该是一个集合，那么它就必须是一个集合！
				// 换言之，用户不必在回调函数中作 if (params && params.somthing) 这样的容错处理，可以直接判断 if (params.somthing)。
				// 除非，在定义回调函数的时候，就已明知（根据 API Docs for: Ctrip Hybrid Javascript Lib）返回值可能是 undefined。
				
				// 无匹配回调函数时，返回 undefined。
				// return true;
			};
		}),

		/**
		 * 注册方法，将回调函数与方法标签名（Hybrid）和顺序号（如有）绑定。
		 * @see cHybridShell.on
		 *
		 * @method cHybridShell.on
		 * @param  {string}          tagname      方法标签名（Hybrid）
		 * @param  {string}         [sequenceId]  顺序号，并行调用同一 HybridAPI 方法且需要反馈时必须指定顺序号
		 * @param  {function}        callback     回调函数
		 */
		on: function(tagname, sequenceId, callback) {
			_ME.fn('on', tagname, sequenceId, callback);
			return this;
		},

		/**
		 * 注册方法，将回调函数与方法标签名（Hybrid）和顺序号（如有）绑定。
		 * 该方法被回调后即销毁！
		 * @see cHybridShell.on
		 *
		 * @method cHybridShell.on
		 * @param  {string}          tagname      方法标签名（Hybrid）
		 * @param  {string}         [sequenceId]  顺序号，并行调用同一 HybridAPI 方法且需要反馈时必须指定顺序号
		 * @param  {function}        callback     回调函数
		 */
		once: function(tagname, sequenceId, callback) {
			_ME.fn('once', tagname, sequenceId, callback);
			return this;
		},

		/**
		 * 注册预处理方法，在发起对 HybridAPI 的请求之前执行，可用于对请求实参进行预处理。
		 * 预处理方法的返回值为实参数组（如未处理，请返回原始实参数组 arguments）。
		 * 如果预处理方法抛出指定错误（调用 cHybridShell.abort() 方法），则中止后续预处理，并且将阻断对 Hybrid API 的请求。
		 *
		 * @method cHybridShell.preTreat
		 * @param  {string}          tagname      方法标签名（Hybrid）
		 * @param  {function}        pretreat     预处理函数
		 */
		preTreat: function(tagname, pretreater) {
			_ME.fn('on', tagname, _ME.SN.PRE, pretreater);
			return this;
		},

		/**
		 * 注册后处理方法，在执行回调函数前执行，在执行中可修改回调参数实参内容。
		 * 后处理方法的返回值为实参数组（如未处理，请返回原始实参数组 arguments）。
		 * 如果后处理方法抛出指定错误（调用 cHybridShell.abort() 方法），则中止执行后续后处理方法和所有回调函数。
		 * @see cHybridShell.on 
		 *
		 * @method cHybridShell.postTreat
		 * @param  {string}          tagname      方法标签名（Hybrid）
		 * @param  {function}        posttreater  后处理函数，可用于对返回参数集进行预处理。
		 */
		postTreat: function(tagname, posttreater) {			
			_ME.fn('on', tagname, _ME.SN.POST, posttreater);
			return this;
		},

		/**
		 * 取消方法注册。
		 * @method cHybridShell.off
		 * @param  {string}          tagname      方法标签名（Hybrid）
		 * @param  {string}         [sequenceId]  顺序号，并行调用同一方法时可能需要指定顺序号
		 * @param  {function}        callback     回调函数
		 * @return {function}                     对应的 HybridAPI 函数句柄
		 */
		off: function(tagname, sequenceId, callback) {
			// 取消回调函数登记
			_ME.fn('off', tagname, sequenceId, callback);
			return this;
		},

		/**
		 * 注册方法，将回调函数与方法标签名（Hybrid）绑定。
		 * 当多个回调函数并存时：
		 *   ⑴ 按注册的先后顺序执行；
		 *   ⑵ 回调函数返回 false 将阻断后续回调函数的执行。
		 *
		 * upon vs on 
		 *   ⑴ 前者在关于指定功能的任意异步调用引发的回调中都将被执行；
		 *   ⑵ 前者在执行顺序上优先于后者。
		 *
		 * on vs once
		 *   ⑴ 前者可以被多次回调执行，即使这些回调由不同的异步调用引发；
		 *   ⑵ 后者只能被回调执行一次，即使这些回调由同一个异步调用引发。
		 *
		 * upon vs postTreat
		 *   ⑴ 前者将在任意回调函数之前执行，换言之，如果没有注册回调函数，则 posttreater 也不会被执行；
		 *   ⑵ 前者可以改变回调函数的实参。
		 *
		 * @method cHybridShell.upon
		 * @param  {string}          tagname      方法标签名（Hybrid）
		 * @param  {function}        callback     回调函数 ({}, [, Error])
		 */
		upon: function(tagname, callback) {
			_ME.fn('on', tagname, _ME.SN.UPON, callback);
			return this;
		},

		// Fn: (function() {
		// 	var tagname, sequenceId;
		// 	return function(T, S, callback) {
		// 		if (this === exports) return new this.Fn(T, S, callback);

		// 		tagname = T;
		// 		if (callback || typeof S != 'function') sequenceId = S;
		// 		exports.once(T, S, callback);

		// 		var that = this;
		// 		_.each(['on', 'once', 'off'], function(action) {
		// 			that[action] = function(callback) {
		// 				exports[action](tagname, sequenceId, callback);
		// 				return this;
		// 			};
		// 		});

		// 		this.run = function() {
		// 			_ME.apiFn(tagname).apply(null, arguments);
		// 			return this;
		// 		};
		// 	};
		// })()
		
		Fn: (function() {
			var tagname, sequenceId, sidIndex;
			return function(T, callback) {
				if (this === exports) return new this.Fn(T, callback);

				tagname = T;

				sidIndex = HYBRID.fninfo(tagname).sidIndex;
				if (_.isNumber(sidIndex)) sequenceId = _ME.SN.gen();

				exports.once(T, sequenceId, callback);

				var that = this;
				_.each(['on', 'once', 'off'], function(action) {
					that[action] = function(callback) {
						exports[action](tagname, sequenceId, callback);
						return this;
					};
				});

				this.run = function() {
					var args = arguments;
					// 在实参中插入序列号至预定位置
					if (_.isNumber(sidIndex)) {
						args = [];
						for (var i = 0, n = Math.max(sidIndex + 1, arguments.length); i < n; i++) {
							if (i == sidIndex) args.push(sequenceId);
							args.push(arguments[i]);
						}
					}
					_ME.apiFn(tagname).apply(null, args);
					return this;
				};
			};
		})()		
	};

	// var Fn = function(tagname, sequenceId, callback) {
	// 	// 兼容：可作为普通函数调用，仍创建并返回对象实例。
	// 	if (this === exports) return new Fn(tagname, sequenceId, callback);

	// 	this.tagname = tagname;
	// 	if (callback || typeof sequenceId != 'function') this.sn = sequenceId;
	// 	exports.once(tagname, sequenceId, callback);
	// };
	// _.extend(Fn.prototype, {
	// 	on: function(callback) {
	// 		exports.on(this.tagname, this.sn, callback);
	// 		return this;
	// 	},
	// 	once: function(callback) {
	// 		exports.once(this.tagname, this.sn, callback);
	// 		return this;
	// 	},
	// 	off: function(callback) {
	// 		exports.off(this.tagname, this.sn, callback);
	// 		return this;
	// 	},
	// 	run: function() {
	// 		_ME.apiFn(this.tagname).apply(null, arguments);
	// 		return this;
	// 	}
	// });
	// exports.Fn = Fn;

	return exports;
});