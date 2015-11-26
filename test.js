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
