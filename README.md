# tiny-observable
[![build status](https://secure.travis-ci.org/avoidwork/tiny-observable.svg)](http://travis-ci.org/avoidwork/tiny-observable)

Tiny Observable for Client or Server

## Example
```javascript
let observer = observerable();

// Hooking into every anchor
observer.hook(document.querySelectorAll("a"), "click");

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
Hooks into `target` for an event.

#### off(event, id);
Removes all, or a specific listener for an event.

#### on(event, handler[, id, scope])
Adds a listener for an event.

#### once(event, handler[, id, scope])
Adds a single execution event listener for an event.

#### unhook(object, event);
Unhooks an event from a `target`.
