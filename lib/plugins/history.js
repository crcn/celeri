exports.require = ["command.route"];
exports.plugin = function(commandRoute, cli) {
    var history = [], cursor = 0, max = 20;
    
    cli.onCommand('enter', function() {
        history.push(cli.buffer());
        
        if(history.length > max)
        {
            history.shift();
        }
        
        
        cursor = history.length-1;
        
    });
    
    
    cli.onCommand('up', function() {
        if(cursor == -1) return;
        
        cli.replaceLine(history[cursor--]);
    });
    
    cli.onCommand('down', function() {
        if(cursor == history.length-1) return;
        
        cli.replaceLine(history[++cursor]);
    });
    
}