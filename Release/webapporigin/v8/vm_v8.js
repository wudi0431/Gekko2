var vm = {};
vm.undfn = void(0);
vm.global = (1, eval)('this');
vm.getContext = function (code, context) {
	code = code || '';
	context = context || {};
	var con = {
		global: {},
		alert: function () {},
		confirm: function () {},
		console: {
			log: function () {},
		},
		localStorage: {
			setItem: function () {},
			getItem: function () {
				return '';
			}
		},
		vm: vm.undfn,
		Lizard: Lizard,
		setInterval: function () {},
		setTimeout: function () {}
	};
	if (context) {
		for (var key in context) {
			if (context.hasOwnProperty(key) && !con.hasOwnProperty(key)) {
				con[key] = context[key];
			}
		}
	}
	code.replace(/[a-z][a-z0-9_$]*/gi, function (a) {
		if (!con.hasOwnProperty(a) && !vm.global.hasOwnProperty(a)) {
			con[a] = vm.undfn;
		}
	});
	return con;
};
vm.code2string = function (code) {
	var hash = {
		'\\': '\\\\',
		'\t': '\\t',
		'\r': '\\r',
		'\n': '\\n',
		'\'': '\\\'',
		'\"': '\\\"'
	};
	ret = code.replace(/[\\\t\r\n\'\"]/g, function (a) {
		return hash[a];
	});
	return ret;
};
vm.require = function (code, context) {
	var ret = {};
	var con = vm.getContext(code, context);
	con.define = function () {
		var args = arguments;
		for (var i = 0; i < args.length; i++) {
			if (typeof args[i] == 'function') {
				try {
					ret = args[i](ret);
				} catch (e) {};
			}
		}
	};
	try {
		var fn = new Function('__context', 'with(__context){' + code + '}');
		fn(con);
	} catch (e) {}
	return ret;
};
vm.eval = function (code, context) {
	var ret = vm.undef;
	var con = vm.getContext(code, context);
	try {
		var fn = new Function('__context', 'with(__context){return eval(\'' + vm.code2string(code) + '\');}');
		ret = fn(con);
	} catch (e) {
		var conStr = '';
		try {
			conStr = JSON.stringify(con);
		} catch (e) {};
		if (typeof LizardDebug!='undefined'){
			LizardDebug += '<br />Code: '+code.replace(/</g, '&lt;').replace(/>/g, '&gt;')+'<br />Context: '+conStr.replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}else{
			throw (new Error(('[' + e.stack + '] ' + code + ' @@@ ' + conStr + ' @@@ ').replace(/</g, '&lt;').replace(/>/g, '&gt;')));
		}
	}
	return ret;
};