var EventEmitter = require('events').EventEmitter;

module.exports = function() {
	
	
	var next = function() {
		var callback = queue.pop();

		if(!callback) {
			running = false;
			return;
		}

		callback.apply(next, arguments);
	},
	running = false,
	started = false,
	queue = [],
	em = new EventEmitter();

	return {
		add: function(callback) {
			queue.unshift(callback);

			if(!running && started) {
				next();
			}
		},
		on: function(type, callback) {
			em.addListener(type, callback);
		},
		unshift: function(callback) {
			queue.push(callback);
		},
		start: function() {
			if(started) return;
			started = running = true;
			em.emit('start');
			next();
		}
	}
}