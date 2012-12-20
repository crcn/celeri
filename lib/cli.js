var structr = require("structr");

/**
 * finer control over any given CLI interface
 */

var CLI = module.exports = structr({

	/**
	 */

	"__construct": function(ops) {

		//the target to control - process.stdout? custom?
		this._target = ops.target;

		//the max number of lines to buffer 
		this._maxLines = ops.maxLines || 300;

		// this._lines = [];
		this._buffer = "";

	},

	/**
	 * writes to the stdout
	 */

	"write": function(buffer) {

	},

	/**
	 */

	"replaceLine": function(buffer) {
		this.clearLine();
		this.write(buffer);
	},

	/**
	 * clear char count
	 */

	"clearChars": function(count) {
		var sum = 0;
		for(var i = this._lines.length; i--;) {
			sum += this._lines[i].length;
			if(sum >= count) {

			}
		}
	},

	/**
	 */

	"replaceChars": function(buffer, count) {

	},

	/**
	 */

	"clearLine": function(count) {
		if(!count) count = 1;
		for(var i = count; i--;) {
			this._lines.pop();
			this._target.clearLine();
		}
	}


})


module.exports.open = function(ops) {
	return new CLI(ops);
}