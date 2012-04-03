exports.name = 'api.users';

exports.plugin = function() {
	return {
		getUser: function(callback) {
			callback({ name: 'craig', pass: 'password' });
		}
	}
}