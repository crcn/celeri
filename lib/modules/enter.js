exports.plugin = function(cli)
{
    
    cli.on('enter', function()
    {        
        var args = cli.buffer().match(/((["'])([^\\](?!\2)|\\.|\w)+\2|[^\s"']+)/ig);
        
        
        for(var i = args.length; i--;)
        {
            args[i] = encodeURIComponent(args[i]);
        }
        
        setTimeout(cli.emit,1, args.join(' '));
        
    });
}