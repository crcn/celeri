var allFiles = _sardines.allFiles;

exports.isDirectory = function(path) {
	return !path.match(/\.\w+$/);
}

function getPath(path) {
	var parts = path.split('/'),
	cp = allFiles;

	parts.forEach(function(part) {
		cp = cp[part];
	});

	return cp;
}

exports.readdirSync = function(path) {

	var cp = getPath(path);

	if(!cp) return [];


	return Object.keys(cp);
}

exports.exists = function(file) {
	return !!getPath(file);
}


exports.realpathSync = function(path) {
	return path;
}
