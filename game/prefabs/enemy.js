'use strict';
var Cell = require('./cell');

var Enemy = function(game, x, y, size, color, maxHealth) {
  color = color || '#88b25b';
  maxHealth = maxHealth || 1;
  Cell.call(this, game, x, y, size, color, maxHealth);

  this.deathSound = this.game.add.audio('enemyDeath');
  this.damageSound = this.game.add.audio('enemyDamage');
  this.alive = false;
};

Enemy.prototype = Object.create(Cell.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(next) {
  Cell.prototype.update.call(this, next);
};

Enemy.prototype.onKilled = function() {
  Cell.prototype.onKilled.call(this);
  this.deathSound.play();
};

Enemy.prototype.damage = function(amount) {
  Cell.prototype.damage.call(this, amount);
  if(this.health > 0) {
    this.damageSound.play();
  }
};
module.exports = Enemy;
