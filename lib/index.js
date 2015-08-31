var extend   = require("xtend/mutable");
var readline = require("readline");

/**
 */

function Celeri(properties) {
  extend(this, properties || {});
  this.rl = readline.createInterface(this);
  this.use.apply(this, this.plugins);
}

/**
 */

extend(Celeri.prototype, {

  /**
   */

  input  : process.stdin,
  output : process.stdout,

  /**
   */

  plugins : [
    require("./prompt"),
    require("./confirm")
  ],

  /**
   */

  use : function() {
    Array.prototype.forEach.call(arguments, function(plugin) {
      plugin(this);
    }.bind(this));
  }
});

/**
 */

module.exports = function(ops) {
  return new Celeri(ops);
};

/**
 */

var cli = new Celeri();

/**
 */

for (var key in cli) {
  var v = cli[key];
  if (typeof v === "function") v = v.bind(cli);
  module.exports[key] = v;
}