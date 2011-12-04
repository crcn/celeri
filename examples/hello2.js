var celery = require('../lib');

celery.onCommand('delay :seconds', function(data)
{
    console.log("delaying for %s seconds", data.seconds);
    
    setTimeout(function(self)
    {
        if(!self.next()) console.log("done!");
    }, Number(data.seconds) * 1000, this);
});


celery.onCommand('delay 1 -> say hello :name', function(data)
{
   console.log('hello %s!', data.name); 
});

celery.open();