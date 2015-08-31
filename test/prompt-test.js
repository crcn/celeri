var expect = require("expect.js");
var celeri = require("../");
var sinon  = require("sinon");
var co     = require("co");
var std    = require("./helpers/std");

describe(__filename + "#", function() {

  var cli;

  beforeEach(function() {
    cli = celeri({
      input: new std.Input(),
      output: new std.Output()
    });
  });

  it("can prompt a question", function(done) {
    co(function*() {
      cli.input.writeAsync("bob\r\n");
      expect(yield cli.prompt("What's your name?")).to.be("bob");
    }).then(done, done);
  });

  it("uses > for a default prompt", function(done) {
    co(function*() {
      cli.input.writeAsync("bob\r\n");
      yield cli.prompt();
      expect(cli.output.toString()).to.be("> ");
    }).then(done, done);
  });
});