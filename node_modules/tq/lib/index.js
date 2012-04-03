var EventEmitter = require('events').EventEmitter;

exports.queue = function() {

	
	var next = function() {
		var callback = queue.pop();

		if(!callback || !started) {
			running = false;
			return;
		}

		running = true;

		callback.apply(next, arguments);
	},
	running = false,
	started = false,
	queue = [],
	em = new EventEmitter();

	var self = {

		/**
		 * add a queue to the end
		 */

		push: function(callback) {
			queue.unshift(callback);

			if(!running && started) {
				next();
			}

			return this;
		},


		/**
		 * adds a queue to the begning
		 */

		unshift: function(callback) {
			queue.push(callback);
			return this;
		},

		/**
		 */

		on: function(type, callback) {
			em.addListener(type, callback);
		},


		/**
		 * starts the queue
		 */

		start: function() {
			if(started) return this;
			started = running = true;
			em.emit('start');
			next();
			return this;
		},

		/**
		 * returns a function that's added to the queue
		 * when invoked
		 */

		fn: function(fn) {
			return function() {
				var args = arguments, listeners = [];


				return self.push(function() {

					var next = this;

					fn.apply({
						next: function() {
							args = arguments;
							listeners.forEach(function(listener) {
								listener.apply(null, args);
							});
							next();
						},
						attach: function(listener) {
							listeners.push(listener);
						}
					}, args);
				});
			}
		},

		/**
		 * stops the queue
		 */

		stop: function() {
			started = running = false;
			return this;
		}
	};

	return self;
}