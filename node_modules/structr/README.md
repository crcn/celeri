Structr -  Structure for Javascript            
======================================== 

Structr is a framework with the following goals:
                                               
* Lightweight.
# Fast.
* Provide as few new concepts as possible coming from OOP.
* Easy to learn.
* Help develop re-useable, clean, and consistent code.              
* Reduce the amount of reduntant/boilerplate code.  


### Supported Operators:        
                                             
* _super                                     
* inheritance      
* overloading methods
* Implicit / Explicit getters & setters
* Override, and Static  
* abstract methods
* add your own custom operators (mixins)


### Third-party mixins

* [asyngleton](/crcn/asyngleton.js) - asynchronous singletons
* [step](/crcn/structr-step) 
                           


### Installation

Node.js: 

	npm install structr
		   
		
### .structr([...parents], classObject)


```javascript

var EventEmitter = require("events").EventEmitter,
structr          = require("structr");
 
/**
 * create a mouse class which extends the node.js event emitter
 */

var Mouse = structr(EventEmitter, {  

	/**
	 */

	"__construct": function() {
		this._super();

		//initial coords
		this.move(0, 0);
	},

	/**
	 * moves the mouse
	 */

	"move": function(x, y) {
		this.position({ x: x, y: y});
	},

	/**
	 * second version of move incase an object is provided
	 */

	"second move": function(position) {
		this.position(position);
	},

	/**
	 * getter / setter for the position
	 */

	"explicit position": {
		"get": function() {
			return this._position;
		},
		"set": function(value) {
			this._position = value;
			this.emit("move");
		}
	} 
});                      

var mouse = new Mouse();

//listen for when the mouse has moved
mouse.on("move", function() {
	console.log("mouse moved!");
})

//move 100 px left, and 100 px from the top
mouse.move(100, 100);

```


### Class.extend(target, [...mixins]);

Extends a class


```javascript

var fs  = require("fs"),
structr = require("structr"),
mkdirp  = require("mkdirp"),
path    = require("path");

//mixin the singleton plugin
structr.mixin(require("asyngleton"));

/**
 * base cache interface
 */

var AbstractCache = structr({
	
	/**
	 * returns a cached value
	 */

	"abstract get": function(key, onGet) { },

	/**
	 * sets a cached value
	 */

	"abstract set": function(key, value, onSet) { }
});

/**
 * memory cache
 */

var MemoryCache = AbstractCache.extend({
	
	/**
	 */

	"__construct": function() {
		this._collection = {};
	},

	/**
	 */

	"get": function(key, onGet) {
		onGet(null, this._collection[key]);
	},

	/**
	 */

	"set": function(key, value, onSet) {
		this._collection[key] = value;
		if(onSet) onSet(null, value);
	}
});


/**
 */

var FsCache = MemoryCache.extend({
		
	/**
	 */

	"override __construct": function(path) {
		this._path = path;
		this._super();
	},

	/**
	 */

	"override set": function() {
		this._super.apply(this, arguments);
		this._save();
	},

	/**
	 */

	"override get": function(key, onKey) {
		var _super = this._super;

		//load the fs cache before getting the value - this only happens ONCE 
		//since _load is an asynchronous singleton.
		this._load(function() {
			_super(key, onKey);
		});
	},


	/**
	 * saves the collection to disc
	 */

	"_save": function() {
		if(this._saving) return;
		this._saving = true;

		var self = this;

		//make the directory incase it doesn't exist. 
		this._mkdir(path.dirname(this._path), function() {

			//write the json file, with the json content
			fs.writeFile(self._path, JSON.parse(self._collection), function(err result) {

				//give some time before unlocking the save method. 
				//We don't want to hit fs.write on each set
				setTimeout(function() {
					self._saving = false;
				}, 2000);
			});
		});
	},

	/**
	 * loads the fs cache into memory
	 */

	"singleton _load": function(onLoad) {
		try {
			this._collection = require(this._path);
		} catch(e) {
			//do nothing - the file doesn't exist
		}
		onLoad();
	},

	/**
	 * makes the fs cache directory incase it's nested. Only happens ONCE on save.
	 */

	"singleton _mkdir": function(onMkdir) {
		mkdirp(path.dirname(this._path), onMkdir);
	}
});


var cache = new FsCache(__dirname + "/test.json");


cache.get("name", function(err, name) {

	if(name) {
		return console.log("hello %s!", name);
	}

	cache.set("name", "craig", function() {
		console.log("saved!");
	});
});

```

