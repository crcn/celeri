exports.require = 'hello.dnode';

exports.plugin = function(ops, params) {

	var haba = this;

	return {
		init: function() {
			haba.plugin('hello.dnode').sayHello(function(response) {
				console.log(response)
			});
		}
	}
}