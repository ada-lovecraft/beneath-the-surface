'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var CommonCold = function(game, x, y) {
  var GameManager = require('../plugins/GameManager');
  Enemy.call(this, game, x, y, CommonCold.SIZE, CommonCold.COLOR,1);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    forces: {
      maxVelocity: 50
    },
    wander: {
      enabled: true 
    },
    flee: {
      target: GameManager.get('player'),
      enabled: true,
      viewDistance: 200
    },
    game: {
      debug: false
    }
  };

  
};

CommonCold.prototype = Object.create(Enemy.prototype);
CommonCold.prototype.constructor = CommonCold;

CommonCold.SIZE = 16;
CommonCold.COLOR = '#33d743';
CommonCold.ID = 'commonCold';
CommonCold.HEMOCHANCE = 0.5;

CommonCold.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
  }).bind(this));
  // write your prefab's specific update code here
};



CommonCold.drawBody = function(ctx, size) {
  var lineWidth = 1;
  var lineColor = '#258c2f';
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = CommonCold.COLOR;
  ctx.strokeStyle = lineColor;
  
  ctx.beginPath();
  Utils.polygon(ctx, size/2, size/2, size/2 - ctx.lineWidth,6,-Math.PI/2);
  ctx.fill();
  ctx.stroke();
};

module.exports = CommonCold;
