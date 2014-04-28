'use strict';
var Primative = require('./primative');

var Oxygen = function(game, x, y) {

  Primative.call(this, game, x, y, Oxygen.SIZE, Oxygen.COLOR);
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

Oxygen.SIZE = 16;
Oxygen.COLOR = '#4ec3ff';
Oxygen.ID = 'oxygen';

Oxygen.prototype.onRevived = function() {
  this.rotation = this.game.rnd.realInRange(0, 2 * Math.PI);
  this.position = new Phaser.Point(this.game.world.randomX, this.game.world.randomY);
  this.body.velocity.x = this.game.rnd.integerInRange(10,50);
  this.body.velocity.y = this.game.rnd.integerInRange(10,50);
  var flip = Math.random();
  
  if(flip < 0.25) {
    //spawn right
    this.position.x = this.game.width;
    this.body.velocity.x *= -1;
  } else if(flip < 0.5) {
    //spawn left
    this.position.x = 0;
  } else if(flip < 0.75) {
    //spawn top
    this.position.y = 0
  } else {
    //spawn bottom
    this.position.y = this.game.height;
    this.body.velocity.y *= -1;
  }
};

Oxygen.prototype.createTexture = function() {
  this.bmd.clear();

  Oxygen.drawBody(this.bmd.ctx, this.size, this.color);
  
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Oxygen.drawBody = function(ctx, size) {
  ctx.strokeStyle = '#4e8cff';
  ctx.fillStyle = Oxygen.COLOR;

  ctx.beginPath();
  //create circle outline
  ctx.arc(size / 2 , size / 2, size/2 - ctx.lineWidth, 0, 2 * Math.PI, false);
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  // create small circle on outside
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(size / 2, size / 8, size / 8, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();
  
};



module.exports = Oxygen;
