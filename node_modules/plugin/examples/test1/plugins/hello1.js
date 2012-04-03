exports.require = {
	hello2: 'hello2'
};

exports.plugin = function(ops, params) {
	console.log(ops);
	console.log(params);

	var haba = this;

	return {
		init: function() {
			haba.plugin('hello2').sayHello();
		}
	};
}