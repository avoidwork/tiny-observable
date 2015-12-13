# tiny-observable
[![build status](https://secure.travis-ci.org/avoidwork/tiny-observable.svg)](http://travis-ci.org/avoidwork/tiny-observable)

Tiny Observable for Client or Server

## Example
```javascript
const observerable = require("tiny-observable");
let observer = observerable();

// Hooking into every click event
observer.hook(document.querySelector("body"), "click");

// Capturing events, and redirecting
observer.on("click", function (ev) {
  ev.preventDefault();
  ev.stopPropagation();
  customFunction(ev);
});
```

## API
#### dispatch(event [, ...]);
Dispatches an event, with optional arguments.

#### hook(object, event);
Hooks into `object` for an event; can be an Element or Array like Object.

#### off(event, id);
Removes all, or a specific listener for an event.

#### on(event, handler[, id, scope])
Adds a listener for an event.

#### once(event, handler[, id, scope])
Adds a single execution event listener for an event.

#### unhook(object, event);
Unhooks an event from a `object`; can be an Element or Array like Object.

## License
Copyright (c) 2015 Jason Mulligan
Licensed under the BSD-3 license
