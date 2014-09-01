

Outcome.js is a simple flow-control library which wraps your `.callback(err, result)` functions. 

### Motiviation

- Write less code for handling errors.
- Easier to maintain.
- Keep error handling code separate. 



### Basic Example

Here's the traditional method of handling errors:

```javascript

var fs = require('fs');

function doSomething(path, callback) {

	fs.realpath(path, onRealPath);

	function onRealPath(err, path) {
		if(err) return callback(err);
		fs.lstat(path, onStat);
	}

	function onStat(err, stats) {
		if(err) return callback(err);
		callback(err, stats);
	}

}

doSomething('/path/to/something', function(err, result) {
	
	//inline with result handling - yuck
	if(err) {

		//do something with error
		return;
	}

	//do something with result
})
```

The outcome.js way:

```javascript

var fs  = require('fs'),
outcome = require('outcome');

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


var on = outcome.error(function(error) {
	//do something with error
}));

doSomething('/path/to/something', on.success(function(response) {
	//do something with result
}));

```

## API

### outcome(listeners)

- `listeners` - Object of listeners you want to attach to outcome.

```javascript

var onResult = outcome({
	
	//called when an error is caught
	error: function(error) {
		
	},

	//called when an error is NOT present
	success: function(result, thirdParam) {
		
	},

	//called back when an error, or result is present
	callback: function(err, result, thirdParam) {
		
	}
})

```

As shown in the example above, you can also wrap-around an existing callback:

```javascript
var onResult = outcome.error(function(error) {
	
}).
success(function(result, thirdParam) {
	
}).
callback(function(error, result, thirdParam) {
	
});
```


By default, any unhandled errors are thrown. To get around this, you'll need to listen for an `unhandledError`:

```javascript
outcome.on('unhandledError', function(error) {
	//report bugs here..., then throw again.
});


//fails
fs.stat('s'+__filename, outcome.success(function() {


});
```



### .callback()

Called when on error/success. `Same as function(err, data) { }`

Here's a redundant example:

```javascript

fs.stat(__filename, outcome.error(function(err) {
	//handle error
}).success(function(data) {
	//handle result
}.callback(function(err, result) {
	//called on fn complete regardless if there's an error, or success
}));

```

### .success(fn)

Called on Success.

```javascript
var onOutcome = outcome.success(function(data, anotherParam, andAnotherParam) {
	//handle success data
});

onOutcome(null, "success!", "more data!", "more results..");
```

### .error(fn)

Called on error.

```javascript

var onOutcome = outcome.error(function(err) {
	
});

onOutcome(new Error("something went wrong...")); 
```

### .handle(fn)

Custom response handler

```javascript

outcome.handle(function(response) {
	
	if(response.errors) this.error(response);
	if(response.data) this.success(response);
});

```


## CoffeeScript Example

```coffeescript

outcome = require "outcome"

doSomething(path, callback) ->
	
	on = outcome.error callback

	# first get the realpath
	fs.realpath path, on.success onRealPath

	# on real path, get stats
	onRealPath(path) -> fs.lstat path, on.success onStat

	# on stat, finish
	onStat(stats) -> callback null, stats


# call do something
doSomething '/path/to/something', outcome 

	success: (statis) ->
		# do something

	error: (error) ->
		# do something else


```


### Note

Calling `.error()`, `.success()`, `.callback()` generates a new function which copies the previous listeners. 
Checkout [fs-test](outcome.js/blob/master/examples/fs-test.js) in the [examples](outcome.js/blog/master/examples) folder.
