var celery = require('../');

celery.on('hello :name', function(data)
{
    console.log('hello %s, how are you doing?', data.name);
});

celery.open();
celery.parse(process.argv);