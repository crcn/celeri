

(function() {

	var _disposable = {};
		


	_disposable.create = function() {
		
		var self = {},
		disposables = [];


		self.add = function(disposable) {

			if(arguments.length > 1) {
				var collection = _disposable.create();
				for(var i = arguments.length; i--;) {
					collection.add(arguments[i]);
				}
				return self.add(collection);
			}

			if(typeof disposable == 'function') {
				
				var disposableFunc = disposable, args = Array.prototype.slice.call(arguments, 0);

				//remove the func
				args.shift();


				disposable = {
					dispose: function() {
						disposableFunc.apply(null, args);
					}
				};
			} else 
			if(!disposable || !disposable.dispose) {
				return false;
			}


			disposables.push(disposable);

			return {
				dispose: function() {
					var i = disposables.indexOf(disposable);
					if(i > -1) disposables.splice(i, 1);
				}
			};
		};

		self.addTimeout = function(timerId) {
			return self.add(function() {
				clearTimeout(timerId);
			});
		};

		self.addInterval = function(timerId) {
			return self.add(function() {
				clearInterval(timerId);
			});
		};

		self.addBinding = function(target) {
			self.add(function() {
				target.unbind();
			});
		};



		self.dispose = function() {
			
			for(var i = disposables.length; i--;) {
				disposables[i].dispose();
			}

			disposables = [];
		};

		return self;
	}



	if(typeof module != 'undefined') {
		module.exports = _disposable;
	}
	else
	if(typeof window != 'undefined') {
		window.disposable = _disposable;
	}


})();

