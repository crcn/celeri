exports.plugin = function(cli)
{
    cli.on('ctrl-C', function()
    {
        process.exit();
    });
}