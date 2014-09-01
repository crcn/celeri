var EventEmitter = require('events').EventEmitter,

//used for dispatching unhandledError messages
globalEmitter = 
global.outcomeEmitter = 
global.outcomeEmitter ? global.outcomeEmitter : new EventEmitter();

var Chain = function(listeners) {

	if(!listeners) listeners = { };

	var runFn = function(event, callback, args) {
		if(!!listeners[callback].emit) {
			listeners[callback].emit.apply(listeners[callback], [event].concat(args));
		} else {
			listeners[callback].apply(this, args);
		}
	}

	var runErr = function(args) {
		runFn("error", "error", args);

		globalEmitter.emit("handledError", args[0]);
	}


	var fn = function() {

		var args = Array.apply(null, arguments), orgArgs = arguments;



		if(listeners.callback) {
			listeners.callback.apply(this, args);
		}

		if(listeners.handle) {
			listeners.handle.apply(listeners, args);
		} else {

			var e = args.shift();

			//on error
			if(e) {
				runErr.call(this, [e]);
			} else

			if(listeners.success) {
				//try {
					runFn.call(this, "complete", "success", args);
				/*} catch(e) {
					runErr.call(this, [e]);
				}*/
			}

		}	
	};

	var oldToString = fn.toString;

	fn.toString = function() {

		var str = ["outcome()"];

		if(listeners.error) {
			str.push("\n.e(", String(listeners.error), ")")
		}

		if(listeners.success) {
			str.push("\n.s(", String(listeners.success), ")")
		}


		return str.join("")
	}

	fn.listeners = listeners;

	//DEPRECATED
	fn.done = function(fn) {
		return fn.callback(fn);
	}

	fn.handle = function(value) {
		return _copy({ handle: value });
	}

	fn.vine = function() {
		return fn.handle(function(resp) {
			if(resp.errors) {
				this.error(resp.errors);
			} else {
				this.success(resp.result);
			}
		});
	}


	fn.callback = function(value) {
		return _copy({ callback: value });
	}

	fn.success = fn.s = function(value) {
		return _copy({ success: value });
	}

	fn.error = fn.e = function(value) {
		return _copy({ error: value });
	}

	fn.throwError = function(err) {
		if(!globalEmitter.emit('unhandledError', err) && !listeners.callback) throw err;
	}


	//error does not exist? set the default which throws one
	if(!listeners.error) {

		listeners.error = function(err) {

			//no error callback? check of unhandled error is present, or throw
			// if(!globalEmitter.emit('unhandledError', err) && !listeners.callback) throw err;
			fn.throwError(err);
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

module.exports.once = function() {
	globalEmitter.once.apply(globalEmitter, arguments);
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

module.exports.logAllErrors = function(v) {
	if(v) {
		globalEmitter.on("handledError", onGlobalError);
	} else {
		globalEmitter.removeListener("handledError", onGlobalError);
	}
}


function onGlobalError(e) {
	console.error(e.stack);
}


//running online?
if(typeof window != 'undefined') {
	window.outcome = module.exports;
}




