var outcome = require('../'),
fs = require('fs')

function doSomething(path, callback) {

	//wrap the callback around an error handler so any errors in *this* function
	//bubble back up to the callback - I'm lazy and I don't wanna write this stuff...
	var on = outcome.error(callback);

	//on success, call onRealPath. Any errors caught will be sent back
	//automatically
	fs.realpath(path, on.success(onRealPath));

	function onRealPath(path) {

		//ONLY call onStat if we've successfuly grabbed the file stats
		fs.lstat(path, on.success(onStat));
	}

	function onStat(stats) {

		//no errors, so send a response back
		callback(null, stats);
	}
}

doSomething(__dirname, function(err, result) {
	console.log(result);
})