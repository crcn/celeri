var Structr = require('structr');

exports.plugin = function(cli) {
	
	var target = {};

	
	return {
		testListener: function(type) {
			return type.indexOf('.') > -1;
		}, 
		addListener: function(cmd, callback) {

			var current = target, paths = cmd.path.split('.'), path;
			
			for(var i = 0, n = paths.length-1; i < n; i++) {
				path = paths[i];
				if(!current[path]) current[path] = {};
				current = current[path];
			} 


			current[paths[i]] = cmd.func;


			return { useParams: true };
		},
		run: function(buffer) {

			process.nextTick(function() {
				try {
					var ret = eval("with(target) " + buffer);

					if(ret != undefined) console.log(ret)
				} catch(e) {
					console.log('Unable to call %s \n%s', buffer.bold, e.message.red.bold);


					console.log('\nAvailable Methods:'.bold)
					cli.help();
				}
			});
		}
	}
}