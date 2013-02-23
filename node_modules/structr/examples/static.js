var structr = require("../");

var MySingleton = structr({
	'static getInstance': function()
	{
		return this._instance || (this._instance = new MySingleton());
	},
	"implicit FOO": {
		"set": function(value) {
			console.log("G")
			throw new Error("cannot override constant");
		},
		"get": function() {
			return "BAR"
		}
	}
})                                                                    


var test1 = MySingleton.getInstance();
test2 = MySingleton.getInstance();
console.log(test2.__private)
test1.FOO = "BLARG"
console.log(test1);

test1.name = 'Hello World!';               

console.log(test2.name);