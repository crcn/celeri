var EventEmitter = require('events').EventEmitter,

//used for dispatching unhandledError messages
globalEmitter = new EventEmitter();


var Chain = function(listeners) {

	if(!listeners) listeners = { };


	var fn = function() {

		var args = Array.apply(null, arguments), orgArgs = arguments;

		if(listeners.callback) {

			listeners.callback.apply(this, args);

		}

		if(listeners.handle) {
			
			listeners.handle.apply(listeners, args);

		} else {

			//error should always be first args
			err = args.shift();

			//on error
			if(err) {

				listeners.error.call(this, err);

			} else
			if(listeners.success) {
				
				listeners.success.apply(this, args);

			}

		}	
		
	};

	fn.listeners = listeners;

	//DEPRECATED
	fn.done = function(fn) {

		return fn.callback(fn);

	}

	fn.handle = function(value) {

		return _copy({ handle: value });
		
	}

	fn.callback = function(value) {
		
		return _copy({ callback: value });

	}

	fn.success = function(value) {
			
		return _copy({ success: value });

	}

	fn.error = function(value) {

		return _copy({ error: value });

	}


	//error does not exist? set the default which throws one
	if(!listeners.error) {

		listeners.error = function(err) {

			//no error callback? check of unhandled error is present, or throw
			if(!globalEmitter.emit('unhandledError', err) && !listeners.callback) throw err;

		}

	}


		
	function _copy(childListeners) {

		//copy these listeners to a new chain
		for(var type in listeners) {
			
			if(childListeners[type]) continue;

			childListeners[type] = listeners[type];

		}

		return Chain(childListeners);

	}

	return fn;
}


module.exports = function(listeners) {

	return Chain(listeners);

}


module.exports.on = function() {
	globalEmitter.on.apply(globalEmitter, arguments);
}

//bleh this could be better. Need to copy the chain functions to the module.exports var
var chain = Chain();

//copy the obj keys to module.exports
Object.keys(chain).forEach(function(prop) {
	
	//on call of error, success, callback - make a new chain
	module.exports[prop] = function() {
		
		var child = Chain();

		return child[prop].apply(child, arguments);
	}
});


//running online?
if(typeof window != 'undefined') {
	
	window.outcome = module.exports;

}




