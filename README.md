RESTful Command Line Interface for node.js

![Alt command line](http://i.imgur.com/DA77U.png)

### Features:

- history (up/down arrows)
- Colored input
- Progress Bar
- Loading/busy spinner
- Password input
- confirmation 
- prompt

### To Do:

- help menu

## Usage:


### Parameters:

```javascript

var celery = require('celery');


celery.on('hello :name', function(data)
{
	console.log('Hello ' + data.name +'!');
});

celery.on('set address :city :state :zip', function(data)
{
	console.log("City: %s, State: %s, Zip: %s ", data.city, data.state, data.zip);
});


celery.open();

celery.parse(process.argv);

```

### .progress(label, percent)

```javascript

var i = 0;

var interval = setInterval(function()
{
	celery.progress('Label: ', i++);
	
	if(i == 100) clearInterval(i);
}, 10);

```

### .loading(label)

```javascript

var spinner = celery.loading('Processing: ');

setTimeout(function()
{
	spinner.done(true);//undefined = done, true = success, false = fail
}, 1000);

````

### .prompt(label, callback)

```javascript

celery.prompt('Username: ', function(input)
{
	
});

````

### .confirm(message, callback)

```javascript

celery.confirm("Do you want to continue?", function(yes)
{
	if(yes)
	{
		//continue
	}
});

```

### .password(label[, mask], callback)

```javascript
	
//mask = *
celery.password('Password: ', '*', function(input)
{
	//password
});

//no mask
celery.password('Password: ', function(input)
{
	//password
});


### .auth(callback)

```javascript

celery.auth(callback(user, pass)
{
	//auth here
});

```

```

### Terminal

capistrano / jake style parsing:

	node ./cli-app hello:craig ↩
	hello craig!

or:

	node ./cli-app

	hello craig ↩
	hello craig!


