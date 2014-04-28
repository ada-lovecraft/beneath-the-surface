'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var HPV = function(game, x, y, size) {
  this.size = size || HPV.SIZE;
  Enemy.call(this, game, x, y, this.size, HPV.COLOR, 1);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    enabled: false
  };
  this.rotation = this.game.rnd.realInRange(0, 6 * Math.PI);
  this.events.onKilled.add(this.onChildKilled, this);
  this.events.onRevived.add(this.onChildRevived, this);
};

HPV.prototype = Object.create(Enemy.prototype);
HPV.prototype.constructor = HPV;

HPV.SIZE = 64;
HPV.COLOR = '#b300fe';
HPV.ID = 'hpv';
HPV.HEMOCHANCE = 0.5;

HPV.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
    this._velocityCache = this.body.velocity;
    this.rotation += 0.4;
  }).bind(this));
  // write your prefab's specific update code here
  
};

HPV.prototype.onChildKilled = function() {
  if (this.size > HPV.SIZE / 4) {
    var hpv1 = null;
    var hpv2 = null;
    this.parent.forEachDead(function(cell) {
      if(cell.constructor === HPV && cell.size === this.size / 2) {
        if(!hpv1) {
          hpv1 = cell;
        } else if(!hpv2) {
          hpv2 = cell;
        }
      }
    }, this);

    if(!hpv1) {
      hpv1 = new HPV(this.game, this.x, this.y, this.size / 2);
      this.parent.add(hpv1);
    } 
    if(!hpv2) {
      hpv2 = new HPV(this.game, this.x, this.y, this.size / 2);
      this.parent.add(hpv2);
    }
    hpv1.reset(this.x, this.y);
    hpv2.reset(this.x, this.y);
    hpv1.revive();
    hpv2.revive();
  }
};

HPV.prototype.onChildRevived = function() {
  this.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
  this.body.velocity.y = this.game.rnd.integerInRange(-200, 200);
};



HPV.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var outterColor = HPV.COLOR;
  var innerColor = '#6f079a';
  var lineColor = innerColor;
  var x = size/2,
  y = size/2,
  // Radii of the inner color glow.
  innerRadius = size/4,
  outerRadius = size/2,
  // Radius of the entire circle.
  radius = size/2 - lineWidth;

  var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
  gradient.addColorStop(0, innerColor); //inner color
  gradient.addColorStop(1, outterColor);

  //draw circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();

  ctx.fillStyle = gradient;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  
  ctx.fill();
  ctx.stroke();

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


  


};

module.exports = HPV;
