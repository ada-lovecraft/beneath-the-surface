'use strict';
var Cell = require('./cell');

var Enemy = function(game, x, y, size, color, maxHealth) {
  color = color || '#88b25b';
  maxHealth = maxHealth || 1;
  Cell.call(this, game, x, y, size, color, maxHealth);

  this.deathSound = this.game.add.audio('enemyDeath');
};

Enemy.prototype = Object.create(Cell.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  Cell.prototype.update.call(this);
};

Enemy.prototype.onKilled = function() {
  Cell.prototype.onKilled.call(this);
  this.deathSound.play();
};

module.exports = Enemy;
