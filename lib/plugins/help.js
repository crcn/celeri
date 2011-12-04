var fs = require('fs');

exports.plugin = function(cli) {
    //cli.help = function(){};
    
    
    /*cli.openHelp = function(filePath, prefix) {
        if(!prefix) prefix = '';
        
        var helpTxt = fs.readFileSync(filePath,'utf8'), coloredText;
			
        
        //colored text
        while(coloredText = helpTxt.match(/<(.*?)>([\w\W]*?)<\/\1>/)) {
            var colorAttrs = coloredText[1].split(' '),
                text = coloredText[2];
                
            colorAttrs.forEach(function (attr) {
                text = text[attr];
            });
                
            helpTxt = helpTxt.replace(coloredText[0],text);
        }
        
        
        console.log(helpTxt);
    }*/

    var help = [];


    cli.addHelp = function(ops) {
        help.push(ops);
    }

    cli.help = function() {
        console.log("\nAvailable Methods:".bold)
        cli.table(help, { columns: ['command','desc'], pad: { left: 5 } });
    }

    return {
        init: function() {
            cli.onCommand({ command: 'help', desc: ' ' }, cli.help);
        }
    }
    /*cli.on('help', function()
    {
        cli.help();
    });*/
}