var celery = require('../lib');

celery.confirm('Do you want to continue?f dsfsdf sf sfsd fsd fsf sf sf sf sfsd bfs jf sdbjfsdbsfdbkfsdbjkfsdbfsdbkjf b jkbfksjfbsk', function(yes)
{
    if(yes)
    {
        console.log("YES!".green);
    }
    else
    {
        console.log("NO!".red);
    }
});


celery.open();