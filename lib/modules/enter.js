exports.plugin = function(cli)
{
    
    cli.on('enter', function()
    {        
        var args = cli.buffer().match(/((["'])([^\\](?!\2)|\\.|\w)+\2|[^\s"']+)/ig);
        
        setTimeout(cli.emit,1, args.join(' '));
        
    });
}