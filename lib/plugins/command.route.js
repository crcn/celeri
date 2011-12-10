var beanpole = require('beanpole');

exports.plugin = function(cli) {
	
	var router = beanpole.router();


	cli.onCommand = function(typeOrOps, callback) {
		
		var ops = {}, disposables = [];

		if(typeof typeOrOps == 'object' && typeof callback != 'function') {

			for(var t in typeOrOps) {
				disposables.push(cli.onCommand(t, typeOrOps[t]));
			}
			return { dispose: function() {
				for(var i = disposables.length; i--;) {
					disposables[i].dispose();
				}
			}};
		}

		if(typeof typeOrOps == 'object') {
			ops = typeOrOps;
		} else {
			ops = { command: typeOrOps };
		}

		if(ops.desc) {
			cli.addHelp(ops);	
		}

		return router.on('push ' + ops.command, callback);
	}

	return {
		testListener: function(type) {
			return type.indexOf('.') == -1;
		}, 
		run: function(type, data) {
			return router.push(type.replace(/\s+/g,'/'), data, { meta: { passive: 1 }});
		}
	}
}