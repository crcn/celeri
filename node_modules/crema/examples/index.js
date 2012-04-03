var crema = require('../lib');


var route = 'request -method=POST OR -method=GET (hello world) OR (hello earth) -> google';


route = 'request -method=GET  google/goggle/giggle OR test -> test/authorize -> login/*';


console.log(JSON.stringify(crema(route), null, 2));


