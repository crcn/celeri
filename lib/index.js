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
    return type.replace(/\s+/g,' ').replace(/\s/g,'\/');
}
 

exports.on = function(type, callback)
{

    if(typeof type == 'object')
    {
        var disposables = [];
        
        if(type instanceof Array)
        {
            for(var i = type.length; i--;)
            {
                disposables.push(exports.on(type[i], callback));
            }
        }
        else
        {
            for(var t in type)
            { 
                
                disposables.push(exports.on(t, type[t]));
            }
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
        
    return router.on('push /'+_toRoute(type), callback);
    
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
        //console.log(e.stack);
    }   
    
    return false;

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

exports.newLine = function(buffer)
{
    if(buffer) exports.write(buffer);
    exports.write('\n');
    exports.buffer('');
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
        
        
        var chain = stringRep(key),
        emitSuccess = exports.emit(chain); 
        
        if(!emitSuccess && c)
        {
            process.stdout.write(c.magenta)
            _buffer += c;
        }
        
        
        if(key && key.name == 'enter')
        {
            process.stdout.write('\n');
            _buffer = '';
            
            
        }
        
        exports.emit('keypress', { char: c, key: key });
        
        if(key.name.length == 1)
        {
            exports.emit('charpress', c);
        }
        
        
        
        
    });
}


exports.parse = function(args)
{
    var self = this;
    
    args.forEach(function(arg)
    {  
        var argParts = arg.split(':');
        
        for(var i = argParts.length; i--;)
        {
            argParts[i] = encodeURIComponent(argParts[i]);
        }
        self.emit(argParts.join('/'));
    });
}



fs.readdirSync( __dirname + '/modules').forEach(function(module)
{
    require( __dirname + '/modules/'+module).plugin(exports);
});