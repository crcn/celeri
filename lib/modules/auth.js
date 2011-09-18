exports.plugin = function(cli)
{
    cli.auth = function(callback)
    {
        cli.prompt('Username: ', function(user)
        {
            cli.password('Password: ','*', function(pass)
            {
                callback(user, pass);
            });
        });
    };
}