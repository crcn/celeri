exports.plugin = function(cli)
{
    
    
    cli.on('backspace', function()
    {
        cli.replaceLine(cli.buffer().substr(0,cli.buffer().length-1));
    });
}