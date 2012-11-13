var EventEmitter = require('events').EventEmitter,
Structr = require('../');


Structr.mixin({
	type: "operator",
	name: "log",
	factory: function(that, property, value) {
		console.log("LOG");

		return function() {
			console.log("logging");
			value.apply(this, arguments);
		}
	}
});


var SomeClass = Structr(EventEmitter, {

	'override __construct': function() {
		
		this._super();

		console.log("CONSTRUCT")
	},
	
	"log sayHello": function() {
		this.emit("hello");
	}
});

// console.log(String(EventEmitter.constructor))
// console.log(SomeClass instanceof EventEmitter)



var test = new SomeClass();

test.on('hello', function() {
	console.log("HELLO")
});

test.sayHello();