var celery = require('../lib');

var objects = [ { name: 'bean.cupboard.scaffold',
    hasUpdates: ' ',
    published: 'published: 2 hours ago' },
  { name: 'teamdigest',
    hasUpdates: ' ',
    published: 'published: 2 hours ago' }];


celery.drawTable(objects, {
    	columns: [{
			width: 33, 
			name: 'name'
		},
		{
			name: 'hasUpdates',
			width: 33,
		},
		{
			name: 'published',
			width:33
		}],
    
    horz: '-',
	vert: '|'
    
});

celery.open();