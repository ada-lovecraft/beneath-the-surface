'use strict';
var Primative = require('./primative');
var Automata = require('./automata');
var Cell = function(game, x, y, size, color) {
  size = size || 16;
  color = color || '#fc8383';

  var options = {
    wander: {
      enabled: true
    }
  };

  Automata.call(this, game, x, y, options);
  Primative.call(this, game, x, y, size, color);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  
  
};

Cell.prototype = Object.create(_.merge(Primative.prototype, Automata.prototype, _.defaults));
Cell.prototype.constructor = Cell;

Cell.prototype.update = function() {
  Automata.prototype.update.call(this);
  // write your prefab's specific update code here
  
};

Object.defineProperty(Cell.prototype, 'automataOptions', {
  get: function() {
    return this.options;
  },
  set: function(value) {
    this.setOptions(value);
  }
});

module.exports = Cell;
