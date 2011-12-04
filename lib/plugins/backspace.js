exports.plugin = function(cli) {

    return {
        init: function() {
            cli.onCommand('backspace', function() {
                var pos = cli.cursor();
                // console.log(pos)
                if(pos == cli.inputPrefix().length) return;
                
                cli.spliceLine(pos-1, 1, pos-1);
                //cli.replaceLine(buffer.substr(0, pos-1) + buffer.substr(pos, buffer.length-pos), pos-1);
                
            });
            
            cli.onCommand('delete', function() {
                var pos = cli.cursor();
                
                cli.spliceLine(pos, 1, pos);
            });   
        }
    }
    
}