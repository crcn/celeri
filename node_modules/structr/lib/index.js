var Structr = function () {

	var that = Structr.extend.apply(null, arguments);

	if (!that.structurized) {

		that = Structr.ize(that);

	}

	for (var prop in that) {

		that.__construct.prototype[prop] = that[prop];

	}


	if (!that.__construct.extend) {

		//allow for easy extending.
		that.__construct.extend = function() {
			return Structr.apply(null, [that].concat(Array.apply([], arguments)))

		};
	}

	//return the constructor
	return that.__construct;
};

/**
 * performs a deep, or light copy
 */ 

Structr.copy = function (from, to, lite) {

	if (typeof to == 'boolean') {
		lite = to;
		to = undefined;
	}
	
	if (!to) to = from instanceof Array ? [] : {};  
	
	var i;

	for (i in from) {

		var fromValue = from[i],
		toValue = to[i],
		newValue;

		//don't copy anything fancy other than objects and arrays. this could really screw classes up, such as dates.... (yuck)
		if (!lite && typeof fromValue == 'object' && (!fromValue || fromValue.constructor.prototype == Object.prototype || fromValue instanceof Array)) {

			//if the toValue exists, and the fromValue is the same data type as the TO value, then
			//merge the FROM value with the TO value, instead of replacing it
			if (toValue && fromValue instanceof toValue.constructor) {

				newValue = toValue;

			//otherwise replace it, because FROM has priority over TO
			} else {

				newValue = fromValue instanceof Array ? [] : {};

			}

			Structr.copy(fromValue, newValue);

		} else {

			newValue = fromValue;

		}

		to[i] = newValue;
	}

	return to;
};


/**
 * returns a method owned by an object
 */

Structr.getMethod = function (that, property) {
	return function() {
		return that[property].apply(that, arguments);
	};
};

/**
 * wraps a method with a "this" object
 */     
 
Structr.wrap = function (that, prop) {

	if (that._wrapped) return that;

	that._wrapped = true;

	function wrap(target) {

		return function() {

			return target.apply(that, arguments);

		};

	}

	if (prop) {

		that[prop] = wrap(target[prop]);
		return that;

	}

	for (var property in that) {

		var target = that[property];
			
		if (typeof target == 'function') {

			that[property] = wrap(target);

		}

	}

	return that;

}  

/**
 * finds all properties with modifiers
 */

Structr.findProperties = function (target, modifier) {

	var props = [],
		property;

	for (property in target) {

		var v = target[property];

		if (v && v[modifier]) {

			props.push(property);

		}

	}

	return props;

};

/**
 * counts the number of arguments in a function
 */

Structr.nArgs = function (func) { 

	var inf = func.toString().replace(/\{[\W\S]+\}/g, '').match(/\w+(?=[,\)])/g);
	return inf ? inf.length :0;

}

/**
 * returns a function by the number of arguments
 */

Structr.getFuncsByNArgs = function (that, property) {

	return that.__private['overload::' + property] || (that.__private['overload::' + property] = {});

}

/**
 */

Structr.getOverloadedMethod = function (that, property, nArgs) {

	var funcsByNArgs = Structr.getFuncsByNArgs(that, property);
	return funcsByNArgs[nArgs];

}

/**
 */

Structr.setOverloadedMethod = function (that, property, func, nArgs) {

	var funcsByNArgs = Structr.getFuncsByNArgs(that, property);
	
	if(func.overloaded) return funcsByNArgs;
	
	funcsByNArgs[nArgs || Structr.nArgs(func)] = func;
	return funcsByNArgs;

}

/**
 * mixed in operators
 */

Structr._mixin = {
	operators: {}
};


Structr.mixin = function (options) {

	switch(options.type) {
		case "operator": 
			Structr._mixin.operators[options.name] = options.factory;
		break;
		default:
			throw new Error("Mixin type " + options.type + "does not exist");
		break;
	}
}


/** 
 * modifies how properties behave in a class. Underscore is prepended because SOME properties
 * are reserved in javascript.
 */

