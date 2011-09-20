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
    },
    
    {
        name: 'Michael',
        age: 23,
        interests: 'Food'
    },
    
    {
        name: 'Sarah',
        age: 19,
        interests: 'hello'
    }

];


celery.drawTable(objects, {
    columns: { 
        name: 15, 
        age: {
            get: function()
            {
                return 'Harrison Krix may never actually be invited to join Daft Punk, but at the very least, he\'ll likely have the coolest Halloween costume in the room for pretty much the rest of his lifeHarrison Krix may never actually be invited to join Daft Punk, but at the very least, he\'ll likely have the coolest Halloween costume in the room for pretty much the rest of his lifeHarrison Krix may never actually be invited to join Daft Punk, but at the very least, he\'ll likely have the coolest Halloween costume in the room for pretty much the rest of his lifeHarrison Krix may never actually be invited to join Daft Punk, but at the very least, he\'ll likely have the coolest Halloween costume in the room for pretty much the rest of his lifeHarrison Krix may never actually be invited to join Daft Punk, but at the very least, he\'ll likely have the coolest Halloween costume in the room for pretty much the rest of his life';
            }
        },
        interests: {
            get: function()
            {
                return 'Harrison Krix may never actually be invited to join Daft Punk, but at the very least, he\'ll likely have the coolest Halloween costume in the room for pretty much the rest of his life';
            }
        }
        
    }
    
});

celery.open();