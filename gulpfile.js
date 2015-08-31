var gulp    = require("gulp");
var mocha   = require("gulp-mocha");
var plumber = require("gulp-plumber");
var babel   = require("babel/register");

var ops = {
  testFiles: "./test/**/*-test.js",
  allFiles: ["./test/**", "./lib/**"],
  mocha: {
    bail: true,
    reporter: "dot",
    timeout: 1000,
    compilers : {
      js: babel
    }
  }
};

gulp.task("test-node", function (done) {
    gulp.
    src(ops.testFiles, { read: false }).
    pipe(plumber()).
    pipe(mocha(ops.mocha)).
    on("end", done);
});


var iofwatch = process.argv.indexOf("watch");

/**
* runs previous tasks (1 or more)
*/

gulp.task("watch", function () {
    gulp.watch(ops.allFiles, { interval: 500 }, process.argv.slice(2, iofwatch));
});
