exports.plugin = function(cli) {

	return {
		init: function() {
			cli.on('left', function() {
		        cli.cursor(cli.cursor() - 1);
		    });
		    
		    cli.on('right', function() {
		        cli.cursor(cli.cursor() + 1);
		    });	

		    cli.on('ctrl-a', function() {
		        cli.cursor(cli.inputPrefix().length);
		    })

		    cli.on('ctrl-e', function() {
		        cli.cursor(cli.buffer().length);
		    })
		}
	}
    
}