utils = require('../utils');

//see http://en.wikipedia.org/wiki/Box-drawing_characters
exports.plugin = function(cli)
{      
	
	//┌──   
	//├──
	//└──
	             
	
	var branch = utils.repeat('─',1),
	tabs = utils.repeat(' ',branch.length+2);     
	                              
	                                          
	  
	cli.drawTree = cli.tree = function(tree, ops, tab)
	{   
		if(!ops) ops = {};
		                         
		
		if(!tab) tab = '';                
		
		var n = utils.objectSize(tree),
		i = 0,
		printedBreak = false;                 
		                                   
		
		for(var index in tree)
		{                                                                                               
			
			var childrenOrValue = tree[index],
			toc = typeof childrenOrValue,
			toi = typeof index, 
			edge = i < n-1 ? '├' : '└';          
			                                                             
			                            
			var value = !isNaN(Number(index)) ?  childrenOrValue : index + ': ' + childrenOrValue; 
			
			                    
			                                                                                                            
			console.log('%s%s%s %s', tab, edge, branch, toc == 'string' ? value: index); 
			                  
			
			if(toc == 'object')
			{                         
				printedBreak = cli.drawTree(childrenOrValue, ops, n > 1 && i < n-1 ? tab + '|' + tabs.substr(1) : tab + tabs);    
			}
			/*else
			if(toc == 'string' || toc == 'number')
			{                                   
				
			}*/ 
			
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