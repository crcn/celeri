var fs = require('fs');

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
            
            if(usage) console.log('usage: %s', usage);

            for(var category in items) {
                
                console.log('%s:'.bold, category.substr(0, 1).toUpperCase() + category.substr(1));

                var ops = {
                    columns: {
                        name: 10,
                        desc: 70
                    },
                    pad: {
                        left: 3
                    }
                };



                cli.table(items[category], ops);  
            }

            //line break
            console.log();
        }
    };

    return self;
}




exports.plugin = function(cli) {

    var help = helpMenu(cli);


    cli.addHelp = function(ops) {


        //fix the usage so it's turned from command :op to command [op]
        ops.usage = ops.usage.
        replace(/\:(\w+)/g,'[$1]').
        replace(/OR/g,'OR'.bold);

        help.add(ops.category || 'options', ops.name, ops.description);

        //set the usage for the child help item
        var childHelp = help.child(ops.name);

        childHelp.usage(ops.usage);
        childHelp.description(ops.description);

        
        return cli;
    }


    cli.help = function() {

        help.print();
        
    }

    cli.commandHelp = function(data, next) {


        //intercept commands that are :command help
        if(this.channel.paths.length == 2 && this.channel.paths[1].value == 'help') {
            
            help.child(this.channel.paths[0].value).print();

            return;
        }

        next();
    }

    return {
        init: function() {
            
            cli.option('help', cli.help).
            option('**', cli.commandHelp);
        }
    }
    /*cli.on('help', function()
    {
        cli.help();
    });*/
}