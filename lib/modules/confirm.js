exports.plugin = function(cli)
{

    
    cli.confirm = function(label, callback)
    {
        label += ' [y/n]: ';
        
        cli.write(label);
        
        var input = '', yes = 'y', no = 'n';
        
        var disposable = cli.on({
            'keypress': function(data)
            {
                input = data.char;
                
                cli.buffer(label + input);
            },
            'enter': function()
            {
                if(input != yes && input != no)
                {
                    return cli.write('\nPlease enter "'+yes+'" or "'+no+'"');
                }
                
                
                disposable.dispose();
                
                
                setTimeout(callback, 1, input == 'y');
            }
        });
    };
}