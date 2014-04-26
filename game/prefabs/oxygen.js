'use strict';
var Primative = require('./primative');

var Oxygen = function(game, x, y) {
  Primative.call(this, game, x, y, 16, '#4e8cff');
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  

  // initialize your prefab here
  
  this.events.onRevived.add(this.onRevived, this);
  
};

Oxygen.prototype = Object.create(Phaser.Sprite.prototype);
Oxygen.prototype.constructor = Oxygen;

Oxygen.prototype.update = function() {
  
  // write your prefab's specific update code here
  this.rotation += 0.01;
  
};

Oxygen.prototype.onRevived = function() {
  this.rotation = this.game.rnd.realInRange(0, 2 * Math.PI);
  this.body.velocity.x = this.game.rnd.integerInRange(-50,50);
  this.body.velocity.y = this.game.rnd.integerInRange(-50,50);
};

Oxygen.prototype.createTexture = function() {
  this.bmd.clear();

  Oxygen.drawBody(this.bmd.ctx, this.size, this.color);
  
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Oxygen.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;

  ctx.beginPath();
  //create circle outline
  ctx.arc(size / 2 , size / 2, size/2 - size / 8, 0, 2 * Math.PI, false);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();

  // create small circle on outside
  ctx.beginPath();
  ctx.arc(size / 2, size / 8, size / 8, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
  
};



module.exports = Oxygen;
