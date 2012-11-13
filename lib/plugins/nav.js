exports.require = ["command.route"];
exports.plugin = function(commandRoute, cli) {

	cli.onCommand('left', function() {
        cli.cursor(cli.cursor() - 1);
    });
    
    cli.onCommand('right', function() {
        cli.cursor(cli.cursor() + 1);
    });	

    cli.onCommand('ctrl-a', function() {
        cli.cursor(cli.inputPrefix().length);
    });

    cli.onCommand('ctrl-e', function() {
        cli.cursor(cli.buffer().length);
    });
    
}