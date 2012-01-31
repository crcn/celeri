var tq = require('tq');

exports.plugin = function(cli) {
	
	var queue = tq.queue(), handlers = [];

	

	function getHandler(type) {
		for(var i = handlers.length; i--;) {
			var handler = handlers[i];

			if(handler.testListener(type)) return handler;
		}
	}

	cli.emit = function(buffer, data) {

		try {
			return getHandler(buffer).run(buffer, data);
		} catch(e) {
			//console.log(e.message)
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