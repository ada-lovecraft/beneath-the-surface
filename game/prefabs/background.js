'use strict';
var GameManager = require('../plugins/GameManager'); 
var Background = function(game, size) {
  size = size || 1024;
  Phaser.BitmapData.call(this, game, size, size);
  this.createBackground();
};

Background.prototype = Object.create(Phaser.BitmapData.prototype);
Background.prototype.constructor = Background;

Background.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Background.prototype.createBackground = function() {
  var x, y, type,
      ctx = this.ctx;
  for(var i = 0; i < this.size / 10; i++) {
    x = this.game.rnd.integerInRange(0, this.size);
    y = this.game.rnd.integerInRange(0, this.size);
    ctx.save();
    ctx.translate(x,y);
    type = _.shuffle(GameManager.types());
    type.drawBody(ctx, type.SIZE, type.COLOR);
    ctx.restore();
  }
  this.render();
  this.refreshBuffer();
};

module.exports = Background;
