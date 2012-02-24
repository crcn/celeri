var fs = require('fs');

function capitalizeFirst(str) {
    return str.substr(0,1).toUpperCase() + str.substr(1);
}

var helpMenu = function(cli) {

    var usage, 
    desc, 
    items = {}, 
    used = {}, 
    children = {};
    

    var self = {

        /**
         */

        description: function(value) {
            
            desc = value;
              
        },

        /**
         */

        usage: function(value) {

            usage = value;

        },
            
        /**
         * adds a help item
         */

        add: function(category, name, desc) {

            if(used[name]) return;
            used[name]= 1;

            if(!items[category]) items[category] = [];
            
           items[category].push({
               name: name,
               desc: desc
           });


        },

        /**
         */

        child: function(name) {
            return children[name] || (children[name] = helpMenu(cli));
        },

        /**
         */

        print: function() {

            //line break
            console.log();

            if(desc) {
                console.log('%s\n'.bold, desc);
            }
            
            if(usage) console.log('%s: %s\n', 'Usage'.bold, usage);

            for(var category in items) {
                
                console.log('%s:'.bold, capitalizeFirst(category));

                var ops = {
                    columns: {
                        name: 16,
                        desc: 70
                    },
                    pad: {
                        left: 2
                    }
                };



                cli.table(items[category], ops);  
                console.log();  
            }
        }
    };

    return self;
}




exports.plugin = function(cli) {

    var help = helpMenu(cli);


    cli.addHelp = function(ops) {


        //fix the usage so it's turned from command :op to command [op]
        if(ops.usage)
        ops.usage = ops.usage.
        replace(/\:(\w+)/g,'[$1]').
        replace(/OR/g,'OR'.bold);

        help.add(ops.category || 'options', ops.name, ops.description || ops.desc);

        //set the usage for the child help item
        var childHelp = help.child(ops.name);

        childHelp.usage(ops.usage);
        childHelp.description(ops.description);

        for(var op in ops.optional) {
            
            childHelp.add('Optional Flags', op, ops.optional[op])
            
        }
        
        return cli;
    }

    cli.usage = help.usage;


    help.usage('[command] --arg=value --arg2')


    cli.help = function() {

        help.print();
        
    }

    cli.commandHelp = function(data, next) {


        //intercept commands that are :command help
        if(this.path.segments.length > 1 && this.path.segments[1].value == 'help') {
            
            help.child(this.path.segments[0].value).print();

            return;
        }

        next();
    }

    return {
        init: function() {
            
            cli.option('help', cli.help).
            option(':command help OR **', cli.commandHelp);

            cli.addHelp({
                category: 'help',
                name: '[cmd] help',
                description: 'Show command help menu'
            });

            cli.addHelp({
                category: 'help',
                name: 'help',
                description: 'Show help menu'
            });


        }
    }
    /*cli.on('help', function()
    {
        cli.help();
    });*/
}