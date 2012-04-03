exports.plugin = function() {
	this.loaders.push({
		test: function(path) { 
			return !!path.match(/hookio\+\w+:\/\//);
		},
		load: function(path, callback) {
			callback(new Error('not implemented'));
		}
	})
}