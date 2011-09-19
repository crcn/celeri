exports.plugin = function(cli)
{
    
    cli.on('enter', function()
    {        
        var buffer = cli.buffer(),
        commands = buffer.split('&&');
        
        commands.forEach(function(command)
        {
            var args = command.match(/((["'])([^\\](?!\2)|\\.|\w)+\2|[^\s"']+)/ig);
        
            
            if(!args) return;
            
            for(var i = args.length; i--;)
            {
                args[i] = encodeURIComponent(args[i]);
            }
            
            
            function emit(operation)
            {
                if(!cli.emit(args.join(' ')))
                {
                    //console.log('illegal operation: "%s"'.red, operation);
                    //cli.emit('help');
                }
            }
            
            setTimeout(emit, 1, args.join(' '));
        });
        
        
    });
}