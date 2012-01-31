var tq = require('tq');

exports.plugin = function(cli) {
	
	var queue = tq.queue(), handlers = [];

	

	function getHandler(type) {
		handlers = haba.plugins(/command\.\w+/);
		for(var i = handlers.length; i--;) {
			var handler = handlers[i];

			if(handler.testListener(type)) return handler;
		}
	}

	cli.emit = function(buffer, data) {

		try {
			var handler = getHandler(buffer);

			if(!handler) return false;

			return handler.run(buffer, data);

		} catch(e) {
			console.error(e.stack)
			return false;
		}
	}

	var haba = this;

	return {
		init: function() {
			queue.start();
		}
	}
}