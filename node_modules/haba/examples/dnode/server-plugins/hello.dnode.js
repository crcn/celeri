
exports.plugin = function() {
	
	return {
		sayHello: function(callback) {
			callback('Hello DNode!');	
		}
	};
}