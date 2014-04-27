'use strict';
var Primative = function(game, x, y, size, color ) {
  x = x || 0;
  y = y || 0;
  this.size = size;
  this.color = color;

  this.bmd = game.add.bitmapData(this.size, this.size);
  this.createTexture();
  Phaser.Sprite.call(this, game, x, y, this.bmd);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

  // initialize your prefab here
};

Primative.prototype = Object.create(Phaser.Sprite.prototype);
Primative.prototype.constructor = Primative;

Primative.prototype.setColor = function(color) {
  this.color = color;
  this.createTexture();
};

Primative.prototype.createTexture = function(renderFn) {
  renderFn = renderFn || Primative.drawBody;
  this.bmd.clear();
  if(this.constructor.hasOwnProperty('drawBody')) {
    renderFn = this.constructor.drawBody;
  }
  renderFn(this.bmd.ctx, this.size, this.color);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Primative.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  ctx.beginPath();
  ctx.rect(0,0, size, size);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};
module.exports = Primative;
