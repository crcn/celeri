utils = require('../utils');

//see http://en.wikipedia.org/wiki/Box-drawing_characters
exports.plugin = function(cli)
{      
	
	//┌──   
	//├──
	//└──
	             
	
	var branch = utils.repeat('─',1),
	tabs = utils.repeat(' ',branch.length+2);     
	                              
	                                          
	  
	cli.drawTree = cli.tree = function(tree, tab)
	{               
		if(!tab) tab = '';                
		
		var n = utils.objectSize(tree),
		i = 0,
		printedBreak = false;                 
		                                   
		
		for(var index in tree)
		{                                                                                               
			
			var childrenOrLabel = tree[index],
			toc = typeof childrenOrLabel, 
			edge = i < n-1 ? '├' : '└';       
			                                                                                                            
			console.log('%s%s%s %s', tab, edge, branch, toc == 'string' ? childrenOrLabel : index); 
			                  
			
			if(toc == 'object')
			{                         
				printedBreak = cli.drawTree(childrenOrLabel, n > 1 && i < n-1 ? tab + '|' + tabs.substr(1) : tab + tabs);    
			} 
			
			 i++;
		}
		         
		
		//add extra breaks for folders - a little more readable
		if(!printedBreak)
		{
			console.log('%s',tab);
			printedBreak = true;
		}
		
		return printedBreak;                          
	}
}