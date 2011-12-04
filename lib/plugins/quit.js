exports.plugin = function(cli) {

	return {
		init: function() {
		    cli.on('ctrl-c', function() {
		        process.exit();
		    });
		}
	}
}