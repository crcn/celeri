var prompt = require("../").prompt;


prompt("What's your name? ").then(function(name) {
  console.log("Your name is %s", name);
});
