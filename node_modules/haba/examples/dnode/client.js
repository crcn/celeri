var haba = require('../../lib')();

haba.require(__dirname+'/client-plugins').
require('dnode+http://user:pass@localhost:5050').
init();