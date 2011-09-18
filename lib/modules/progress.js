exports.plugin = function(cli)
{
    var spaces = 20,
    perc = 0;
    
    function percentBuffer(label, color)
    {
        var buffer = label + ' [',
        diff = Math.round((spaces/100) * perc);
        
        
        for(var i = 0; i < diff; i++)
        {
            buffer += '#'[color];
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
    
        //fail
        if(percent === false)
        {
            cli.replaceLine(percentBuffer(label, perc, 'red'));
            return cli.newLine();
        }
    
        perc = Math.min(percent, 100);
        
        cli.replaceLine(percentBuffer(label, perc == 100 ? 'green' : 'blue'));
        
        if(perc == 100)
        {
            return cli.newLine();
        }
        
    };
}