Structr.modifiers =  {

	/**
	* overrides given method
	*/

	_override: function (that, property, newMethod) {

		var oldMethod = (that.__private && that.__private[property]) || that[property] || function (){},
			parentMethod = oldMethod;
		
		if(oldMethod.overloaded) {

			var overloadedMethod = oldMethod,
			    nArgs            = Structr.nArgs(newMethod);

			parentMethod = Structr.getOverloadedMethod(that, property, nArgs);

		}
		
		//wrap the method so we can access the parent overloaded function
		var wrappedMethod = function () {

			this._super = parentMethod;
			var ret = newMethod.apply(this, arguments);
			delete this._super;
			return ret;

		}

		wrappedMethod.parent = newMethod;
		
		if(oldMethod.overloaded) {

			return Structr.modifiers._overload(that, property, wrappedMethod, nArgs);

		}
		
		return wrappedMethod;
	},


	/**
	* getter / setter which are physical functions: e.g: test.myName(), and test.myName('craig')
	*/

	_explicit: function (that, property, gs) {

		var pprop = '__'+property;

		//if GS is not defined, then set defaults.
		if (typeof gs != 'object') {

			gs = {};

		}

		if (!gs.get) {

			gs.get = function () {

				return this._value;

			}
		}

		if (!gs.set) {

			gs.set = function (value) {

				this._value = value;

			}

		}


		return function (value) {

			//getter
			if (!arguments.length) {

				this._value = this[pprop];
				var ret     = gs.get.apply(this);

				delete this._value;
				return ret;

			//setter
			} else {

				//don't call the gs if the value isn't the same
				if (this[pprop] == value) return;

				//set the current value to the setter value
				this._value = this[pprop];

				//set
				gs.set.apply(this, [value]);

				//set the new value. this only matters if the setter set it 
				this[pprop] = this._value;

			}

		};

	},

    /**
     * implicit getter
 	 */

	_implicit: function (that, property, egs) {

		//keep the original function available so we can override it
		that.__private[property] = egs;

		that.__defineGetter__(property, egs);
		that.__defineSetter__(property, egs);

	},
	
	/**
	 */
	
	_overload: function (that, property, value, nArgs) {  

		var funcsByNArgs = Structr.setOverloadedMethod(that, property, value, nArgs);
				
		var multiFunc = function() {   

			var func = funcsByNArgs[arguments.length];
			
			if(func) {

				return funcsByNArgs[arguments.length].apply(this, arguments);

			} else {

				var expected = [];
				
				for(var sizes in funcsByNArgs) {

					expected.push(sizes);

				}
				
				throw new Error('Expected '+expected.join(',')+' parameters, got '+arguments.length+'.');
			}

		}    
		
		multiFunc.overloaded = true;                                          
		
		return multiFunc; 
	},

	/**
	 */

	_abstract: function(that, property, value) {

		var ret = function() {
			throw new Error("\"" + property + "\" is abstract and must be overridden.")
		};

		ret.isAbstract = true;

		return ret;
	}
}       


//override [bindable(event=test,name=value)] 


Structr.parseProperty = function(property) {

	var parts = property.split(" ");

	var modifiers = [],
	name      = parts.pop(),
	metadata  = [];

	for(var i = 0, n = parts.length; i < n; i++) {
		var part = parts[i];

		if(part.substr(0, 1) == "[") {
			metadata.push(Structr.parseMetadata(part));
			continue;
		};

		modifiers.push(part);
	}

	return {
		name: name,
		modifiers: modifiers,
		metadata: metadata
	}
}

Structr.parseMetadata = function(metadata) {
	var parts = metadata.match(/\[(\w+)(\((.*?)\))?\]/),
	name = String(parts[1]).toLowerCase(),
	params = parts[2] || "()",
	paramParts = params.length > 2 ? params.substr(1, params.length - 2).split(",") : [];

	var values = {};
	for(var i = paramParts.length; i--;) {
		var paramPart = paramParts[i].split("=");
		values[paramPart[0]] = paramPart[1] || true;
	}

	return {
		name: name,
		params: values
	};
}


/**
 * extends from one class to another. note: the TO object should be the parent. a copy is returned.
 */

