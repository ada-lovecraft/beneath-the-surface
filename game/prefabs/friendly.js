'use strict';
var Cell = require('./cell');

var Friendly = function(game, x, y, size, color, maxHealth) {
  color = color || '#fc8383';
  Cell.call(this, game, x, y, size, color, maxHealth);
  this.canBeDamaged = true;
  this.panicTween = null;
  this.ouchSound = this.game.add.audio('ouch');
  this.oxygenSound = this.game.add.audio('oxygenPickup');

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
  if(this.options.evade.target && this.canBeDamaged) {
    this.game.physics.arcade.overlap(this, this.options.evade.target, this.takeDamage, null, this);  
  }
  this.game.physics.arcade.overlap(this, this.options.seek.target, this.oxygenPickup, null, this);

};

Friendly.prototype.oxygenPickup = function(friendly, oxygen) {
  if(friendly.health < friendly.maxHealth) {
    oxygen.kill();
    friendly.health++;
    this.oxygenSound.play();
  }
};

Friendly.prototype.takeDamage = function(self, enemy) {
  this.ouchSound.play();
  self.health--;
  if (this.health === 0) {
    this.kill();
  } else {
    this.canBeDamaged = false;
    this.automataOptions = {
      evade: {
        enabled: false
      },
      flee: {
        enabled: true
      },
      forces: {
        maxVelocity: 300
      }
    };

    this.panicTween = this.game.add.tween(this).to({alpha: 0.75 }, 300, Phaser.Easing.Linear.NONE, true, 0, 5, true);
    this.panicTween.onComplete.add(function() {
      this.canBeDamaged = true;
      this.automataOptions = {
        evade: {
          enabled: true
        },
        flee: {
          enabled: false
        },
        forces: {
          maxVelocity: 100
        }
      };
    }, this);
  }
};

module.exports = Friendly;
