Structr -  Structure for Javascript            
======================================== 

Structr is a framework with the following goals:
                                               
* Lightweight.
* Provide as few new concepts as possible coming from OOP.
* Easy to learn.
* Help develop re-useable, clean, and consistent code.              
* Reduce the amount of reduntant/boilerplate code.  
	

Supports:        
                                             
* _super                                     
* inheritance      
* overloading methods
* Implicit / Explicit getters & setters
* Override, and Static       
* metadata      
* mixing modifiers. e.g: 'explicit bindable name': function(){}          
	

Installation
------------

Node.js: 

	npm install structr
		   
		
Using Structr
-------------


```javascript
 
var Recipe = Structr({  
	
	'__construct': function (name)
	{
		this._name = name;
	},                
	
	'name': function ()
	{
		return this._name;
	},
	
	'ingredients': function ()
	{
		alert('This is going to be tasty...');
	}
});                      

var tiramisuRecipe = new Recipe('Tiramisu');   
console.log(tiramisuRecipe.name()); //tiramisu

```


### Class.extend


```javascript

var TiramisuRecipe = Recipe.extend({

	'override __construct': function ()
	{
		this._super('Tiramisu');
	},
	
	'override ingredients': function ()
	{
		this._super();
		
		alert('Mascarpone, Heavy Cream, Eggs, Espresso, Sugar, Cocoa, Baileys, and Lady Fingers.');
	}
});

var PastaRecipe = Recipe.extend({
	
	'override __construct': function ()
	{
		this._super('Pasta');
	},
	
	'override ingredients': function ()
	{
		this._super();
		
		alert('Eggs, Flour, Water, Salt');
	}
});

var tiramisu = new TiramisuRecipe();
var pasta = new PastaRecipe();

tiramisu.ingredients();
pasta.ingredients();

```



Modifiers
---------      
                      
### Overriding Methods

Methods overridden have access to the _super property.

```javascript

'override __construct': function ()
{
	this._super();
}

```

### Overwriting Methods
   
Faster if you don't plan on using _super.


```javascript

'__construct': function ()
{
	//cannot access _super __construct
}

```
	
	
### Overloading Methods (Experimental)

Overloading methods allows you to write polymorphic functions which are mapped out depending on the number of parameters used. You must provide your own identifier (it could be anything) for each overloaded method, otherwise you'll simply be overwriting methods. 


```javascript

var Person = Structr({

	'sayHello': function (name, callback)
	{
		this._name = name;
		this.sayHello(callback);
	},

	'2 sayHello': function (callback)
	{
		callback(this.sayHello());
	},

	'3 sayHello': function ()
	{
		return 'Hello ' + this._name;
	}
});

var SubPerson = Person.extend({

	'override sayHello': function (callback)
	{
		callback(this.sayHello() + ' Do you like italian food?');
	},

	'override second sayHello': function ()
	{
		return 'Hello ' + this._name + ', how are you doing today?';
	}
});


var p = new SubPerson();
p.sayHello('Craig', function(message)
{
	alert(message); //Hello Craig. how are you doing today? Do you like italian food?
});

```

### Static Keyword 

Properties, and methods set to the class versus objects instantiated.


```javascript

var Singleton = Structr({
	
	'static getInstance': function ()
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

	'explicit explicitValue': {
		get: function ()
		{
			return this._name;
		},
		set: function (value)
		{
			this._name = value;
		}
	},
	
	'implicit implicitValue': {
		get: function ()
		{
			return this._name;
		},
		set: function (value)
		{
			this._name = value;
		}
	},
	
	'explicit explicitValue2':true
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
	
	'myCustomMetadata test': function ()
	{
		return 'Hello Test';
	}
}));


console.log(MetadataTestClass.prototype.test.myCustomMetadata); //true

```
	
	
###Bindable Metadata

To add. Makes a property bindable for change. Psuedocode:


```javascript

var Person = Structr({
	
	'__construct': function(name)
	{
		this.name(name);
		
		Bindable.apply(this);
	},
	
	'bindable explicit name': 1
});


var person1 = new Person('craig');

//listen for any change to name
person1.name.subscribe(function(newName)
{
	alert('Name changed to '+newName);
});

//on change the subscribers will be triggered
person1.name('Craig');

```
	
###Setting Metadata

To add. Easy way to store settings on the user's computer. Psuedocode:


```javascript

var User = Structr({

	'__construct': function ()
	{
		SettingManager.apply(this);
	},
	
	'login': function ()
	{
		
		//set the account info which will be saved as a cookie
		this.accountInfo({ name: 'Craig', last: 'Condon', 'token': 'XXXXXXXXXX' })
	},
	
	'setting explicit accountInfo': 1
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

* Use underscores before any private method / property. 

E.g: 


```javascript

var SomeClass = Structr({
	
	'__construct': function ()
	{
		this._myPrivateVariable = 'some private value';
	},
	
	'_myPrivateMethod': function ()
	{
		//private stuff here
	}
});

```
	
* Wrap methods / properties in single, or double quotes. 
* Avoid the over-use of override, or overloaded methods.
* Only use Structr where you would create prototyped classes.


To Do:
------

- change _super(...) to _super({ method: [args]  }), or _super('method').call(...);

	


