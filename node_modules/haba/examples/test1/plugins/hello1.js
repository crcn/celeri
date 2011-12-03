exports.require = {
	hello2: 'hello2'
};

exports.plugin = function(ops, params) {
	console.log(ops);
	console.log(params);
	return {
		init: function() {
			this.require.hello2.plugin.sayHello();
		}
	};
}