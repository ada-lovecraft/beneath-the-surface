'use strict';
var Primative = require('./primative');

var Oxygen = function(game, x, y) {
  Primative.call(this, game, x, y, 12, '#4e8cff');
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);


  // initialize your prefab here
  
};

Oxygen.prototype = Object.create(Phaser.Sprite.prototype);
Oxygen.prototype.constructor = Oxygen;

Oxygen.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Oxygen.prototype.createTexture = function() {
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

module.exports = Oxygen;
