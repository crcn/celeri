exports.plugin = function(cli)
{
    cli.prompt = function(label, callback)
    {
        var input = '';
        
        
        function write()
        {
            cli.replaceLine(label+input);
        }
        
        
        var disp = cli.on({
            'backspace': function()
            {
                if(!input.length) return;
                 
                input = input.substr(0, input.length-1);
            },
            'keypress': function(data)
            {
                if(data.key.name != 'backspace')
                input += data.char;
                
                write();
            },
            'enter': function()
            {
                setTimeout(callback, 1, input);
                disp.dispose();
            }
        });
        
        write();
    };
    
}