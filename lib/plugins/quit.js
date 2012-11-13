exports.require = ["command.route"];
exports.plugin = function(commandRoute, cli) {
	
	cli.onCommand('ctrl-c', function() {
        process.exit();
    });
}