exports.plugin = function(cli)
{
    cli.loading = function(label, callback)
    {   
        if(typeof label == 'function')
        {
            callback = label;
            label = '';
        }
        
        function done()
        { 
            clearInterval(interval);
            cli.write('\n');
        }
        
        if(callback) callback(done);
        
        var seq = '–\|/';
        pos = 0,
        interval = setInterval(function()
        {
            cli.replaceLine(label+'['+seq[pos++%seq.length]+'] ');
        }, 200);
        
        
        return {
            done: done
        };
        
        
    }
}