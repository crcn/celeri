var beanpoll = require('beanpoll'),
disposable = require('disposable'),
Structr = require('structr'),
crema = require('crema'),
_  = require("underscore")


//changes for beanpole prohibit the use of whitespace
function fixRoute(route) {
	
	//protect special chars while we replace
	return route.replace(/\s*OR\s*/g,'__OR__').
	replace(/\s*->\s*/g,'__->__').
	replace(/[\s\t\n]+/g,'/').
	replace(/__/g,' ');
}

var CmdMessage = Structr(beanpoll.Messenger, {
	
	_next: function(middleware) {
		
		var self = this;	
		this.request.cache(true);
		this._inner = this._inner || {};


		this.request.dump(function(err, data) {
			try {
				middleware.listener(_.extend({}, middleware.params, data, self._inner), function(err, data) {

					if(err) return self.response.error(e);

					_.extend(self._inner, data);
					
					return self.next();	
				});		
			} catch(e) {
				self.response.error(e)
			}
			
		})

	}

});

var CmdDirector = Structr(beanpoll.Director, {

	passive: true,

	_newMessenger: function(message, middleware) {
		return new CmdMessage(message, middleware, this);
	}

});


exports.plugin = function(cli) {
	
	var router;


	cli.useCommandRouter = function(newRouter) {
		
		router = newRouter;

		newRouter.use(function() {
			return {
				name: 'cmd',
				director: new CmdDirector('cmd', router)
			}
		});

	}

	cli.useCommandRouter(beanpoll.router());


	cli.parseCommand = function(command) {
		return crema(fixRoute(command));
	}



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


		return router.on(fixRoute(ops.command), { type: 'cmd' }, callback);
	}

	return {
		testListener: function(type) {
			return type instanceof Array || router.request(fixRoute(type)).type('cmd').hasListeners();
		}, 
		run: function(type, data) {

			var fixedPath;

			if(type instanceof Array) {
				fixedPath = { segments: [] };
				
				for(var i = 0, n = type.length; i < n; i++) {
					fixedPath.segments.push({ value: type[i] });
				}	
			}
			else {
				fixedPath = fixRoute(type);
			}

			router.request(fixedPath).
			error(function(e) {
				console.log(e.stack)
			}).
			dispatch('cmd').
			end(data);

			return true;
		}
	}
}