### Modifiers    
                      
### Overriding Methods

Methods overridden have access to the _super property.

```javascript

"override __construct": function ()
{
	this._super();
}

```

### Overwriting Methods
   
Faster if you don't plan on using _super.


```javascript

"__construct": function ()
{
	//cannot access _super __construct
}

```
	
	
### Overloading Methods (Experimental)

Overloading methods allows you to write methods which are mapped out depending on the number of parameters used. You must provide your own identifier (it could be anything) for each overloaded method, otherwise you'll simply be overwriting methods. For this example, I separate methods based on their order, e.g. `one`, `two`, `three`, etc.


```javascript

var Person = Structr({

	"sayHello": function (name, callback)
	{
		this._name = name;
		this.sayHello(callback);
	},

	"second sayHello": function (callback)
	{
		callback(this.sayHello());
	},

	"third sayHello": function ()
	{
		return 'Hello ' + this._name;
	}
});

var SubPerson = Person.extend({

	"override sayHello": function (callback)
	{
		callback(this.sayHello() + " Do you like italian food?");
	},

	"override second sayHello": function ()
	{
		return "Hello " + this._name + ", how are you doing today?";
	}
});


var p = new SubPerson();
p.sayHello("Craig", function(message)
{
	alert(message); //Hello Craig. how are you doing today? Do you like italian food?
});

```

### Static Keyword 

Properties, and methods set to the class versus objects instantiated.


```javascript

var Singleton = Structr({
	
	"static getInstance": function ()
	{
		return this._instance || (this._instance = new Singleton());
	}
});

var test1 = Singleton.getInstance();
var test2 = Singleton.getInstance();
test2.name = 'Craig';

console.log(test1.name); //Craig

```

### Getters & Setters   

Both Implicit / Explicit methods are supported, however implicit getters & setters aren't supported in all browsers. Use implicit get/set if you're doing any development under a specific platform such as Node.js, or Appcelerator Titanium.



```javascript

var GSTestClass = Structr({

	"explicit explicitValue": {
		"get": function ()
		{
			return this._name;
		},
		"set": function (value)
		{
			this._name = value;
		}
	},
	
	"implicit implicitValue": {
		"get": function ()
		{
			return this._name;
		},
		"set": function (value)
		{
			this._name = value;
		}
	},
	
	"explicit explicitValue2":true
});


var test = new GSTestClass();
test.explicitValue('Craig'); 
console.log(test.explicitValue());

test.implicitValue = 'Tim';
console.log(test.implicitValue);//Tim
console.log(test.explicitValue());//Tim

test.explicitValue2('hello world');
console.log(test.explicitValue2());//hello world
	
```

Metadata 
--------

Custom modifiers are considered metadata. Use them to identify how specific methods should be handled.


```javascript


var MetadataTestClass = Structr({
	
	"myCustomMetadata test": function ()
	{
		return "Hello Test";
	}
}));


console.log(MetadataTestClass.prototype.test.myCustomMetadata); //true

```
	
	
###Bindable Metadata

To add. Makes a property bindable for change. Psuedocode:


```javascript

var Person = Structr({
	
	"__construct": function(name)
	{
		this.name(name);
		
		Bindable.apply(this);
	},
	
	"bindable explicit name": 1
});


var person1 = new Person("craig");

//listen for any change to name
person1.name.subscribe(function(newName)
{
	alert('Name changed to '+newName);
});

//on change the subscribers will be triggered
person1.name("Craig");

```
	
###Setting Metadata

To add. Easy way to store settings on the user's computer. Psuedocode:


```javascript

var User = Structr({

	"__construct": function ()
	{
		SettingManager.apply(this);
	},
	
	"login": function ()
	{
		
		//set the account info which will be saved as a cookie
		this.accountInfo({ name: "Craig", last: "Condon", token: "XXXXXXXXXX" })
	},
	
	"setting explicit accountInfo": 1
});


var u = new User();

//this gets passed once
if(!u.accountInfo)
{
	u.login();
}
else
{
	//pulled from local computer
	alert(u.accountInfo.name);
}

```
	
	
Tips:
----

	
* Wrap methods / properties in single, or double quotes. 
* Avoid the over-use of override, or overloaded methods.
* Only use Structr where you would create prototyped classes.


To Do:
------

- change _super(...) to _super({ method: [args]  }), or _super('method').call(...);

	


