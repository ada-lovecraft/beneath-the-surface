'use strict';
var Primative = require('./primative');

var CellParticle = function(game, x, y, cellClass) {
  this.cellClass = cellClass;
  Primative.call(this, game, x, y, CellParticle.SIZE, cellClass.COLOR);
  Phaser.Particle.call(this, game, x, y, this.bmd);

  this.bmd.clear();
  cellClass.drawBody(this.bmd.ctx, CellParticle.SIZE, cellClass.COLOR, 0);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

CellParticle.SIZE = 8;
CellParticle.COLOR = 'green';
CellParticle.ID = 'cellparticle';

CellParticle.prototype = Object.create(_.merge(Phaser.Particle.prototype,Primative.prototype, _.defaults));
CellParticle.prototype.constructor = CellParticle;

CellParticle.prototype.update = function() {
  // write your prefab's specific update code here
};


module.exports = CellParticle;
