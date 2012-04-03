

(function() {

	var disposable = {};
		


	disposable.create = function() {
		
		var self = {},
		disposables = [];


		self.add = function(disposable) {

			if(typeof disposable == 'function') {
				
				var disposableFunc = disposable, args = Array.prototype.slice.call(arguments, 0);

				//remove the func
				args.shift();


				disposable = {
					dispose: function() {
						disposableFunc.apply(null, args);
					}
				};
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
			return self.add(clearTimeout, timerId);
		};

		self.addInterval = function(timerId) {
			return self.add(clearInterval, timerId);
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
		module.exports = disposable;
	}

	if(typeof window != 'undefined') {
		window.disposable = disposable;
	}


})();

var disposable = module.exports.create();


disposable.dispose();
