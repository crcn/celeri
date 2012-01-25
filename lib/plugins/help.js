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

    var help = {}, used = {}, usage = '';


    cli.addHelp = function(ops) {

        if(used[ops.command]) return;
        used[ops.command] = 1;

        var category = ops.category || 'options';

        if(!help[category]) help[category] = [];

        ops.command = ops.command.replace(/\:(\w+)/g,'[$1]').replace(/OR/g,'OR'.green)
        
        help[category].push(ops);
    }

    cli.usage = function(description) {
        usage = description;
        return cli;   
    }

    cli.help = function() {

        if(usage) console.log('usage: %s', description);

        for(var category in help) {

            console.log("\n%s:".bold, category);

            cli.table(help[category], { columns: {
                command: 70,
                desc: 50
            }, pad: { left: 3 } });   
        }

        console.log('\n');
        
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