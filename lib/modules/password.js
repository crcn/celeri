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
        
        label += ' ';
        
        cli.write(label);
        
        var input = '';
        
        
        var disposable = cli.on({
            'backspace': function()
            {
                if(!input.length) return;
                 
                input = input.substr(0, input.length-1);
            },
            'keypress': function(char, key)
            {
                if(key.name != 'backspace')
                    input += char;
                
                
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