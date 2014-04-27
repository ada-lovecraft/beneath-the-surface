'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var HPV = function(game, x, y, size) {
  var GameManager = require('../plugins/GameManager');
  Enemy.call(this, game, x, y, size || HPV.SIZE, HPV.COLOR, 2);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    forces: {
      maxVelocity: 100
    },
    wander: {
      enabled: true 
    },
    pursue: {
      enabled: true,
      target: GameManager.get('player'),
      viewDistance: this.game.width / 4
    },
    game: {
      debug: false
    }
  };

  this.body.setSize(this.size/2, this.size/2, this.size/4, this.size/4);
  
};

HPV.prototype = Object.create(Enemy.prototype);
HPV.prototype.constructor = HPV;

HPV.SIZE = 64;
HPV.COLOR = '#2ad0e4';
HPV.ID = 'influenza';
HPV.HEMOCHANCE = 0.5;

HPV.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
  }).bind(this));
  // write your prefab's specific update code here
  
};



HPV.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var outterColor = HPV.COLOR;
  var innerColor = '#2a82e4';
  var lineColor = innerColor;
  var x = size/2,
  y = size/2,
  // Radii of the inner color glow.
  innerRadius = size/8,
  outerRadius = size/4,
  // Radius of the entire circle.
  radius = size/4;

  var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
  gradient.addColorStop(0, innerColor); //inner color
  gradient.addColorStop(1, outterColor);


  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();

  ctx.fillStyle = gradient;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  
  ctx.fill();
  ctx.stroke();

  // draw lines
  //top
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.25);
  ctx.lineTo(size * 0.5, 0);
  ctx.closePath();
  ctx.stroke();

  //right
  ctx.beginPath();
  ctx.moveTo(size * 0.75, size * 0.5);
  ctx.lineTo(size, size * 0.5);
  ctx.closePath();
  ctx.stroke();

  //bottom
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.75);
  ctx.lineTo(size * 0.5, size);
  ctx.closePath();
  ctx.stroke();

  //left
  //ctx.beginPath();
  ctx.moveTo(size * 0.25, size * 0.5);
  ctx.lineTo(0, size * 0.5);
  ctx.closePath();
  ctx.stroke();
  


};

module.exports = HPV;
