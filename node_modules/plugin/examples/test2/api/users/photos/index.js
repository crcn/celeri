exports.name = 'api.users.photos';
exports.require = 'api.users';

exports.plugin = function() {

	var haba = this;

	return {
		init: function() {
			haba.plugin("api.users").getUser(function(user) {
				console.log(user);
			})
		}
	}
}