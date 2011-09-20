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

//exports.colorful = true;

exports.utils = require('./utils');
 
exports.size = function()
{
    return tty.getWindowSize();
}

exports.columns = function()
{
    return exports.size()[1];
}

exports.rows = function()
{
    return exports.size()[0];
}

var _inputPrefix = '> ';

exports.inputPrefix = function(prefix)
{
    if(!arguments.length) return _inputPrefix;
    
    
    return _inputPrefix = prefix || '';
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


exports.buffer = function(value, ignoreReplace)
{
    if(!arguments.length) return _buffer;
    
    _buffer = value;
    
    return !ignoreReplace ? exports.replaceLine(value) : value;
}

exports.replaceLine = function(buffer, cursorTo)
{
    process.stdout.clearLine();
    exports.cursor(0);
    process.stdout.write(buffer);
    exports.cursor(cursorTo != undefined ? cursorTo : buffer.length);
    _buffer = buffer;
    return buffer;
}


//inserts text into the current line
exports.insertText = function(str, position)
{
    var buffer = exports.buffer();
    exports.replaceLine(buffer.substr(0, position) + str + buffer.substr(position), position + str.length);
} 


//splices a part of the line
exports.spliceLine = function(position, length, newCursor)
{
    
    var buffer = exports.buffer();
    exports.replaceLine(buffer.substr(0, position) + buffer.substr(position + length), newCursor);
}

var _cursorPosition = 0;

exports.cursor = function(position)
{
   if(!arguments.length) return _cursorPosition;
   
   
   process.stdout.cursorTo(position);
   
   return _cursorPosition = position;
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

exports.open = function(ops)
{
    if(ops)
    {
        if(ops.prefix) exports.inputPrefix(ops.prefix);
    }
    
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
        
        
        //not a handled item to boot? Probably enter, delete, left, right, up, etc. Append it.
        if(!emitSuccess && c)
        {
            if(!_buffer.length)
            {
                exports.insertText(exports.inputPrefix(), _cursorPosition);
            }
            
            exports.insertText(c, _cursorPosition);
        }
        
        
        //new line? reset
        if(key && key.name == 'enter')
        {
            //exports.replaceLine(exports.buffer().magenta);
            process.stdout.write('\n');
            _buffer = '';
            _cursorPosition = 0;
            //exports.insertText(exports.inputPrefix(), _cursorPosition);
        }
        
        
        //for custom handlers: password, confirm, etc.
        exports.emit('keypress', { char: c, key: key });
        
        //character code? 
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