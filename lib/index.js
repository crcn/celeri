var tty = require('tty'),
fs = require('fs'),
_buffer = '',
haba = require('plugin').loader();
require("colors")

exports.utils = require('./utils');

var queue = require('tq').queue().start();

exports.queue = queue.fn;

var _inputPrefix = '> ';
 
/**
 * queued commands
 */

exports.next = function(callback) {   
	exports.queue(callback);
	
	return this;
}


/**
 * size of the terminal window
 */
  
exports.size = function() {
    return tty.getWindowSize();
}

/**
 * number of columns in the terminal window (characters / width)
 */
 
exports.columns = function() {
    return exports.size()[1] || exports.size();
}

/**
 * number of rows in the terminal window
 */

exports.rows = function() {
    return exports.size()[0];
}

/**
 */

exports.inputPrefix = function(prefix) {
    if(!arguments.length) return _inputPrefix;
    
    
    return _inputPrefix = prefix || '';
}

/**
 */

exports.buffer = function(value, ignoreReplace) {
    if(!arguments.length) return _buffer;
    
    _buffer = value;
    
    return !ignoreReplace ? exports.replaceLine(value) : value;
}

/**
 * Replaces the current line in the terminal window
 */
 
exports.replaceLine = function(buffer, cursorTo) {

    //need to clear the line before replacing it
    process.stdout.clearLine();
    
    //set the cursor to zero, otherwise we'll have padding we don't want
    exports.cursor(0);
    
    //write the buffer
    process.stdout.write(buffer);
    
    //set the cursor to the new position!
    exports.cursor(cursorTo != undefined ? cursorTo : buffer.length);
    
    return _buffer = buffer;
}


/**
 * inserts text into the current line
 */
 
exports.insertText = function(str, position) {
    var buffer = exports.buffer();
    exports.replaceLine(buffer.substr(0, position) + str + buffer.substr(position), position + str.length);
} 


/**
 * Takes a chunk of text out of the current line
 */
 
exports.spliceLine = function(position, length, newCursor) {
    
    var buffer = exports.buffer();
    exports.replaceLine(buffer.substr(0, position) + buffer.substr(position + length), newCursor);
}

var _cursorPosition = 0;


/**
 */
 
exports.cursor = function(position) {
   if(!arguments.length) return _cursorPosition;
   
   
   process.stdout.cursorTo(position);
   
   return _cursorPosition = position;
}



function stringRep(key) {
    var chain = '';
    
    for(var prop in key) {
        if(!key[prop]) continue;
        
        if(key[prop] == true) {
            chain = prop+'-'+chain;
        } else {
            chain += key.name;
        }
    }
        
    return chain;
}

exports.write = function(string) {
    process.stdout.write(string);
}

exports.newLine = function(buffer) {
    if(buffer) exports.write(buffer);
    exports.write('\n');
    exports.buffer('');
}

exports.open = function(ops) {
    if(ops) {
        if(ops.prefix) exports.inputPrefix(ops.prefix);
    }
    
    if(exports.opened) return;
    exports.opened = true;
    
    
	stdin = process.openStdin();
    stdin.setEncoding('utf8');    
    tty.setRawMode(true);
    
    
    
    stdin.on('keypress', function(c, key) {
        
        //integer?
        if(!key) key = { name: c.toString() }
        
        var chain = stringRep(key);

        var emitSuccess = chain.length > 1 ? exports.emit(chain) : false; 

        
        //not a handled item to boot? Probably enter, delete, left, right, up, etc. Append it.
        if(!emitSuccess && c) {
            if(!_buffer.length) {
                exports.insertText(exports.inputPrefix(), _cursorPosition);
            }
            exports.insertText(c, _cursorPosition);
            //exports.insertText(c, Math.max(_cursorPosition, exports.inputPrefix().length));
        }
        
        
        //new line? reset
        if(key && key.name == 'enter') {
            //exports.replaceLine(exports.buffer().magenta);
            process.stdout.write('\n');
            _buffer = '';
            _cursorPosition = 0;
            //exports.insertText(exports.inputPrefix(), _cursorPosition);
            //exports.cursor(0);
        }
        
        
        //for custom handlers: password, confirm, etc.
        exports.emit('keypress', { char: c, key: key });

        //character code? 
        if(key.name.length == 1) {
            exports.emit('charpress', c);
        }
        
        
    });
}


exports.parse = function(args, callback) {

    args = args.concat().splice(2);
    
    var self = this;
    var command = [],
    data = {};



    while(args.length) {
        var arg = args.shift();

        if(arg.substr(0,2) != '--') {
            command.push(arg);
        } else {
            args.unshift(arg);
            break;
        }
    }

    while(args.length) {
        var arg = args.shift();

        if(arg.substr(0,2) == '--') {
            var argParts = arg.substr(2).split('=');
            data[argParts[0]] = argParts[1] || true;
        }
    }

    var cmd = { command: command, data: data };


    haba.next(function() {
        

        if(!self.emit(command, data)) {
            if(command.join('').length) {
                var err = new Error('command "'+command.join(' ')+'" does not exist')
                
                if(callback) return callback(err, cmd);

                console.error(err.message);
            }
            self.emit('help');
            return;
        }  

        this();
        if(callback) callback(null, cmd);
    });

    return cmd;
}


haba.options(exports, true).require(__dirname + '/plugins').init();


