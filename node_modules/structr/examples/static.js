var MySingleton = Structr({
	'static getInstance': function()
	{
		return this._instance || (this._instance = new MySingleton());
	}
})                                                                    


var test1 = MySingleton.getInstance();
test2 = MySingleton.getInstance();

test1.name = 'Hello World!';               

console.log(test2.name);