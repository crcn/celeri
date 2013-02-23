var Structr = require("../");

var OverloadedClass = Structr({      
	'constructor': function(name)
	{
		this._name = name;     
	},  
	'1 getName': function(name, callback)
	{                       
		this._name = name;    
		this.getName(callback);
	},
	'2 getName': function(callback)
	{                               
		callback(this.getName());
	},
	'3 getName': function()
	{                              
		return this._name;
	}
	
}); 

var OverloadedSubClass = OverloadedClass.extend({      
	'override getName': function(name, callback)
	{                                                            
		this._super('"'+name+' the great"', callback);
	},    
	'override 1 getName': function()
	{
		return 'This is awesome '+ this._super()+'. ';
	}
});

var OverloadedSubSubClass = OverloadedSubClass.extend({
	'override getName': function()
	{
		return this._super() + ' NOT!';
	}
});

                            

       
                                      

var test1 = new OverloadedClass('Craig')       
test1.getName('jake', function(name)
{
	console.log(name)
});

console.log(test1.getName());

var test2 = new OverloadedSubClass('Craig')       
test2.getName('john', function(name)
{
	console.log(name)
});

var test3 = new OverloadedSubSubClass('Craig')       
test3.getName('jake', function(name)
{
	console.log(name)
});  

try
{
	//test with undefined param
	test3.getName('test', undefined);   
}catch(e)
{
	console.log('overloading with undefined set works!')
}
                          