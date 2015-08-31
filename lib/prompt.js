
/**
 */

module.exports = function(cli) {
  cli.prompt = function(label) {
    return new Promise(function(resolve, reject) {
      cli.rl.question(label || "> ", resolve);
    });
  };
};
