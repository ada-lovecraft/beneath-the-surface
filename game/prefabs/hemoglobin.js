'use strict';
var Primative = require('./primative');

var Hemoglobin = function(game, x, y) {
  Primative.call(this, game, x, y, 16, '#c820ff');
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.killSound = this.game.add.audio('hemoglobinPickup');
  // initialize your prefab here
  
  this.events.onKilled.add(this.onKilled, this);
  this.events.onRevived.add(this.onRevived, this);

};

Hemoglobin.prototype = Object.create(Phaser.Sprite.prototype);
Hemoglobin.prototype.constructor = Hemoglobin;

Hemoglobin.prototype.update = function() {
  this.rotation += 0.1;
  // write your prefab's specific update code here
  
};

Hemoglobin.prototype.onRevived = function() {
  this.rotation = this.game.rnd.realInRange(0, 2 * Math.PI);
  this.body.velocity.x = this.game.rnd.integerInRange(-50,50);
  this.body.velocity.y = this.game.rnd.integerInRange(-50,50);
};

Hemoglobin.prototype.onKilled = function() {
  this.killSound.play();
};

Hemoglobin.prototype.createTexture = function() {
  this.bmd.clear();
  Hemoglobin.drawBody(this.bmd.ctx, this.size, this.color);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Hemoglobin.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  // draw dumbell line
  ctx.strokeStyle = '#761397';
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  
  
  ctx.beginPath();
  ctx.arc(size/2, size * 0.3, size/4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.arc(size/2, size * 0.7, size/4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  
  
};

module.exports = Hemoglobin;
