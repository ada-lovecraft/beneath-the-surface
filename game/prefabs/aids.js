'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var AIDS = function(game, x, y, size) {
  var GameManager = require('../plugins/GameManager');
  this.size = size || AIDS.SIZE;
  Enemy.call(this, game, x, y, this.size, AIDS.COLOR, 3);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    enabled: true,
    pursue: {
      enabled: true,
      target: GameManager.get('friendlies'),
    },
    forces: {
      maxVelocity: 1000,
      maxForce: 100
    }
  };
  
  this.events.onKilled.add(this.onChildKilled, this);
  this.events.onRevived.add(this.onChildRevived, this);
};

AIDS.prototype = Object.create(Enemy.prototype);
AIDS.prototype.constructor = AIDS;

AIDS.SIZE = 32;
AIDS.COLOR = '#ffba00';
AIDS.ID = 'aids';
AIDS.HEMOCHANCE = 0.0;

AIDS.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
  }).bind(this));
  // write your prefab's specific update code here
  
};

AIDS.prototype.onChildKilled = function() {
};

AIDS.prototype.onChildRevived = function() {
  this.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
  this.body.velocity.y = this.game.rnd.integerInRange(-200, 200);
};



AIDS.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var lineColor = '#0b8f2d';
  var x = size/2,
  y = size/2,
  radius = size/3;


  //draw circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();

  ctx.fillStyle = AIDS.COLOR;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#bf00fe';
  ctx.strokeStyle = '#6a058b';
  ctx.lineWidth = lineWidth;

  for(var angle = 0; angle < 360; angle += 45) {
    var center = new Phaser.Point(radius * Math.cos(angle * Math.PI / 180) + x, radius * Math.sin(angle * Math.PI / 180) + y);
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius/3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  

  /*
  //draw dots
  ctx.fillStyle = 'white'
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.3, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.3, size * 0.7, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.4, size * 0.4, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.4, size * 0.12, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.8, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();  

  */
  


};

module.exports = AIDS;
