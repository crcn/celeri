exports.name = 'hooks';

exports.plugin = function() {

	var haba = this;

	return {
		hooks: function() {

			var plugins = haba.plugins(),
			hooks = {};

			for(var name in plugins) {
				var hook = hooks[name] = [],
				plugin = plugins[name].instance;

				for(var method in plugin) {
					hook.push(method);
				}
			}
			return hooks;
		}
	}
};