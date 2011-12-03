var core = require('./core'),
fs = require('fs'),
path = require('path');


var fileExists = function(file) {
	try {
		fs.statSync(file);
		return true;
	} catch (e) {
		return false;
	}
}

module.exports = function() {
	
	var haba = core();

	haba.loaders 

		
	var loadJsFile = {
		test: function(jsPath) {
			return haba.resolve(jsPath);
		},
		load: function(jsPath, callback, name) {
			fullPath = haba.resolve(jsPath); //yeah, more overhead >.>
			
			if(!name) name = path.basename(jsPath).replace('.js','');

			callback(false, { module: require(fullPath), name: name, path: fullPath });
		}
	}

	/**
	 * scans a directory
	 */

	var loadDirectory = {
		test: function(dir) {
			return fileExists(dir) && fs.statSync(dir).isDirectory();
		},
		load: function(dir, callback) {
			fs.readdirSync(dir).forEach(function(basename) {
				loadJsFile.load(dir + '/' + basename, callback);
			});
		}
	}

	/**
	 */

	var loadConfig = {
		test: function(pkgPath) {
			return typeof pkgPath == 'string' && pkgPath.match(/json$/);
		},
		load: function(pkgPath, callback) {
			var plugins = JSON.parse(fs.readFileSync(pkgPath,'utf8')).plugins;

			for(var name in plugins) {
				var par = plugins[name];

				//param values for the given plugin
				if(typeof par == 'object') params[name] = par;

				loadJsFile.load(name, callback, name)
			}
		}
	}

	/**
	 * recursively load directories
	 */

	var findModules = function(search, cwd, modules) {
		if(!modules) modules = [];

		fs.readdirSync(cwd).forEach(function(basename) {
			var fullPath = cwd + '/' + basename;
			if(fs.statSync(fullPath).isDirectory()) {
				findModules(search, fullPath, modules);
			} else 
			if(basename.match(search)) {
				modules.push(fs.realpathSync(fullPath));
			}
		});

		return modules;
	}

	var loadTree = {
		test: function(dir) {
			return dir.indexOf('**') > -1
		},
		load: function(dir, callback) {
			var dirParts = dir.split('**'),
			cwd          = dirParts.shift(), 
			search       = new RegExp('^'+dirParts.pop().split('/').pop().replace(/\./g,'\\.').replace(/\*/g,'.*?') + '$');

			findModules(search, cwd).forEach(function(file) {
				loadJsFile.load(file, callback);	
			});
		}
	}

	/**
	 */

	var loadObj = {
		test: function(obj) {
			return typeof obj == 'object';
		},
		load: function(obj, callback) {
			callback(obj, obj.name);
		}
	}

	//setup the core loaders
	haba.loaders = [loadJsFile, loadConfig, loadDirectory, loadTree, loadObj];


	//now that all the core loaders are in, we can add the additional loaders dropped in ./loaders (cleaner)
	haba.require(__dirname + '/loaders', __dirname + '/plugins');
	

	return haba;
};