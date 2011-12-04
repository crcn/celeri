exports.plugin = function(cli) {


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
    
    return {
        init: function() {
            cli.onCommand('enter', function() {
                
                var failed = false;

                cli.buffer().replace(cli.inputPrefix(),'').split(';').forEach(function(command) {
                    failed = !cli.emit(command) || failed;
                });

                if(failed) cli.help();

            });
        }   
    }
    
}