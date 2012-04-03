
var pluginNameTester = require('./nameTester'),
tq = require('tq');

module.exports = function(haba, parent) {
	
	var children = [],
	plugins = {},
	queue = tq.queue(),
	initialized = false;

	var self = {

		/**
		 * sep between all, local, and remote plugins
		 */

		addChild: function() {
			var child = module.exports(haba, self);
			children.push(child);
			return child;
		},


		/**
		 */

		'plugin': function(search) {
			return self.plugins(search)[0];
		},

		/**
		 */

		'add': function(ops) {
			plugins[ops.name] = {
				instance: ops.instance,
				require: ops.require
			};
		},

		/**
		 */

		'plugins': function(search) {

			var test = pluginNameTester(search), matches = [];

			for(var name in plugins) {
				if(test(name)) {
					matches.push(plugins[name].instance);
				}
			}	


			children.forEach(function(child) {
				matches = matches.concat(child.plugins(search));
			});

			return matches;
		},


		/**
		 */

		'root': function() {
			
			var par = this;
			
			while(par.parent()) par = par.parent();
			
			return par;	

		},

		/**
		 */

		'parent': function() {
			return parent;	
		},

		/**
		 */

		'emit': function(type) {
			
			var params = Array.apply(null, arguments),
			args = params.concat();
			params.shift();//remove type


			queue.push(function() {
				for(var name in plugins) {
					var plugin = plugins[name];
					if(plugin.instance[type]) {
						plugin.instance[type].apply(plugin.instance, params);
					}
				}	


				children.forEach(function(child) {
					child.emit.apply(child, args);
				});

				this();
			});

			return haba;
		},

		/**
		 */

		'next': function(callback) {
			queue.push(callback);
			return haba;
		},


		/**
		 */

		'ready': function() {
			if(initialized) return;
			initialized = true;

			queue.start();

			for(var name in plugins) {
				var plugin = plugins[name];
				
				(plugin.require || []).forEach(function(req) {
					var plugins = self.root().plugins(req.search);

					if(!plugins.length) throw new Error('Unable to find plugin ' + req.search + ' in ' + name);
				});
			}

			children.forEach(function(child) {
				child.ready();
			});

		}
	};

	return self;
}