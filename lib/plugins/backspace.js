exports.require = ["command.route"];
exports.plugin = function(commandRoute, cli) {

   cli.onCommand('backspace', function() {
        var pos = cli.cursor();
        if(pos == cli.inputPrefix().length) return;

        cli.spliceLine(pos-1, 1, pos-1);
    });

    cli.onCommand('delete', function() {
        var pos = cli.cursor();

        cli.spliceLine(pos, 1, pos);
    });

}