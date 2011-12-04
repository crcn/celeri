var beanpole = require('beanpole');

exports.plugin = function(cli) {
	
	var router = beanpole.router();


	cli.onCommand = function(typeOrOps, callback) {
		
		var ops = {};

		if(typeof typeOrOps == 'object' && typeof callback != 'function') {

			for(var t in typeOrOps) {
				cli.onCommand(t, typeOrOps[t]);
			}
			return;
		}

		if(typeof typeOrOps == 'object') {
			ops = typeOrOps;
		} else {
			ops = { command: typeOrOps };
		}

		if(ops.desc) {
			cli.addHelp(ops);	
		}

		router.on('push ' + ops.command, callback);
	}

	return {
		testListener: function(type) {
			return type.indexOf('.') == -1;
		}, 
		run: function(type, data) {
			return router.push(type.replace(/\s+/g,'/'), data, { meta: { passive: 1 }});
		},
		init: function() {
			cli.onCommand({ command: 'help', desc: ' ' }, cli.help);
		}
	}
}