var Structr = require('structr');

exports.plugin = function(cli) {
	
	var target = {};

	function normalizeApi(target) {
		
		if(target.desc != undefined && target.exec) return target;

		for(var prop in target) {
			
			var v = target[prop];

			if(typeof v == 'function') {
				target[prop] = {
					exec: v,
					desc: ''
				}
			} else {
				normalizeApi(v);
			}
		}

		return target;
	}

	function flattenMethods(target, path) {
		
		var methods = [];

		if(target.desc != undefined && target.exec) {
			var pt = path.join('.');
			methods.push( { path: pt, 
				command: pt + target.exec.toString().match(/function\s*\w*(\(.*?\))/)[1], 
				func: target.exec, 
				desc: target.desc,
				ignoreHelp: target.ignoreHelp });
			return methods;
		}

		for(var prop in target) {
			
			var v = target[prop];
			
			if(typeof v == 'object') {
				var subPath = path.concat();
				subPath.push(prop);
				methods = methods.concat(flattenMethods(v, subPath));
			} 
		}

		return methods;
	}


	cli.onJs = function(api) {
		flattenMethods(normalizeApi(Structr.copy(api)), []).forEach(function(cmd) {
			cli.addHelp(cmd);
		});

		Structr.copy(api, target);
	}
	
	return {
		testListener: function(type) {
			return type.indexOf('(') > -1 || type.indexOf('.');
		}, 
		run: function(buffer) {

			try {
				var ret = eval("with(target) " + buffer);

				if(ret != undefined) console.log(ret)
				return true;
			} catch(e) {
				console.log('Unable to call %s \n%s', buffer.bold, e.message.red.bold);

				return false;
				// console.log('\nAvailable Methods:'.bold)
				// cli.help();
			}
		}
	}
}