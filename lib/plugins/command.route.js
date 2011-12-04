var beanpole = require('beanpole');

exports.plugin = function(router) {
	
	var router = beanpole.router();

	return {
		testListener: function(type) {
			return type.indexOf('.') == -1;
		}, 
		addListener: function(cmd, callback) {
			router.on('push ' + cmd.path, callback);

			return { useParams: false };
		},
		run: function(type, data) {
			return router.push(type.replace(/\s+/g,'/'), data, { meta: { passive: 1 }});
		}
	}
}