var struct = require('observ-struct');
var value = require('observ');
var EE = require('events').EventEmitter;

module.exports = Input;

function Input(opts) {
  opts = opts || {};
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
    },
    [])
  ]);
    

};
