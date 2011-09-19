Command Line Interface with a restful feel

![Alt command line](http://i.imgur.com/DA77U.png)

### Features:

- history (up/down arrows)
- Colored input
- Progress Bar
- Loading/busy spinner
- Password input
- confirmation 
- prompt

### Road map:

- Title View
- Tree View
- help menu api
- Input? >
- Error handling (display of command not found)

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

```

### .auth(callback)

```javascript

celery.auth(function(user, pass)
{
	//auth here
});

```

### .loadHelp(filePath)

```javascript

celery.on('help', function()
{
	celery.loadHelp(__dirname +'/help.txt');
});

```


### .table(objects, ops)

```javascript

var objects = [
    
    {
        name: 'Craig',
        age: 21,
        interests: 'Cooking, espresso, backpacking, coding'
    },
    
    
    {
        name: 'Tim',
        age: 21,
        interests: 'Design, Traveling, Photography'
        
    }

];

celery.drawTable(objects, {
    columns: { 
        name: 15, 
        age: 20, 
        interests: 15
    }
    
});


```

Gives you something like:


![Alt command line](http://i.imgur.com/oUtC9.png)


### Terminal

capistrano / jake style parsing:

	node ./cli-app hello:craig ↩
	hello craig!

or:

	node ./cli-app

	hello craig ↩
	hello craig!


