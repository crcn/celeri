exports.plugin = function(cli)
{
    var spaces = 20,
    perc = 0;
    
    function percentBuffer(label)
    {
        var buffer = label + ' [',
        diff = Math.round((spaces/100) * perc);
        
        
        for(var i = 0; i < diff; i++)
        {
            buffer += '#';
        }
        
        for(var j = diff; j < spaces; j++)
        {
            buffer += ' ';
        }
        
        buffer += '] ' + perc + '% ';
        
        return buffer;
    }
    
    cli.progress = function(label, percent)
    {
        perc = Math.min(percent, 100);
        
        cli.replaceLine(percentBuffer(label));
    };
}