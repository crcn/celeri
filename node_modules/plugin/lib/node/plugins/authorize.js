exports.plugin = function() {
	var haba = this,
	credits = {};

	haba.authorize = function(user, pass) {
		return !credits || (credits.user == user && credits.pass == pass);
	}

	haba.credentials = function(user, pass) {
		if(!arguments.length) return credits;

		if(typeof user == 'object') {
			credits = user;
		} else {
			credits = { user: user, pass: pass };
		}

		return this;
	}
}