Structr.extend = function () {
	var from = {},
	mixins = Array.prototype.slice.call(arguments, 0),
	to = mixins.pop();

	if(mixins.length > 1) {
		for(var i = 0, n = mixins.length; i < n; i++) {
			var mixin = mixins[i];
			from = Structr.extend(from, typeof mixin == "function" ? mixin.prototype : mixin);
		}
	} else {
		from = mixins.pop() || from;
	}


	//class? fetch the prototype
	if(typeof from == 'function') {


		var fromConstructor = from;

		//copy the prototype to make sure we don't modify it.
		from = Structr.copy(from.prototype);

		//next we need to convert the class into something we can handle
		from.__construct = fromConstructor;

	}



	var that = {
		__private: {

			//contains modifiers for all properties of object
			propertyModifiers: { }
		}
	};


	Structr.copy(from, that);

	var usedProperties = {},
	property;


	for(property in to) {

		var value = to[property];

		var propModifiersAr = Structr.parseProperty(property), //property is at the end of the modifiers. e.g: override bindable testProperty
		propertyName = propModifiersAr.name,

		modifierList = that.__private.propertyModifiers[propertyName] || (that.__private.propertyModifiers[propertyName] = []);

		if (propModifiersAr.modifiers.length) {

			var propModifiers = {};

			for(var i = propModifiersAr.modifiers.length; i--;) {

				var modifier = propModifiersAr.modifiers[i];

				propModifiers["_" + propModifiersAr.modifiers[i]] = 1;

				if (modifierList.indexOf(modifier) == -1) {

					modifierList.push(modifier);

				}
			}      
			
			if(propModifiers._merge) {

				value = Structr.copy(from[propertyName], value);
			}         

			//if explicit, or implicit modifiers are set, then we need an explicit modifier first
			if (propModifiers._explicit || propModifiers._implicit) {

				value = Structr.modifiers._explicit(that, propertyName, value);

			}

			for(var name in Structr._mixin.operators) {
				if(propModifiers["_" + name]) {
					value = Structr._mixin.operators[name](that, propertyName, value);

				}
			}

			if (propModifiers._override) {

				value = Structr.modifiers._override(that, propertyName, value);

			}

			if (propModifiers._abstract) {

				value = Structr.modifiers._abstract(that, propertyName, value);

			}

			if (propModifiers._implicit) {

				//getter is set, don't continue.
				Structr.modifiers._implicit(that, propertyName, value);
				continue;

			}

		}

		for(var j = modifierList.length; j--;) {

			value[modifierList[j]] = true;

		}


		
		if(usedProperties[propertyName]) {

			var oldValue = that[propertyName];
			
			//first property will NOT be overloaded, so we need to check it here
			if(!oldValue.overloaded) Structr.modifiers._overload(that, propertyName, oldValue, undefined);
			 
			value = Structr.modifiers._overload(that, propertyName, value, undefined);
		}	
		
		usedProperties[propertyName] = 1;

		that.__private[propertyName] = that[propertyName] = value;
	}

	

	//if the parent constructor exists, and the child constructor IS the parent constructor, it means
	//the PARENT constructor was defined, and the  CHILD constructor wasn't, so the parent prop was copied over. We need to create a new function, and 
	//call the parent constructor when the child is instantiated, otherwise it'll be the same class essentially (setting proto)
	if (that.__construct && from.__construct && that.__construct == from.__construct) {
		// console.log(String(from.__construct));
		// console.log(String(that.__construct));
		that.__construct = Structr.modifiers._override(that, "__construct", function() {

			this._super.apply(this, arguments);

		});

	} else 
	if(!that.__construct) {

		that.__construct = function() {};

	}


	//copy the static methods.
	for (var property in from.__construct) {

		//make sure it's static. Don't want copying the prototype over. Also make sure NOT to override any
		//static methods on the new obj
		if(from.__construct[property]['static'] && !that[property]) {

			that.__construct[property] = from.__construct[property];

		}
	}

     
	var propertyName;
	
	//apply the static props
	for (propertyName in that) {

		var value = that[propertyName];

		if(value == undefined) continue;

		//if the value is static, then tack it onto the constructor
		if (value['static']) {

			that.__construct[propertyName] = value;
			delete that[propertyName];

		} 

		if(usedProperties[propertyName]) continue;

		if(value.isAbstract) {
			value(); //will throw an error
		}

	}

	return that;
}


/**
 * really.. this isn't the greatest idea if a LOT of objects
 * are being allocated in a short perioud of time. use the closure
 * method instead. This is great for objects which are instantiated ONCE, or a couple of times :P.
 */

Structr.fh = function (that) {

	if(!that) {

		that = {};

	}

	that = Structr.extend({}, that);

	return Structr.ize(that);
}

/**
 */

Structr.ize = function(that) {

	that.structurized = true;

	//deprecated
	that.getMethod = function (property) {

		return Structr.getMethod(this, property);

	}

	that.extend = function () {

		return Structr.extend.apply(null, [this].concat(arguments));

	}

	//copy to target object
	that.copyTo = function (target, lite) {

		Structr.copy(this, target, lite);

	}   

	//wraps the objects methods so this always points to the right place
	that.wrap = function(property) {

		return Structr.wrap(this, property);

	}

	return that;
}
                 
/**
 */

module.exports = Structr;

