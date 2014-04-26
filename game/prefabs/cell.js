'use strict';
var Primative = require('./primative');
var Automata = require('./automata');
var cellCounter = 0;
var Cell = function(game, x, y, size, color, maxHealth) {
  size = size || 16;
  this.cellColor = color || 'white';
  this.maxHealth = maxHealth || 5;
  

  var options = {
    wander: {
      enabled: true,
      strength: 0.5
    }
  };

  Automata.call(this, game, x, y, options);
  Primative.call(this, game, x, y, size, this.cellColor);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.health = this.maxHealth;

  this.healthHUD = Phaser.Plugin.HUDManager.get('cellhud')
  .addBar(0,0, this.radius * 2, 2, this.maxHealth, 'health', this, Phaser.Plugin.HUDManager.HEALTHBAR, false);

  this.healthHUD.bar.anchor.setTo(0.5, 0.5);
  this.game.add.existing(this.healthHUD.bar);

  this.events.onKilled.add(this.onKilled, this);
  this.id = cellCounter;
  this.label = null;
  cellCounter++;
  
  
  
};

Cell.prototype = Object.create(_.merge(Primative.prototype, Automata.prototype, _.defaults));
Cell.prototype.constructor = Cell;

Cell.prototype.update = function() {
  if(this.exists) {
    Automata.prototype.update.call(this);
  }
  // write your prefab's specific update code here
  this.healthHUD.bar.position.x = this.position.x;
  this.healthHUD.bar.position.y = this.position.y - this.radius;
  if(this.options.game.debug && this.exists) {
    Cell.debug.updateLabel(this);
  }
  
};

Cell.prototype.onKilled = function() {
  this.healthHUD.bar.kill();
  if(this.options.game.debug) {
    Cell.debug.destroyLabels(this);
    this.renderDebug.clear();
  }
};

Cell.prototype.onRevived = function() {

};

Cell.debug = {
  updateLabel: function(cell) {
    if(cell.options.game.debug) {
      if(!cell.idDebug) {
        cell.idDebug = cell.game.add.text(cell.x, cell.y, cell.id, {font: '8pt Arial'});
        cell.idDebug.anchor.setTo(0.5, 0.5);
      }
      if(!cell.positionDebug) {
        cell.positionDebug = cell.game.add.text(cell.x, cell.y + cell.radius, '');
        cell.positionDebug.anchor.setTo(0.5, 0.5);
        cell.positionDebug.style.font = '8pt Arial';
        cell.positionDebug.fill = cell.cellColor;
      }
    }
    cell.idDebug.position = cell.position;
    
    cell.positionDebug.position = new Phaser.Point(cell.x, cell.y + cell.radius);
    cell.positionDebug.text = 'x: ' + cell.position.x.toFixed(0) + ' y: ' + cell.position.y.toFixed(0);
  },
  destroyLabels: function(cell) {
    cell.idDebug.destroy();
    cell.positionDebug.destroy();
  }
};

Object.defineProperty(Cell.prototype, 'automataOptions', {
  get: function() {
    return this.options;
  },
  set: function(value) {
    this.setOptions(value);
    if(this.options.game.wrapWorldBounds == false) {
      this.body.collideWorldBounds = true;
      this.body.bounce.setTo(1,1);
    }
  }
});

module.exports = Cell;
