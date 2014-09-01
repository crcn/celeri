var tq = require('tq');

exports.plugin = function(cli, loader) {
	
	var queue = tq.queue(), handlers = [];

	

	function getHandler(type, callback) {
		loader.loadModules("^command.*$", function(err, handlers) {
			for(var i = handlers.length; i--;) {
				var handler = handlers[i];
				if(handler.testListener && handler.testListener(type)) return callback(null, handler);
			}

			callback();
		});

	}

	cli.emit = function(buffer, data) {

		var ret = true;

		//fucking dirty... - this is synchronous.
		getHandler(buffer, function(err, handler) {
			try {

				if(!handler) {
					ret = false;
					return;
				}


				return handler.run(buffer, data);

			} catch(e) {
				console.error(e.stack);
				ret = false;
			}
		});

		return ret;
	}


	queue.start();
}