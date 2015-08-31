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

  it("keeps asking the same question until a correct input is entered", function(done) {
    co(function*() {
      cli.input.writeAsync("d\r\n");
      cli.input.writeAsync("c\r\n");
      cli.input.writeAsync("n\r\n");
      expect(yield cli.confirm("type no")).to.be(false);
      expect(cli.output.buffer.length).to.be(3);
    }).then(done, done);
  });

  it("can only take 'n' or 'no' as a false input", function(done) {
    co(function*() {
      cli.input.writeAsync("nan\r\n");
      cli.input.writeAsync("on\r\n");
      cli.input.writeAsync("n\r\n");
      expect(yield cli.confirm("type no")).to.be(false);
      expect(cli.output.buffer.length).to.be(3);
      cli.output.clear();
      cli.input.writeAsync("noo\r\n");
      cli.input.writeAsync("nno\r\n");
      cli.input.writeAsync("no\r\n");
      expect(yield cli.confirm("type no")).to.be(false);
      expect(cli.output.buffer.length).to.be(3);
    }).then(done, done);
  });

  it("can only take 'y' or 'yes' as a true input", function(done) {
    co(function*() {
      cli.input.writeAsync("ye\r\n");
      cli.input.writeAsync("yn\r\n");
      cli.input.writeAsync("yy\r\n");
      cli.input.writeAsync("y\r\n");
      expect(yield cli.confirm("type yes")).to.be(true);
      expect(cli.output.buffer.length).to.be(4);
      cli.output.clear();
      cli.input.writeAsync("yess\r\n");
      cli.input.writeAsync("yes\r\n");
      expect(yield cli.confirm("type no")).to.be(true);
      expect(cli.output.buffer.length).to.be(2);
    }).then(done, done);
  });

  it("shows proper label if there is no default input", function(done) {
    co(function*() {
      cli.input.writeAsync("y\r\n");
      expect(yield cli.confirm("type yes")).to.be(true);
      expect(cli.output.toString()).to.be("type yes[y/n] ");
    }).then(done, done);
  });

  it("shows proper label if default input is true", function(done) {
    co(function*() {
      cli.input.writeAsync("y\r\n");
      expect(yield cli.confirm("type yes", true)).to.be(true);
      expect(cli.output.toString()).to.be("type yes[Y/n] ");
    }).then(done, done);
  });

  it("shows proper label if default input is false", function(done) {
    co(function*() {
      cli.input.writeAsync("y\r\n");
      expect(yield cli.confirm("type yes", false)).to.be(true);
      expect(cli.output.toString()).to.be("type yes[y/N] ");
    }).then(done, done);
  });


  it("defaults to default input if no input is entered", function(done) {
    co(function*() {
      cli.input.writeAsync("\r\n");
      expect(yield cli.confirm("type yes", true)).to.be(true);
      cli.input.writeAsync("\r\n");
      expect(yield cli.confirm("type no", false)).to.be(false);
    }).then(done, done);
  });
});