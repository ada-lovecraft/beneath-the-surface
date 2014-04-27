'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var SwineFlu = function(game, x, y) {
  var GameManager = require('../plugins/GameManager');
  Enemy.call(this, game, x, y, SwineFlu.SIZE, SwineFlu.COLOR, 3);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    forces: {
      maxVelocity: 150
    },
    wander: {
      enabled: true 
    },
    pursue: {
      enabled: true,
      target: GameManager.get('friendlies'),
      viewDistance: this.game.width / 4
    },
    game: {
      debug: false
    }
  };

  this.body.setSize(this.size/2, this.size/2, this.size/4, this.size/4);
  
};

SwineFlu.prototype = Object.create(Enemy.prototype);
SwineFlu.prototype.constructor = SwineFlu;

SwineFlu.SIZE = 32;
SwineFlu.COLOR = '#ff8af8';
SwineFlu.ID = 'swineFlu';
SwineFlu.HEMOCHANCE = 0.75;

SwineFlu.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
  }).bind(this));
  // write your prefab's specific update code here
  
};



SwineFlu.drawBody = function(ctx, size) {
  ctx.strokeStyle = '#9a2c94';
  ctx.fillStyle = SwineFlu.COLOR;

  Utils.ellipseByCenter(ctx, size/2, size/2, size, size/2);
  ctx.fill();
  ctx.stroke();

  ctx.moveTo(size * 0.75, size * 0.5);
  ctx.beginPath();
  ctx.arc(size * 0.75, size * 0.5, size * 0.25, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  


};

module.exports = SwineFlu;
