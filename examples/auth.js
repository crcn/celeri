var celery = require('../lib');

celery.prompt('Username: ', function(user)
{
    celery.password('Password: ', function(pass)
    {
        console.log('user: %s', user);
        console.log('pass: %s', pass);
    });
});


celery.open();