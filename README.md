
### C-e-L-er-I

![Alt command line](http://i.imgur.com/DA77U.png)

### Features:

- history (up/down arrows)
- Colored input
- Progress Bar
- Loading/busy spinner
- Password input
- confirmation 
- prompt
- multi-line tables
- Build flexible commands via [beanpole](https://github.com/spiceapps/beanpole)
    - OR statement 
    - middleware
    - parameters

### To Do:

- Title View
- Tree View
- help menu api
- Error handling (display of command not found)
- Add transports instead of depending on native stdin/stdout
    - Ability to use online

## Usage:


### .on(event, callback)

Listens for a key (enter, up, left, backspace, etc.), or command. See [beanpole](https://github.com/spiceapps/beanpole) for documentation.

"OR" statement:

```javascript

var celery = require('celery');


celery.on('hello :name OR hi :name', function(data)
{
	console.log('Hello ' + data.name +'!');
});

celery.on('set address :zip OR set address :city :state :zip', function(data)
{
	console.log("City: %s, State: %s, Zip: %s ", data.city || 'None provided', data.state || 'None provided', data.zip);
});


celery.open();

celery.parse(process.argv);

```

Middleware "->" statement:


```javascript

celery.on('delay :seconds', function(data)
{
    console.log("delaying for %s seconds", data.seconds);

    setTimeout(function(self)
    {
        if(!self.next()) console.log("done!");
    }, Number(data.seconds) * 1000, this);
});


celery.on('delay 1 -> say hello :name', function(data)
{
   console.log('hello %s!', data.name); 
});

```

here's what you get:

    > delay 5 ↩
    delaying for 5 seconds
    done
    > say hello craig ↩
    delaying for 1 seconds
    hello craig!



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
    columns: ['name','age','interests']
});


```

Gives you something like:


![Alt command line](http://i.imgur.com/oUtC9.png)


Here's a multi-line table:


![Alt command line](http://i.imgur.com/O5o47.png)


### Let's kick it up a notch


```javascript

var celery = require('../lib');


var credentials;


 
celery.on('login OR login :user :pass', function(data)
{
    
    //reference to the current request
    var self = this;
    

    //called auth credentials have been entered in
    function onAuth(creds)
    {

        //credits wrong? DO NOT CONTINUE
        if(creds.user != 'user' || creds.pass != 'pass')
        {
            return console.log("Incorrect user / pass".red);
        }
        
        //otherwise, add the user to the CURRENT request so it can be passed
        //onto the next router listener
        self.user = creds.user;
        
        //cache the credentials so the user doesn't have to login each time
        credentials = creds;
        
        //not another listener? display a success response
        if(!self.next()) console.log("Logged in as %s", creds.user.green);
    }
    
    
    //user already logged in? pass!
    if(credentials)
    {
        onAuth(credentials);
    }
    
    //otherwise check if the user is passed in the route
    else
    if(data.user && data.pass)
    {
        onAuth(data);
    }
    
    //or prompt for authentication
    else
    {
        celery.auth(function(user, pass)
        {
            onAuth({ user: user, pass: pass });
        });
    }
});



/**
 * This stuff's private. The user has to be authenticated *before* this command is executed
 */
 
celery.on('login -> account', function()
{
    console.log('Here\'s your account info %s!', this.user.green);
});

celery.open();



celery.parse(process.argv);


```

Here's what you get:

![Alt command line](http://i.imgur.com/g7ywq.png)


### Terminal

capistrano / jake style parsing:

	node ./cli-app hello:craig ↩
	hello craig!

or:

	node ./cli-app

	hello craig ↩
	hello craig!


