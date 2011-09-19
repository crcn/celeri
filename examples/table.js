var celery = require('../lib');

var objects = [
    
    {
        name: 'Craig',
        age: 21,
        interests: 'Cooking, espresso, backpacking, coding'
    },
    
    
    {
        name: 'Tim',
        age: 21,
        interests: 'Design, Traveling, Photography'
        
    }

];


celery.drawTable(objects, {
    columns: { 
        name: 15, 
        age: 20, 
        interests: 15
    }
    
});

celery.open();