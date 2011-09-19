exports.plugin = function(cli)
{
    cli.loading = function(label, callback)
    {   
    
        if(typeof label == 'function')
        {
            callback = label;
            label = '';
        }
        
        if(!label) label = '';
        
        
        function done(success)
        { 
            var message = arguments.length ? (success ? 'success'.green.bold : 'fail'.red.bold ) : 'done'.grey.bold;
            
            clearInterval(interval);
            cli.replaceLine(label+message);
            cli.newLine();
        }
        
        if(callback) callback(done);
        
        var seq = '–\|/';
        pos = 0,
        interval = setInterval(function()
        {
            cli.replaceLine(label+'['+seq[pos++%seq.length].blue+'] ');
        }, 200);
        
        
        return {
            done: done
        };
        
        
    }
}