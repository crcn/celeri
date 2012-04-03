var AbstractRecipe = Structr({

    /**
     */
     
    '__construct': function()
    {
        this._name = name;
    },
    
    
    /**
     * CANNOT be overridden
     */
     
    'final name': function()
    {
        return this._name;
    },
    
    /**
     * MUST be overridden
     */
    
    'abstract cook': function(){}
    
});


var TiramisuRecipe = AbstractRecipe.extend({

    /**
     */
     
    'override cook': function()
    {
        alert('Cooking Tiramisu');
    }
});


var tr = new TiramisuRecipe();
tr.cook();