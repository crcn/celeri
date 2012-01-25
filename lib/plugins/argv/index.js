exports.plugin = function(cli) {
	
	cli.option = function(command, description, callback) {

		cli.addHelp({ command: command, desc: description });

		cli.onCommand(command, callback);

		return cli;
	}
}