var tty = require('tty'),
fs = require('fs'),
listeners = {},
_buffer = '',
Structr = require('structr'),
beanpole = require('beanpole'),
router = beanpole.router();

exports.listeners = listeners;


//convert to a beanpole route
function _toRoute(type)
{
    return type.replace(/\s+/g,' ').replace(/\s/g,'\/').toLowerCase();
}
 

exports.on = function(type, callback)
{

    if(typeof type == 'object')
    {
        var disposables = [];
        
        for(var t in type)
        {
            var prop = t;
            
            if(callback)
            {
                prop = type[t];
            }
            
            disposables.push(exports.on(prop, callback || prop));
        }
        
        return {
            dispose: function()
            {
                disposables.forEach(function(disposable)
                {
                    disposable.dispose();
                });
            }
        };
    }
    
    return router.on('push '+_toRoute(type), callback);
    
}

exports.emit = function(type, data)
{
   
    //catch parse errors
    try
    {
        return router.push(_toRoute(type), data, { meta: { passive: 1 } });
    }
    catch(e)
    {
    }    

}


exports.buffer = function(value)
{
    if(!arguments.length) return _buffer;
    
    _buffer = value;
    
    return exports.replaceLine(value);
}

exports.replaceLine = function(buffer)
{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(buffer);
    process.stdout.cursorTo(buffer.length);
    _buffer = buffer;
}



function stringRep(key)
{
    var chain = '';
    
    for(var prop in key)
    {
        if(!key[prop]) continue;
        
        if(key[prop] == true)
        {
            chain = prop+'-'+chain;
        }
        else
        {
            chain += key.name;
        }
    }
        
    return chain;
}

exports.write = function(string)
{
    process.stdout.write(string);
}

exports.open = function()
{
    if(exports.opened) return;
    exports.opened = true;
    
    
	stdin = process.openStdin();
    stdin.setEncoding('utf8');    
    tty.setRawMode(true);
    
    stdin.on('keypress', function(c, key)
    {
        
        //integer?
        if(!key) key = { name: c.toString() }
        
        
        
        var chain = stringRep(key);
        
        if(!exports.emit(chain))
        {
            process.stdout.write(c)
            _buffer += c;
        }
        
        if(key && key.name == 'enter')
        {
            process.stdout.write('\n');
            _buffer = '';
        }
        
        
        exports.emit('keypress', c, key);
        
        if(key.name.length == 1)
        {
            exports.emit('charpress',c);
        }
        
        
    });
}


exports.parse = function(args)
{
    args.forEach(function(arg)
    {
        self.emit(arg.replace(/:/g,'/'));
    });
}



fs.readdirSync('./modules').forEach(function(module)
{
    require('./modules/'+module).plugin(exports);
});