var haba = require('../../lib')();

haba.paths(__dirname + '/plugins').
options({name: 'craig'}).
params('hello1', { name: 'blarg' }).
require('hello1','hello2').
init(); 
