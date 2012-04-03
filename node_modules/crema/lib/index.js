

function parseTokens(route) {
	return route./*route.replace(/\//g,' ').*/replace(/\s+/g,' ').split(' ');
}

function splitOr(tokens, route, routes, start) {

	for(var i = start, n = tokens.length; i < n; i++) {
		var token = tokens[i];

		if(token.toLowerCase() == 'or') {
			var orRoute = route.concat();

			orRoute.pop();

			//skip one token
			orRoute.push(tokens[++i]);

			splitOr(tokens, orRoute, routes, i + 1);

			//this chunk of code will execute if we get a chain of OR statements such as:
			//-method=GET OR -method=POST OR -method=PUT. In which case, we need to skip them.     
			while(i < n - 1 && tokens[i + 1].toLowerCase() == 'or') {
				i += 2;
			}
		} else {
			route.push(token);
		}
	}


	routes.push(route);

	return routes;
}


function parsePath(path) {

	var segments = path instanceof Array ? path : path.replace(/^\/|\/$/g,'').split(/[\s\/]+/g);

	var expr = { value: segments.join('/'), segments: [] };

	for(var i = 0, n = segments.length; i < n; i++) {
		var segment = segments[i],
		isParam = (segment.substr(0,1) == ':');

		expr.segments.push({ value: isParam ? segment.substr(1) : segment, param: isParam });
	}

	return expr;
}

function parseRoutePaths(rootExpr, tokens, start) {

	var n = tokens.length,
	currentExpression = rootExpr;
	currentExpression.path = parsePath(tokens[n - 1]);


	// console.log(start)
	for(var i = n - 2; i >= start; i--) {
		  
		var token = tokens[i], buffer = [];


		if(token == '->') continue;

		//middleware flag - skip  
		

		currentExpression = currentExpression.thru = { path: parsePath(token) };
	}


	return rootExpr;
}

function fixRoute(route, grammar) {
	
	for(var expr in grammar) {
		route = route.replace(grammar[expr], expr);
	}

	return route;
}


function parseRoute(route, grammar) {

	if(grammar) {
		route = fixRoute(route, grammar);
	}

	var tokens = parseTokens(route),
	routes = splitOr(tokens, [], [], 0),
	currentRoute,
	expressions = [];


	for(var i = 0, n = routes.length; i < n; i++) {
		
		var routeTokens = routes[i],
		expr = { tags: {} },
		start = 0;
		
		if(routeTokens[0].match(/^\w+$/) && routeTokens[1] != '->' && routeTokens.length-1)
		{
			start = 1;
			expr.type = routeTokens[0];
		}

		for(var j = start, jn = routeTokens.length; j < jn; j++) {
			
			var routeToken = routeTokens[j];

			//is it a tag?
			if(routeToken.substr(0, 1) == '-') {
				
				var tagParts = routeToken.split('=');

				var tagName = tagParts[0].substr(1);//remove the dash
				
				expr.tags[tagName] = tagParts.length > 1 ? tagParts[1] : true;

				//continue until there are no more tags
				continue;
			} 

			expressions.push(parseRoutePaths(expr, routeTokens, j));
			break;
		}
	}


	return expressions;
}




module.exports = function(source, grammar) {
	return parseRoute(source, grammar);
}


module.exports.grammar = function(grammar) {
	
	return {
		fixRoute: function(source) {
			return fixRoute(source, grammar);
		},
		parse: function(source) {
			return parseRoute(source, grammar);
		}
	}
}


module.exports.parsePath = parsePath;

module.exports.stringifySegments = function(segments, params, ignoreParams) {
	var stringified = [];
	if(!params) params = {};

	for(var i = 0, n = segments.length; i < n; i++) {

		var segment = segments[i], segmentValue;

		if(!ignoreParams && segment.param) {
			segmentValue = params[segment.value] || ':' + segment.value;
		} else {
			segmentValue = segment.value;
		}

		stringified.push(segmentValue);

	}

	return stringified.join('/');
}


module.exports.stringifyTags = function(tags) {
	var stringified = [];

	for(var tagName in tags) {
		var tagValue = tags[tagName];

		if(tagValue === true) {
			stringified.push('-' + tagName);
		} else {
			stringified.push('-' + tagName+'='+tagValue);
		}
	}

	return stringified.join(' ');
}



module.exports.stringify = function(route) {
	
	var stringified = [];
	
	if(route.type) stringified.push(route.type);

	stringified.push(module.exports.stringifyTags(route.tags));
	stringified.push(module.exports.stringifySegments(route.path.segments));
	
	return stringified.join(' ');
}