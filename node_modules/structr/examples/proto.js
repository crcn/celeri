var EventEmitter = require('events').EventEmitter,
Structr = require('../');


var SomeClass = Structr({

	'override __construct': function() {
		
		this._super();

		console.log("CONSTRUCT")
	},
	
	sayHello: function() {
		
	}
}, EventEmitter);


var test = new SomeClass();

test.on('hello', function() {
	console.log("HELLO")
});

test.emit('hello')