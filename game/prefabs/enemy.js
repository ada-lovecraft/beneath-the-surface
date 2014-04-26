'use strict';
var Cell = require('./cell');

var Enemy = function(game, x, y, size, color, maxHealth) {
  color = color || '#88b25b';
  Cell.call(this, game, x, y, size, color, maxHealth);
};

Enemy.prototype = Object.create(Cell.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  Cell.prototype.update.call(this);
  this.healthHUD.bar.position.x = this.position.x;
  this.healthHUD.bar.position.y = this.position.y - this.radius;
};

module.exports = Enemy;
