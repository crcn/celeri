
var EventEmitter = Structr({

    /**
     */
     
	'__construct': function ()
	{                      
		this._listeners = {};
	},
    
    /**
     * listens to an event
     * @type The type of event to listen to
     * @callback The callback when the event type is emitted
     */
     
	'on': function (type, callback)
	{             
		(this._listeners[type] || (this._listeners[type] = [])).push(callback);       
        
		var self = this;
		
		return {
			dispose: function ()
			{                                
				self.removeListener(type, callback);
			}
		}
	},
    
    /**
     * Removes an event listener
     */
     
	'removeListener': function (type, callback)
	{
		var lists = this._listeners[type],i,
		   self = this;
		if(!lists) return;  
		if((i = lists.indexOf(callback)) > -1)
		{
			lists.splice(i,1);
			
			if(!lists.length)
			{
				delete self._listeners[type];
			}
		}
	},
    
    /**
     * emits an event
     */
     
	'emit': function ()
	{                 
		var args = [],
			type = arguments[0],
			lists;
			
		for(var i = 1, n = arguments.length; i < n; i++)
		{
			args[i-1] = arguments[i];
		}       
		
		
		if(lists = this._listeners[type])  
		for(var i = lists.length; i--;)
		{                       
			lists[i].apply(this, args);
		}     
	}
});      





var em = new EventEmitter();

em.on('sayHello', function(value)
{
    alert('Hello '+value);
});

em.on('sayHello', function(value)
{
    alert('Hello '+value);
});

em.on('sayHello', function(value)
{
    alert('Hello '+value);
});

em.on('sayHello', function(value)
{
    alert('Hello '+value);
});


em.emit('sayHello', 'craig');