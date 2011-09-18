exports.plugin = function(cli)
{

    function getMask(mask, length)
    {
        if(!mask) return '';
        
        var buffer = '';
        
        for(var i = length; i--;)
        {
            buffer += mask;
        }
        
        return buffer;
    }

    
    cli.password = function(label, mask, callback)
    {
        if(typeof mask == 'function')
        {
            callback = mask;
            mask = undefined;
        }
        
        
        cli.write(label);
        
        var input = '';
        
        
        var disposable = cli.on({
            'backspace': function()
            {
                if(!input.length) return;
                 
                input = input.substr(0, input.length-1);
            },
            'keypress': function(data)
            {
                if(data.key.name != 'backspace')
                    input += data.char;
                
                cli.buffer(label+getMask(mask, input.length));
            },
            'enter': function()
            {
                setTimeout(callback,1,input);
                disposable.dispose();
            }
        });
    };
}