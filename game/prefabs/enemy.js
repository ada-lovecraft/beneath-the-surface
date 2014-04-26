'use strict';
var Cell = require('./cell');

var Enemy = function(game, x, y, size, color) {
  color = color || '#88b25b';
  Cell.call(this, game, x, y, size, color);
};

Enemy.prototype = Object.create(Cell.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  Cell.prototype.update.call(this);
};

module.exports = Enemy;
