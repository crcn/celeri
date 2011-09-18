Command Line Interface for Node.js 

![Alt command line](http://i.imgur.com/DA77U.png)

### Features:

- history (up/down arrows)
- Colored input
- Progress Bar
- Loading/busy spinner
- Password input
- confirmation 

### To Do:

- help menu

### Usage:

```javascript

	var celery = require('celery');


	celery.on('hello :name', function(data)
	{
		console.log('Hello ' + data.name +'!');
	});


	celery.open();

	celery.parse(process.argv);
```

terminal:

	node ./cli-app hello:craig ↩
	hello craig!
or:

	node ./cli-app

	hello craig ↩
	hello craig!


