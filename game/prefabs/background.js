'use strict';
var GameManager = require('../plugins/GameManager'); 
var Background = function(game, size) {
  this.size = size || 1024;
  Phaser.BitmapData.call(this, game, this.size, this.size);
  this.createBackground();
};

Background.prototype = Object.create(Phaser.BitmapData.prototype);
Background.prototype.constructor = Background;

Background.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Background.prototype.createBackground = function() {
  var x, y, type,
      ctx = this.context;
  for(var i = 0; i < 10; i++) {
    x = this.game.rnd.integerInRange(0, this.size);
    y = this.game.rnd.integerInRange(0, this.size);
    ctx.save();
    ctx.translate(x,y);
    type = _.sample(GameManager.types());
    type.drawBody(ctx, type.SIZE, type.COLOR);
    ctx.restore();
  }
  this.render();
  this.refreshBuffer();
};

module.exports = Background;
