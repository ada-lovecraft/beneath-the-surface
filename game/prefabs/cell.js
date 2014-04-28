'use strict';
var Automata = require('./automata');
var CellParticle = require('./cellParticle');
var cellCounter = 0;

var Cell = function(game, x, y, size, color, maxHealth) {
  this.gm = require('../plugins/GameManager');
  size = size || 16;
  this.cellColor = color || 'white';
  this.maxHealth = maxHealth || 5;
  this.existsCache = true;
  this.alive = true;
  this._velocityCache = new Phaser.Point();
  
  
  var options = {
    game: {
      wrapWorldBounds: false
    }
  };

  Automata.call(this, game, x, y, size, this.cellColor, options);
  

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.body.collideWorldBounds = true;
  this.body.bounce.setTo(0.5,0.5);

  this.health = this.maxHealth;

  this.healthHUD = Phaser.Plugin.HUDManager.get('cellhud')
  .addBar(0,0, this.radius * 3, 2, this.maxHealth, 'health', this, Phaser.Plugin.HUDManager.HEALTHBAR, false);

  this.healthHUD.bar.anchor.setTo(0.5, 0.5);
  if(this.maxHealth === 1) {
    this.healthHUD.bar.kill();
  }
  this.game.add.existing(this.healthHUD.bar);

  
  this.id = cellCounter;
  this.label = null;
  cellCounter++;
  
  this.emitter = this.game.add.emitter(this.x, this.y, this.size);

  this.emitter.particleClass = CellParticle;

  this.emitter.makeParticles(this.constructor);
  this.emitter.maxParticleAlpha = 0.5;
  this.emitter.minParticleAlpha = 0.1;
  this.emitter.maxParticleScale = 1.5;
  this.emitter.minParticleScale = 0.5;
  this.emitter.maxParticleSpeed = new Phaser.Point(50,50);
  this.emitter.minPartleSpeed = new Phaser.Point(-50,-50);
  this.events.onKilled.add(this.onKilled, this);
  this.events.onRevived.add(this.onRevived, this);
  
};

Cell.prototype = Object.create(Automata.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.update = function(next) {
  if(this.gm.getCurrentState() === this.gm.states.ACTIVE) {
    if(this.exists) {
      Automata.prototype.update.call(this);
    }
    // write your prefab's specific update code here
    if(this.healthHUD.bar.exists) {
      this.healthHUD.bar.position.x = this.position.x;
      this.healthHUD.bar.position.y = this.position.y - this.radius * 1.5;
    }
    if(this.options.game.debug && this.exists) {
      Cell.debug.updateLabel(this);
    }

    this._velocityCache = this.body.velocity;

    if(next instanceof Function) {
      next();
    }
  } else {
    this.body.velocity.setTo(0);
  }
};

Cell.prototype.onKilled = function() {
  this.healthHUD.bar.kill();
  this.emitter.x = this.x;
  this.emitter.y = this.y;
  this.emitter.start(true, 500, 0, this.size);
  
  this.existsCache = false;
  if(this.options.game.debug) {
    Cell.debug.destroyLabels(this);
    this.renderDebug.clear();
  }
};

Cell.prototype.restore = function() {
  this.body.velocity = this._velocityCache;
};

Cell.prototype.damage = function(amount) {
  amount = amount || 1;
  this.health -= amount;
  if(this.health === 0) {
    this.kill();
  }
};

Cell.prototype.onRevived = function() {
  if(this.maxHealth > 1) {

    this.healthHUD.bar.revive();
  }
  this.health = this.maxHealth;
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
    if(this.options.game.wrapWorldBounds === false) {
      this.body.collideWorldBounds = true;
      this.body.bounce.setTo(1,1);
    }
  }
});

module.exports = Cell;
