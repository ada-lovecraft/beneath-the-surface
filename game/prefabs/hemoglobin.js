'use strict';
var Primative = require('./primative');

var Hemoglobin = function(game, x, y) {
  Primative.call(this, game, x, y, 16, '#c820ff');
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.killSound = this.game.add.audio('hemoglobinPickup');
  // initialize your prefab here
  
  this.events.onKilled.add(this.onKilled, this);
};

Hemoglobin.prototype = Object.create(Phaser.Sprite.prototype);
Hemoglobin.prototype.constructor = Hemoglobin;

Hemoglobin.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Hemoglobin.prototype.onKilled = function() {
  this.killSound.play();
};

Hemoglobin.prototype.createTexture = function() {
  this.bmd.clear();

  this.bmd.ctx.save();
  this.bmd.ctx.globalAlpha = 0.5;
  this.bmd.ctx.beginPath();
  // create circle background
  this.bmd.ctx.arc(this.size / 2 , this.size / 2, this.size / 2 - 2, 0, 2 * Math.PI, false);
  this.bmd.ctx.fillStyle = this.color;
  this.bmd.ctx.closePath();
  this.bmd.ctx.fill();
  
  //create circle outline
  this.bmd.ctx.restore();
  this.bmd.ctx.arc(this.size / 2 , this.size / 2, this.size / 2 - 2, 0, 2 * Math.PI, false);
  this.bmd.ctx.strokeStyle = this.color;
  this.bmd.ctx.lineWidth = 1;
  this.bmd.ctx.stroke();


  this.bmd.render();
  this.bmd.refreshBuffer();
};

module.exports = Hemoglobin;
