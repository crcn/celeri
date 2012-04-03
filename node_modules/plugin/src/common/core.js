var path = require('path'),
EventEmitter = require('events').EventEmitter,
pluginNameTester = require('./nameTester'),
pluginCollection = require('./collection'),
Structr = require('structr');


var copy = function(from, to) {
	if(!to) to = {};

	for(var i in from) to[i] = from[i];

	return to;
}


var nativeResolve = function(file) {
	try {
		return require.resolve(file);
	} catch (e) {
		return false;
	}
}


var includePaths = function(paths, target) {
	paths.forEach(function(fullPath) {
		var normPath = path.normalize(fullPath);

		//no dupes
		if(target.indexOf(normPath) > -1) return;

		target.push(normPath);
	});

	return this;
} 

var globalExists = typeof global != 'undefined'


if(globalExists) global.habaPaths = global.habaPaths || [];


var normalizeRequired = function(req) {

	if(typeof req == 'string' || typeof req == 'function' || req instanceof RegExp) req = [req];

	var normalized = [];

	if(req instanceof Array) {
		for(var i = req.length; i--;) {
			normalized.push({
				search: req[i],
				name: typeof req[i] == 'string' ? req[i] : null
			});
		}
	} else {
		for(var name in req) {
			var v = req[name],
			params = {};

			if(typeof v == 'object') {
				params = v;
			} else {
				params.search = v;
			}

			params.name = typeof v == 'string' ? v : null;
			

			normalized.push(params);
		}	
	}
	
	return normalized;
}

