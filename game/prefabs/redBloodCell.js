'use strict';
var Cell = require('./cell');
var GameManager = require('../plugins/GameManager');

var RedBloodCell = function(game, x, y, size, color, maxHealth) {
  color = color || RedBloodCell.COLOR;
  size = size || RedBloodCell.SIZE;
  maxHealth = maxHealth || 3;
  Cell.call(this, game, x, y, size, color, maxHealth);

  this.canBeDamaged = true;
  this.panicTween = null;
  this.ouchSound = this.game.add.audio('ouch');
  this.oxygenSound = this.game.add.audio('oxygenPickup');
  this.deathSound = this.game.add.audio('cellDeath');
  this.alive = false;

  this.automataOptions = {
    seek: {
          target: this.oxygen
        },
    evade: {
      enabled: true,
      target: GameManager.get('enemies'),
      strength: 1.0,
      viewDistance: 200,
    },
    flee:{
      target: GameManager.get('enemies'),
      strength: 1.0
    },
    wander: {
      strength: 1.0,
      enabled: true
    },
    game: {
      debug: false,
      wrapWorldBounds: false
    },
    forces: {
      maxVelocity: 100
    }
  };


  this.events.onRevived.add(this.onRevived, this);

};

RedBloodCell.prototype = Object.create(Cell.prototype);
RedBloodCell.prototype.constructor = RedBloodCell;

RedBloodCell.SIZE = 16;
RedBloodCell.COLOR = '#fc8383';

RedBloodCell.prototype.update = function() {
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

RedBloodCell.prototype.oxygenPickup = function(RedBloodCell, oxygen) {
  if(RedBloodCell.health < RedBloodCell.maxHealth) {
    oxygen.kill();
    RedBloodCell.health++;
    this.oxygenSound.play();
  }
};

RedBloodCell.prototype.takeDamage = function() {
  
  this.health--;
  if (this.health === 0) {
    this.kill();
    this.deathSound.play();
    this.healthHUD.bar.kill();
  } else {
    this.ouchSound.play();
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

    this.panicTween = this.game.add.tween(this).to({tint: 0x333333 }, 300, Phaser.Easing.Linear.NONE, true, 0, 5, true);
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

RedBloodCell.prototype.onRevived = function() {
  this.health = this.maxHealth;
};

RedBloodCell.prototype.createTexture = function() {
  this.bmd.clear();
  RedBloodCell.drawBody(this.bmd.ctx, this.size, this.color);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

RedBloodCell.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var lineColor = '#9a0b0b';
  ctx.lineWidth = 2;
  ctx.fillStyle = color;
  ctx.strokeStyle = lineColor;
  console.log(size);
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

};

module.exports = RedBloodCell;
