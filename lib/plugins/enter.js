exports.require = ["command.route"];
exports.plugin = function(commandRoute, cli) {


    cli.run = function(buffer) {
        /*commands = buffer.split('&&');
        
        commands.forEach(function(command) {
            
            var args = command.match(/((["'])([^\\](?!\2)|\\.|\w)+\2|[^\s"']+)/ig);
            
            
            if(!args) return;
            
            for(var i = args.length; i--;) {
                args[i] = encodeURIComponent(args[i]);
            }
            
            
            function emit(operation) {
                if(!cli.emit(args.join(cli.delimiter())))
                {
                    //console.log('illegal operation: "%s"'.red, operation);
                    //cli.emit('help');
                }
            }
            
            setTimeout(emit, 1, args.join(cli.delimiter()));
        });*/
        
    } 
    
    cli.onCommand('enter', function() {
                
        var failed = false;

        var commands = cli.buffer().replace(cli.inputPrefix(),'').split(';'),
        running = commands.length;

        commands.forEach(function(command) {
            process.nextTick(function() {  
                cli.emit(command, null, function(success) {
                    failed = !success || failed;

                    if(!(--running) && failed) {
                        process.nextTick(cli.help);
                    }
                })
            })
        });

    });
    
}