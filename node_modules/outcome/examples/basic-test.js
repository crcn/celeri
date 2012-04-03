var outcome = require('../');


var onResult = outcome({
	success: function() {
		console.log("SUCCESS")
	},
	callback: function() {
		console.log("CB")
	}
});

var onResult2 = outcome({
	success: function() {
		console.log("SUCCESS2")
	},
	callback: function() {
		console.log("CB2")
	}
});


onResult();
onResult2();