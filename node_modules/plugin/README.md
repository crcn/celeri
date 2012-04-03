### Plugin Library for node.js

### Motivation

- Modularity - encourages code-reuse, abstraction, and encapsulation
- Easily drop plugins in and out without breaking your program
- Maintainability
- Flexibility over dependencies
- Asyncronously load remote plugins via [dnode](/substack/dnode) (*soon* - [now.js](/flotype/now), [beanpoll](beanpole)). 
- *soon* double as online async module loader (similar to [head](https://github.com/headjs/headjs)).

## Basic Usage

A simple use case with express:

```javascript

var haba = require('haba').loader(),
server = require('express').createServer();

haba.options(server, true).
require("path/to/plugins/dir");

server.listen(8080);

```

In your `hello world` plugin:

```javascript

exports.plugin = function(server) {
	
	server.get('/', function(req, res) {
		
		res.send("Hello World!");
	});
}

```

## Plugins

- [haba.dnode](/crcn/haba.dnode) - dnode plugin


## Haba API

### haba.require(path)

includes target dependencies

```javascript
plugins.require('path/to/plugin.js').      // require one plugin
require('path/to/plugins/dir').          // require all plugins in directory
require('path/to/plugins/**/*.plugin.js'). // find plugins, and load them
require('plugin1.js','plugin2.js','plugin3.js'). //multiple plugin args
require('./config.json').load(); //load plugins in configuration file { plugins: ['my/plugin.js','...'] }
```

### haba.paths(path)

adds a path to scan when requiring plugins. Similar to the old `require.paths.unshift`

```javascript
haba.paths('/path/to/plugins').require('my-plugin');

console.log(haba.paths());// ['/path/to/plugins','/path/to/node_modules','...'];
```

### haba.params(params)

params specific to plugin - like constructor parameters

bootstrap.js:

```javascript
haba.params({
	'api.server': {
		'port': 8080
	}
}).

//or
params('api.server', { port: 8080 }).
require('api.server');
```

api.server/index.js:

```javascript
exports.plugin = function(ops, params) {
	console.log(params.port); //8080	
}
```


### haba.options(ops)

Adds / returns options which are passed in the first parameter for each plugin.

bootstrap.js:

```javascript
haba.options({ message: 'hello world!' }).require('hello.plugin.js');
```

hello.plugin.js:

```javascript
exports.plugin = function(ops) {
	console.log(ops.message); //hello world!
}
```

### haba.onLoad(pluginSearch, ret, callback)

Listens for when a plugin is ready - useful especially if a dnode server resets

```javascript

haba.onLoad('my.plugin', function() {
	
	console.log("ready!");
}).require('my.plugin');
```

### haba.local haba.remote

remote/local collections. Same api as haba (emit, plugin, plugins)

### haba.emit(type, data)

emits a method against all loaded plugins. If the method doesn't exist, it'll be ignored.

bootstrap.js:

```javascript
haba.loader().require('api.server').load().emit('doStuff');
```

api.server/index.js:

```javascript
exports.plugin = function() {
	
	return {
		doStuff: function() {
			console.log("PREPARE");	
		},
		init: function() {
			console.log("INIT");
		}
	};
}
```

### haba.load()

Loads the plugins, and initializes them.

### haba.next(callback)

Queue function called after loading in all modules

### haba.exports

All the invokable methods against modules




### haba.plugins(search)

Returns *multiple* plugins based on the search criteria.

```

var loader = haba.loader();

loader.require('oauth.part.twitter','oauth.part.facebook','oauth.core').
load(function() {
	loader.plugins(/^oauth.part.\w+$/).forEach(function(service) {
	
		//do stuff with the oauth plugins

	});
});
```


### haba.plugin(search)

Returns a *single* based on the search criteria given.


### haba.loaders

Loads plugins passed into `haba.require()`.

```javascript
//dnode plugin
haba.loaders.push({
	test: function(path) {
		return !!path.match(/dnode+\w+:\/\//); //dnode+https://my-dnode-server.com
	},
	load: function(path, callback) {
		//load dnode module here
	}
});
```

### haba.factory(fn)

Plugin factory function

haba.factory(function(module, options, params) {
	return module(options, params); //instead of exports.plugin = function(){}, it would be module.exports = function(options, params)
});

### haba.newPlugin

Plugin factory for haba. Setting this method will change the way modules are loaded in.

```javascript


haba.newPlugin = function(module, options, params) {	
	return module(options, params); //instead of exports.plugin = function(){}, it would be module.exports = function(options, params)
};

```


## Plugins API


### exports.require

Dependencies for the given plugin. This is checked once `haba.call`, or `haba.load` is invoked. An exception is thrown if there are any missing dependencies.

```javascript

exports.require = ['api.services.photos.*','another-plugin']; //requires any photo services. E.g: api.services.photos.facebook, api.services.photos.flickr

exports.require = [/api\.\w+/]; //regexp test

exports.require = function(name) { //function test
	return name.indexOf('api.services.photos') > -1
};


```

You can also load in any given plugin via `exports.require`:

```javascript

exports.require = 'my-plugin';


exports.plugin = function() {
	
	var haba = this;

	return {
		init: function() {
			
			haba.plugin('my-plugin').doStuff();//return a single instance
			haba.plugins('my-plugin').forEach(funtion(plugin) {//return multiple instances
				plugin.doStuff();
			});
		}
	}
}
```

### exports.name

Optional name for the plugin. The default value is name provided when requiring the plugin.


### Plugin exports.plugin(options, params, haba)

Called when the plugin is loaded. 

- `options` - options which are passed to the plugin, along with every other plugin.
- `params` - parameters which are specific to the loaded plugin.
- `haba` - the haba loader. Also accessible via `this`.
- return type can be `void`, or an `object`.







 

