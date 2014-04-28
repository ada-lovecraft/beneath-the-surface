'use strict';
var Primative = require('./primative');

var Death = function(game, x, y) {

  Primative.call(this, game, x, y, Death.SIZE, Death.COLOR);
  this.anchor.setTo(0.5, 0.5);
  
};

Death.prototype = Object.create(Phaser.Sprite.prototype);
Death.prototype.constructor = Death;


Death.SIZE = 16;
Death.COLOR = '#4ec3ff';
Death.ID = 'oxygen';


Death.drawBody = function(ctx, size) {

};



module.exports = Death;
