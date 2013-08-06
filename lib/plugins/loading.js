exports.plugin = function(cli) {

    cli.loading = function(label, options) {   

        if(!options) options = {}    
        if(!label) label = '';

        
        
        function done(err, result) {
            var success = err == null, msg, color;
            if(success) {
                msg = "✔";
                color = "green";
            } else {
                msg = "✘"
                color = "red";
            }
            
            clearInterval(interval);
            cli.replaceLine("[ " + msg[color] + " ] " + label);
            cli.newLine();
        }
        
        
        var seq = '–\|/';
        pos = 0,
        interval = setInterval(function() {
            cli.replaceLine('[ '+seq[pos++%seq.length].grey+' ] ' + label);
        }, 200);
        
        
        return {
            done: done
        };
    }
}