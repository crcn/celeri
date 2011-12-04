var tq = require('tq');

exports.plugin = function(cli) {
	
	var queue = tq.queue(), handlers = [];

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
			methods.push( { path: pt, command: pt + target.exec.toString().match(/function\s*\w*(\(.*?\))/)[1], func: target.exec, desc: target.desc });
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

	function getHandler(type) {
		for(var i = handlers.length; i--;) {
			var handler = handlers[i];

			if(handler.testListener(type)) return handler;
		}
	}


	cli.on = function(type, callback) {
		
		var cmds = {}, paths = [];

		if(typeof type == 'string') {
			cmds = { desc: '', command: type, exec: callback };
			paths = [type];
		} else {
			cmds = Structr.copy(type);
		}  


		flattenMethods(normalizeApi(cmds), paths).forEach(function(cmd) {
			queue.push(function() {

				var ret = getHandler(cmd.path).addListener(cmd, callback)
				
				this();

				cli.addHelp({ command: ret.useParams ? cmd.command : cmd.path, desc: cmd.desc });
			});	
		});
	}


	cli.emit = function(buffer, data) {

		try {
			return getHandler(buffer).run(buffer, data);
		} catch(e) {
			return false;
		}
	}

	var haba = this;

	return {
		init: function() {
			handlers = haba.plugins(/command\.\w+/);
			queue.start();
		}
	}
}