exports.plugin = function() {
	this.loaders.push({
		test: function(path) { 
			return !!path.match(/beanpoll\+\w+:\/\//);
		},
		load: function(path, callback) {
			callback(new Error('not implemented'));
		}
	})
}