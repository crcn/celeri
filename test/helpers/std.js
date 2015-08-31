var extend       = require("xtend/mutable");
var EventEmitter = require("events").EventEmitter;


function Input() {
  EventEmitter.call(this);
}


/**
 */

extend(Input.prototype, EventEmitter.prototype, {
  writeAsync: function(chunk) {
    process.nextTick(function() {
      this.emit("data", chunk);
    }.bind(this));
  },
  resume: function() {
    // console.log("RESU");
  },
  pause: function() {
    // console.log("PA");
  }
});



function Output() {
  EventEmitter.call(this);
  this.clear();
}

extend(Output.prototype, EventEmitter.prototype, {
  write: function(chars) {
    this.buffer.push(String(chars));
  },
  clear: function() {
    this.buffer = [];
  },
  toString: function() {
    return this.buffer.join("");
  }
});

/**
 */

module.exports = {
  Input: Input,
  Output: Output
};