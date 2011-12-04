exports.plugin = function(cli) {

	return {
		init: function() {
		    cli.onCommand('ctrl-c', function() {
		        process.exit();
		    });
		}
	}
}