'use strict';
var Primative = require('./primative');
var Automata = require('./automata');
var Cell = function(game, x, y, size, color, maxHealth) {
  size = size || 16;
  color = color || 'white';
  this.maxHealth = maxHealth || 5;
  

  var options = {
    wander: {
      enabled: true
    }
  };

  Automata.call(this, game, x, y, options);
  Primative.call(this, game, x, y, size, color);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.health = this.maxHealth;

  this.healthHUD = Phaser.Plugin.HUDManager.get('cellhud')
  .addBar(0,0, this.radius * 2, 2, this.maxHealth, 'health', this, Phaser.Plugin.HUDManager.HEALTHBAR, false);

  this.healthHUD.bar.anchor.setTo(0.5, 0.5);
  this.game.add.existing(this.healthHUD.bar);
  
  
};

Cell.prototype = Object.create(_.merge(Primative.prototype, Automata.prototype, _.defaults));
Cell.prototype.constructor = Cell;

Cell.prototype.update = function() {
  Automata.prototype.update.call(this);
  // write your prefab's specific update code here
  this.healthHUD.bar.position.x = this.position.x;
  this.healthHUD.bar.position.y = this.position.y - this.radius;
  
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
