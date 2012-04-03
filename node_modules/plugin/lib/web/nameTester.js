module.exports = function(search) {

	if(!search) {
		return function() { return true; }	
	}

	var tos = typeof search, reg, test;

	if(tos == 'string') {
		reg = new RegExp('^' + search + '$');
	} else 
	if(!(search instanceof RegExp)) {
		reg = search;
	} else {
		reg = search;
	}

	if(reg instanceof RegExp) {
		test = function(name) {
			return !!name.match(reg);
		}
	} else {
		test = reg;
	}

	return test;
}