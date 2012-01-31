var beanpoll = require('beanpoll'),
disposable = require('disposable'),
Structr = require('structr')


//changes for beanpole prohibit the use of whitespace
function fixRoute(route) {
	
	//protect special chars while we replace
	return route.replace(/\s*OR\s*/g,'__OR__').
	replace(/\s*->\s*/g,'__->__').
	replace(/[\s\t\n]+/g,'/').
	replace(/__/g,' ');
}

var CmdMessage = Structr({
	
	_next: function(middleware) {
		
		var self = this;	
		this.message.cache(true);


		this.message.dump(function(err, data) {
			middleware.listener(Structr.copy(middleware.params, data), function() {
				return self.next();	
			});	
		})

	}

}, beanpoll.Messenger);

var CmdDirector = Structr({

	passive: true,

	_newMessenger: function(message, middleware) {
		return new CmdMessage(message, middleware, this);
	}

}, beanpoll.Director);


exports.plugin = function(cli) {
	
	var router = beanpoll.router();


	router.use(function() {
		return {
			name: 'celeri',
			director: new CmdDirector('celeri', router)
		}
	})


	cli.onCommand = function(typeOrOps, callback) {
		

		var ops = {}, disposables = disposable.create();

		if(typeof typeOrOps == 'object' && typeof callback != 'function') {

			for(var t in typeOrOps) {
				disposables.add(cli.onCommand(t, typeOrOps[t]));
			}

			return disposables;
		}

		if(typeof typeOrOps == 'object') {
			ops = typeOrOps;
		} else {
			ops = { command: typeOrOps };
		}

		if(ops.desc) {
			cli.addHelp(ops);	
		}

		return router.on('celeri ' + fixRoute(ops.command), callback);
	}

	return {
		testListener: function(type) {
			return router.request(fixRoute(type)).type('celeri').hasListeners();
		}, 
		run: function(type, data) {

			var fixedChannel = fixRoute(type);

			return router.request(fixedChannel).
			error(function(){}).
			dispatch('celeri').
			end(data).
			running;
		}
	}
}