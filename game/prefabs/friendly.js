'use strict';
var Cell = require('./cell');

var Friendly = function(game, x, y, size, color, maxHealth) {
  color = color || '#fc8383';
  Cell.call(this, game, x, y, size, color, maxHealth);

};

Friendly.prototype = Object.create(Cell.prototype);
Friendly.prototype.constructor = Friendly;

Friendly.prototype.update = function() {
  Cell.prototype.update.call(this);
  if(this.health === this.maxHealth && this.options.seek.enabled) {
    this.automataOptions = {
      seek: {
        enabled: false
      }
    };
  } else if (this.health < this.maxHealth && !this.options.seek.enabled) {
    this.automataOptions = {
      seek: {
        enabled: true
      }
    };
  }
};

module.exports = Friendly;
