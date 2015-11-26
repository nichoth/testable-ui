# Testable UI components

Make UI components that are pure state machines, then we can reuse the state logic with any render function, or without a render function.

Good

* decouple component state from render function
* automated testing (no browser necessary)
* serializable events

Bad

* Need to expose and document a larger interface &mdash; the actions used by your component


## example

### MyInput
An input for a form.

#### API

##### Input.emitAction(data) -- return an emitter function.
```js
var emitAction = Input.emitAction(Input()());
emitAction({
  type: 'change-value',
  value: 'example'
});
```

##### Actions
```js
{
  type: 'change-value',
  value: ''
}
```

##### Input.value(data) -- return value in input.
```js
var value = Input.value(Input()());
```

Input.js
```js
var struct = require('observ-struct');
var value = require('observ');
var EE = require('events').EventEmitter;

module.exports = Input;

function Input(opts) {
  var bus = new EE();
  var emitAction = bus.emit.bind(bus, 'action');
  var onAction = bus.on.bind(bus, 'action');

  var state = struct({
    value: value(opts.value || ''),
    emitAction: value(emitAction)
  });

  onAction(function(action) {
    if (action.type === 'change-value') {
      state.value.set(action.value);
      console.log('value change', action);
    }
  });

  return state;
}

Input.value = function(data) {
  return data.value;
};

Input.emitAction = function(data) {
  return data.emitAction;
};

Input.render = function(h, state) {
  return h('label', [
    'my input',
    h('input', {
      name: 'test',
      type: 'text',
      value: state.value,
      oninput: function(ev) {
        var val = ev.target.value;
        state.emitAction({
          type: 'change-value',
          value: val
        });
      }
    })
  ]);
};
```

browser.js
```js
var Loop = require('main-loop');
var vdom = require('virtual-dom');
var h = vdom.h;
var Input = require('./');

var appState = Input({ value: 'test value' });

var loop = Loop(appState(), render.bind(null, h), vdom);
appState(loop.update);
document.body.appendChild(loop.target);

function render(h, state) {
  return Input.render(h, state);
}
```

test.js
```js
var test = require('tape');
var Input = require('./');

test('change value', function (t) {
  t.plan(2);

  var state = Input({ value: 'test' });
  var emitAction = Input.emitAction(state());
  t.equal(Input.value(state()), 'test');

  state(function onChange(data) {
    t.equal(Input.value(data), 'different value');
  });

  emitAction({
    type: 'change-value',
    value: 'different value'
  });

});
```
