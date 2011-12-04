var tq = require('tq');

exports.plugin = function(cli) {
	
	var queue = tq.queue(), handlers = [];

	

	function getHandler(type) {
		for(var i = handlers.length; i--;) {
			var handler = handlers[i];

			if(handler.testListener(type)) return handler;
		}
	}


	/*cli.on = function(type, callback) {
		
		var cmds = {}, paths = [];

		if(typeof type == 'string') {
			cmds = { desc: '', command: type };
		} else {
			cmds = Structr.copy(type);
		}  


		if(cmds.command && !cmds.exec && callback)
		{
			if(!cmds.desc) cmds.desc = '';

			cmds.exec = callback;
		}


		flattenMethods(normalizeApi(cmds), paths).forEach(function(cmd) {
			queue.push(function() {

				console.log(cmd)
				var ret = getHandler(cmd.path).addListener(cmd, callback)
				this();

				cli.addHelp({ command: ret.useParams ? cmd.command : cmd.path, desc: cmd.desc });
			});	
		});
	}*/


	cli.emit = function(buffer, data, callback) {

		if(!callback) callback = function(){}

		try {
			getHandler(buffer).run(buffer, data, callback);
		} catch(e) {
			callback(false);
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