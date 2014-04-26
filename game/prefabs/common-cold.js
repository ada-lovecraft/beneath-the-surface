'use strict';
var Enemy = require('./enemy');
var CommonCold = function(game, x, y) {
  Enemy.call(this, game, x, y, 16, '#88b25b',1);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);


  // initialize your prefab here
  
};

CommonCold.prototype = Object.create(Enemy.prototype);
CommonCold.prototype.constructor = CommonCold;

CommonCold.prototype.update = function() {
  Enemy.prototype.update.call(this);
  // write your prefab's specific update code here
  
};

CommonCold.prototype.createTexture = function() {
  this.bmd.clear();

  //this.bmd.ctx.save();
  //this.bmd.ctx.globalAlpha = 0.5;
  this.bmd.ctx.beginPath();
  // create circle background
  this.bmd.ctx.moveTo(this.size / 2, 0);
  this.bmd.ctx.lineTo(this.size, this.size * 0.3);
  this.bmd.ctx.lineTo(this.size, this.size * 0.7);
  this.bmd.ctx.lineTo(this.size / 2, this.size);
  this.bmd.ctx.lineTo(0, this.size * 0.7);
  this.bmd.ctx.lineTo(0, this.size * 0.3);
  this.bmd.ctx.lineTo(this.size / 2, 0);
  this.bmd.ctx.strokeStyle = this.color;
  this.bmd.ctx.lineWidth = 1;
  this.bmd.ctx.stroke();
  this.bmd.ctx.closePath();

  this.bmd.ctx.save();
  this.bmd.ctx.globalAlpha = 0.5;
  this.bmd.ctx.beginPath();
  // create circle background
  this.bmd.ctx.moveTo(this.size / 2, 0);
  this.bmd.ctx.lineTo(this.size, this.size * 0.3);
  this.bmd.ctx.lineTo(this.size, this.size * 0.7);
  this.bmd.ctx.lineTo(this.size / 2, this.size);
  this.bmd.ctx.lineTo(0, this.size * 0.7);
  this.bmd.ctx.lineTo(0, this.size * 0.3);
  this.bmd.ctx.lineTo(this.size / 2, 0);
  this.bmd.ctx.fillStyle = this.color;
  this.bmd.ctx.fill();
  this.bmd.ctx.closePath();
  this.bmd.ctx.restore();
  /*
  this.bmd.ctx.lineTo(this.size, this.size * 0.75);
  this.bmd.ctx.lineTo(this.size / 2, this.size);
  this.bmd.ctx.lineTo(0, this.size * 0.75);
  this.bmd.ctx.lineTo(0, this.size * 0.25);
  this.bmd.ctx.lineTo(this.width/2, 0);
  this.bmd.ctx.fillStyle = this.color;
  this.bmd.ctx.closePath();
  this.bmd.ctx.fill();
  */
  
  //create circle outline
  /*
  this.bmd.ctx.restore();
  CommonCold.drawBody(this.bmd.ctx);
  this.bmd.ctx.strokeStyle = this.color;
  this.bmd.ctx.lineWidth = 1;
  this.bmd.ctx.stroke();
  */
  this.bmd.render();
  this.bmd.refreshBuffer();
};

CommonCold.drawBody = function(ctx) {
  ctx.moveTo(this.width/2, 0);
  ctx.lineTo(this.width, this.height * 0.25);
  ctx.lineTo(this.width, this.height * 0.75);
  ctx.lineTo(this.width/2, this.height);
  ctx.lineTo(0, this.height * 0.75);
  ctx.lineTo(0, this.height * 0.25);
  ctx.lineTo(this.width/2, 0);
};

module.exports = CommonCold;
