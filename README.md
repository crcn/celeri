
### C-e-L-er-I

![Alt command line](http://i.imgur.com/DA77U.png)

### Features:

- History (up/down arrows)
- Progress Bar
- Loading/busy spinner
- Password input
- Confirmation 
- Prompt
- Parse command line args
- help menu, and sub help menu
- Multi-line tables
- Build flexible commands via [beanpole](https://github.com/spiceapps/beanpole)
    - OR statement 
    - Middleware
    - Parameters  
- Trees
- *Exposing Javascript*, and calling it from the command line - inspired by mongo's CLI utilitiy

### To Do:

- Help menu api
- Title View   
- Custom colors for each view (input, loader, progress, table, etc.): exports.colors = {}
- Error handling (display of command not found)
- Add transports instead of depending on native stdin/stdout
    - Ability to use online



## Usage:


### .option(cmdOrOps, descOrCallback, callback)

Listens for a key (enter, up, left, backspace, etc.), or command. See [beanpole](https://github.com/spiceapps/beanpole) for documentation.

#### Hello World: 

```javascript

var celeri = require('celeri');

//an option with info for the help menu
celeri.option({
    command: 'hello :person',
    description: 'Prints "hello [person]!"',
    optional: {
        '--age': 'The person\'s age',
        '--gender': 'The person\'s gender'
    }
}, function(data) {

   console.log("Hello %s!", data.person);
   
   if(data.age) console.log("%s is %d years old.", data.person, data.age); 
   if(data.gender) console.log("%s is a %s.", data.person, data.gender); 

});

//open for character input
celeri.open();

//parse the command line args
celeri.parse(process.argv);

```

Interactive in terminal:
    
```
# node ./cmd ↩
> hello craig ↩
hello craig!
```

passed as arguments:

```
# node ./hello hello craig --age=21 --gender=cat ↩
hello craig!
craig is 21 years old.
craig is a cat.
```

Help menu:

```
# node ./cmd help ↩

Usage: [command] --arg=value --arg2

Help:
  help        Show help menu
  [cmd] help  Show command help menu

Commands:
  hello       Prints "hello [person]!""

```

Command Specific help menu:

```
# node ./cmd hello help  ↩

Prints "hello [person]!""

Usage: hello [person]

Optional Flags: 
  --age       The person's age
  --gender    The person's gender
```



### .usage(value)

Sets the help menu usage text

```javascript
celeri.usage('[command] --arg=value');
```


#### "OR" statement:

```javascript


celeri.option('hello :name OR hi :name', 'some description', function(data)
{
	console.log('Hello ' + data.name +'!');
}).
option('set address :zip OR set address :city :state :zip', function(data)
{
	console.log("City: %s, State: %s, Zip: %s ", data.city || 'None provided', data.state || 'None provided', data.zip);
});

```

### .onJs(api)

You can easily expose javascript functions by providing an object:

```javascript


var api = {
    sayHello: function(name) {
        console.log("hello %s!", name || 'craig');
    }
}

celeri.onJs({ api: api });

```

In terminal:
    
    node ./hello ↩
    > api.sayHello("john"); ↩
    hello john!

### .progress(label, percent)

```javascript

var i = 0;

var interval = setInterval(function()
{
	celeri.progress('Label: ', i++);
	
	if(i == 100) clearInterval(i);
}, 10);

```

### .loading(label)

```javascript

var spinner = celeri.loading('Processing: ');

setTimeout(function()
{
	spinner.done(true);//undefined = done, true = success, false = fail
}, 1000);

````

### .prompt(label, callback)

```javascript

celeri.prompt('Username: ', function(input)
{
	
});

````

### .confirm(message, callback)

```javascript

celeri.confirm("Do you want to continue?", function(yes)
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
celeri.password('Password: ', '*', function(input)
{
	//password
});

//no mask
celeri.password('Password: ', function(input)
{
	//password
});

```

### .auth(callback)

```javascript

celeri.auth(function(user, pass)
{
	//auth here
});

```


### .drawTable(objects, ops)

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

celeri.drawTable(objects, {
    columns: ['name','age','interests']
});


``` 


Gives you something like:


![Alt command line](http://i.imgur.com/oUtC9.png)


Here's a multi-line table:


![Alt command line](http://i.imgur.com/O5o47.png)    

### .drawTree(tree)   

Draws a tree

````javascript
                        
//print out the contents of the celeri object
celeri.drawTree(celeri);    

````

Here's another example:

![Alt command line](http://i.imgur.com/4F0e0.png)


### Let's kick it up a notch


```javascript

var celeri = require('../lib');


var credentials;


 
celeri.option('login OR login :user :pass', function(data)
{
    
    //reference to the current request
    var self = this;
    

    //called after auth credentials have been entered in
    function onAuth(creds)
    {

        //credits wrong? DO NOT CONTINUE
        if(creds.user != 'user' || creds.pass != 'pass')
        {
            return console.log("Incorrect user / pass".red);
        }
        
        //otherwise, add the user to the CURRENT request so it can be passed
        //onto the next route listener
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
        celeri.auth(function(user, pass)
        {
            onAuth({ user: user, pass: pass });
        });
    }
});



/**
 * This stuff's private. The user has to be authenticated *before* this command is executed
 */
 
celeri.option('login -> account', function()
{
    console.log('Here\'s your account info %s!', this.user.green);
});

celeri.open();



celeri.parse(process.argv);


```

Here's what you get:

![Alt command line](http://i.imgur.com/g7ywq.png)


