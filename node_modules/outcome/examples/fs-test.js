var fs = require('fs'),
outcome = require('../'),
EventEmitter = require('events').EventEmitter;





var onResult = outcome.error(function(err) {
	console.log(err);
}).success(function(result) {
	console.log(result)
}).callback(function(err, result) {
	console.log("CALLBACK")
});






var onResult2 = onResult.success(function(result) {
	
	console.log("RESULT")
});

var onResult3 = outcome({
	error: function() {
		console.log("ERR")
	},
	success: function() {
		console.log("SUCC")
	},
	callback: function(err, result) {
		console.log("CB")
	}
})
 
fs.stat(__filename, onResult);
fs.stat(__filename, onResult2);
fs.stat('s'+__filename, onResult2);
fs.stat('s'+__filename, onResult3)

