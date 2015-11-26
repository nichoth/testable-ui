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
