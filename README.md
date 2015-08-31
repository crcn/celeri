C-e-L-er-I is an es6 command line utility belt library for [NodeJS](https://nodejs.org/).

#### Example

```javascript
{ prompt, confirm } = require("celeri");

var name = yield prompt("What is your name?"); 

console.log(name);

if (yield confirm("Do you like dog spaghetti?")) {
    console.log("awesome!");
}
```

#### Utilities

- [prompt](#prompt) - prompt the user for input
- [confirm](#confirm) - confirm yes/no
- [pickOne](#) - pick one item from the list

#### Promise celeri.prompt(label)

Prompts the user for a question

```javascript
import { prompt } from "celeri";
console.log("Your name is %s", yield prompt("What is your name?"));
```

#### Promise celeri.confirm(label, default)

Confirm y/n


```javascript
import { confirm } from "celeri";
if (yield confirm("Do you like cheese?", true)) {
    console.log("you like cheese.");
} else {
    console.log("you do not like cheese.");
}
```

#### Promise celeri.pickOne(label, items)

Picks one item from a list

```javascript
import { pickOne, listItem } from "celeri";

var color = yield pickOne("What is your favorite color?", ["red", "green", "blue"]);

console.log("your favorite color is %s", color);
```

#### Promise celeri.pickMany(label, items)

Picks many items from a list

```javascript
var colors = yield pickMany("what are your favorite colors?", ["red", "green", "blue"]);
```

#### Promise celeri.secret(label)

Prompts the user for a secret value (hidden from stdout).

```javascript
var password = yield secret("What's the secret?");
```

#### ListItem celeri.listItem(optionsOrValue)

Creates a new list item

- `optionsOrValue` - options or value of list item
    - `label` 

```javascript
var glob = require("glob");
var file = yield pickOne("Pick a file", glob.sync(process.cwd() + "/*").map(function(filename) {
    return listItem({
        label: filename,
        value: filename
    })
}))
```




