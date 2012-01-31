exports.require = 'help'


exports.plugin = function(cli) {
	
	cli.option = function(command, description, callback) {


		var ops = { command: command,
		description: description, 
		callback: callback };

		if(typeof command == 'object') {
			ops = command;	
		}

		if(typeof description == 'function') {
			ops.description = undefined;
			ops.callback = description;
		}

		if(typeof callback == 'function') {
			ops.callback = callback;
		}



		var mainCmd = cli.parseCommand(command).shift();


		ops.name = mainCmd.channel.paths[0].value;
		ops.usage = ops.usage || ops.command;

		if(ops.description) cli.addHelp(ops);

		cli.onCommand(ops.command, ops.callback);

		return cli;
	}
}