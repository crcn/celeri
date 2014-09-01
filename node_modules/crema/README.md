 

## Example

```javascript
var routes = crema('request -method=GET OR -method=POST authorize -> login');
```

Output:

```javascript
[
  {
    "type": "request",
    "tags": {
      "method": "get"
    },
    "path": {
      "value": "login",
      "segments": [
        {
          "value": "login",
          "param": false
        }
      ]
    },
    "thru": {
      "path": {
        "value": "authorize",
        "segments": [
          {
            "value": "authorize",
            "param": false
          }
        ]
      }
    }
  }
]
```

## Syntax

```javascript
crema('type -tag=value route OR route2');
```

## Custom Grammar 


## Use Cases

- [beanpole](beanpole)
- [dolce](dolce)
