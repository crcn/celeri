var confirm = require("../").confirm;


confirm("Do you like cats? ").then(function(name) {
  console.log("Your name is %s", name);
});
