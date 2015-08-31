
/**
 */

module.exports = function(cli) {
  cli.confirm = function(label, def) {

    var question = label;

    if (def == void 0) {
      question += "[y/n] ";
    } else if (def === true) {
      question += "[Y/n] ";
    } else {
      question += "[y/N] ";
    }

    return new Promise(function(resolve, reject) {
      cli.rl.question(question, function(answer) {
        if (/^y(es)?$/.test(answer)) {
          resolve(true);
        } else if (/^no?$/.test(answer)) {
          resolve(false);
        } else {
          if (def == void 0) {
            return cli.confirm(label).then(resolve, reject);
          }
          resolve(def);
        }
      }); 
    });
  };
};
