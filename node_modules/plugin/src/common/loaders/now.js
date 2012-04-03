// var now = require('now');

exports.plugin = function() {

	var haba = this;

	this.loaders.push({
		test: function(path) { 
			return !!path.match(/now\+\w+:\/\//);
		},
		load: function(path, callback) {
			callback(new Error('not implemented'));
		}
	});

}