module.exports = function() {

	
	//options passed to every plugin
	var options = {}, 

	//paths to scan for modules
	//second param is for debugging - soft-linked haba path breaks node module searching
	paths       = [__dirname], 

	//params specific to each plugin
	params      = {},
	
	//required paths
	required    = [],

	self = {},

	_em  = new EventEmitter(),

	//all plugins
	allPlugins = pluginCollection(self),

	//remote plugins
	remotePlugins = allPlugins.addChild(),

	//local plugins
	localPlugins = allPlugins.addChild(),

	//module paths - check if they've already been loaded
	included    = {},

	readyListeners = [],
	loading = false;


	var findNodeModulePath = function(path, module) {
		var pathParts = path.split('/'), fullPath;

		while(pathParts.length) {

			if(fullPath = nativeResolve(pathParts.join('/') + '/node_modules/' + module)) return fullPath;

			pathParts.pop();
		}

		return null;
	}


	var resolveFromPaths = function(jsPath, paths) {
		for(var i = paths.length; i--;) {
			var incPath = paths[i];
			if((fullPath = nativeResolve(incPath + '/' + jsPath)) || (fullPath = findNodeModulePath(incPath, jsPath))) return fullPath;
		}

		return null;
	}


	var resolve = function(jsPath) {
		var fullPath;

		if(fullPath = nativeResolve(jsPath)) return fullPath;

		return resolveFromPaths(jsPath, paths) || (globalExists ? resolveFromPaths(jsPath, global.habaPaths) : null);
	}

	var inited = false,
	toLoad = [],
	modulesLoading = 0,
	numLoaders = 0;

	function tryInitializing() {

		modulesLoading--;

		if(!numLoaders && !modulesLoading)	 {
			inited = true;
			allPlugins.ready();
		}
	}

	function onPluginLoaded(err, ops) {
		if(err) throw err;

		var module = ops.module || {},

		//name of the module, e.g., name of the file to module
		name   = module.name    || ops.name,

		//path to the module, e.g., some/path.js or http://site.com/path.js
		path   = ops.path       || name,

		//is is a remote object? Dnode, now.js, etc.
		remote = ops.remote,

		//params for the plugin when required in
		prm    = params[name]   || {};

		//set the name to the parms - don't want to override existing params
		prm.__name = name;



		//check if the plugin is already loaded in. If it is, then give a warning. do NOT include it!
		if(included[path] && !remote) {
			tryInitializing();
			return console.warn('%s is already loaded', ops.path);
		}

		//flag that the path has been included
		included[path] = 1;

		//create a NEW plugin with the module given. 
		var instance = ops.plugin || (self.newPlugin(module, options, prm, self) || {}),

		//need to reparate the remote, from the local plugins incase OTHER plugins EXPLICITLY
		//want local, OR remote plugins. that's why remote / local collections exist.
		collection = remote ? remotePlugins : localPlugins;

		//ability to reference it when calling .plugins()
		instance.name = name;

		//add the plugin
		collection.add({
			name: name,
			path: path,
			instance: instance,
			require: normalizeRequired(module.require)
		});
			

		//check if any ready listeners are listening for THIS plugin to be loaded in.
		//notify them if that's the case
		readyListeners.forEach(function(listener) {
			
			if(listener.test(name)) {

				listener.callback(instance);

			}
		});


		//self.methods is DEPRECATED!!
		self.methods[name] = self.exports[name] = instance;


		tryInitializing();
	}


	function loadRequired(required) {



		for(var i = self.loaders.length; i--;) {
			var loader = self.loaders[i], loaded = false;


			//find the right loader for the required item?
			if(loader.test(required)) {

				//prepare the item - it MIGHT need to be loaded in. After that
				//we're given loadable items - plugins
				loader.prepare.call(self, required, function(err, moduleLoaders) {

					if(err) throw err;

					var n = moduleLoaders.length;

					numLoaders--;


					//need to add 1 to modules loading incase n = 0. 
					modulesLoading += n + 1;

					for(var j = moduleLoaders.length; j--;) {

						moduleLoaders[j].load(onPluginLoaded);
						
					}

					//try initializing INCASE there aren't any module loaders
					tryInitializing();
				});

				return this;
			}

		}


		throw new Error('Unable to load plugin: ' + required);
	}


	function loadAll() {

		loading = true;

		//ADD the number of loaders since loadAll can be called multiple times
		//which happens when a plugin is loaded in
		numLoaders += toLoad.length;

		var load = toLoad.concat();
		//drain the items to load
		toLoad = [];

		for(var i = 0; i < load.length; i++) {
			loadRequired(load[i]);
		}

		toLoad = [];
	}



	Structr.copy({

		/**
		 * resolves a module path
		 */

		'resolve': resolve,
		
		/**
		 * global options passed to all plugins
		 */
		
		'options': function(value) {
			if(!arguments.length) return options;
			options = value;
			return this;
		},

		/**
		 * parameters specific to plugins
		 */
		
		'params': function(name, value) {

			if(!arguments.length) return params;
			if(arguments.length == 1 && typeof arguments[0] == 'string') return params[name];

			if(typeof name == 'object') {
				for(var prop in name) {
					self.params(prop, name[prop]);
				} 
			} else {
				params[name] = value;
			}

			return this;
		}, 

		/**
		 * adds / returns paths to scan in
		 */

		'paths': function() {
			if(arguments.length) {
				includePaths(Array.apply(null, arguments), paths);
				return this;
			}

			return paths;
		},

		/**
		 * loads in modules via require
		 */

		'loaders': [],

		/**
		 * all the invokable methods against loaded modules
		 * DEPRECATED
		 */

		'methods': {},


		/**
		 * repl for methods
		 */

		'exports': {},


		/**
		 * factory for loading in modules
		 */

		'newPlugin': function(module, options, params, haba) {

			return module.plugin.call(haba, options, params, haba);

		},

		/**
		 */

		'factory': function(fn) {

			self.newPlugin = fn;
			return self;	

		},

		/**
		 * loads a plugin via loaders
		 */

		'require': function(required) {

			var newPlugins = Array.prototype.slice.call(arguments, 0);

			//more than one required item? recall require...
			if(newPlugins.length > 1) {

				newPlugins.forEach(function(plugin) {

					self.require(plugin);

				});

				return self;

			}

			toLoad.push(required);

			//incase require is called within a plugin...
			if(loading) loadAll();

			return self;
		},


		/**
		 * listener for when a plugin is ready
		 */

		'onLoad': function(search, ret, callback) {

			if(typeof ret == 'function') {
				callback = ret;
				ret      = false;
			}

			readyListeners.push({
				test: pluginNameTester(search),
				callback: callback
			});


			if(ret) {
				var plugin = self.plugin(search);

				if(plugin) callback(plugin);
			}
			
			return this;
		},

		/**
		 * locally included plugins
		 */

		'local': localPlugins,

		/**
		 * remotely included plugins
		 */

		'remote': remotePlugins,

		/**
		 */

		'plugin': allPlugins.plugin,

		/**
		 */

		'plugins': allPlugins.plugins,

		/**
		 */

		'emit': allPlugins.emit,

		/**
		 */

		'on': function(type, callback) {

			_em.on(type, callback);

		},

		/**
		 */

		'once': function(type, callback) {
			
			_em.once(type, callback);

		},

		/**
		 */

		'next': allPlugins.next, 

		/**
		 * DEPRECATED
		 */

		'init': function(callback) {

			return self.load(callback);
			
		},

		/**
		 */

		'load': function(callback) {
			
			//load the required plugins
			loadAll();

			//emit initialization
			this.local.emit('init');
			
			self.next(function() {
				_em.emit('loaded');
				this();
			});

			//add the queued item
			if(callback) self.next(callback);
			return this;

		}
	}, self);

	

	return self;
};

/**
 * global
 */

module.exports.paths = function() {
	if(arguments.length) {
		includePaths(Array.apply(null, arguments), global.habaPaths);
	} else {
		return paths;
	}
}