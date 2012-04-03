module.exports = require('fs');


module.exports.isDirectory = function(fullPath) {
	return module.exports.statSync(fullPath).isDirectory();
}

module.exports.exists = function(fullPath) {
	try {
		module.exports.lstatSync(fullPath);
		return true;
	} catch(e) {
		return false;
	}
}