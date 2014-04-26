'use strict';
var Utils = require('../plugins/utils');
var Automata = function(game, x, y, options) {
  Phaser.Sprite.call(this, game, x,y);

  this.options = _.merge(Automata.defaultOptions, options, _.defaults);

  this.graphics = this.game.add.graphics(0,0);

  this.priorityList = _.chain(this.options)
  .groupBy('priority')
  .map(function(element, key, obj) {
    obj[key].id = parseInt(key);
    return obj[key];
  }).value();

  this.priorityList.sort(function(a,b) {
    return a.id - b.id;
  });

  // initialize your prefab here
  
};

Automata.prototype = Object.create(Phaser.Sprite.prototype);
Automata.prototype.constructor = Automata;

Automata.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Automata.prototype.test = function() {
  console.log('test');
};


Automata.defaultOptions = Object.freeze({
  game: {
    wrapWorldBounds: true,
    rotateToVelocity: true,
    debug: false
  },
  forces: {
    maxVelocity: 100.0,
    steeringStrength: 0.5,
    maxForce: 100.0
  },
  flocking: {
    name: 'flocking',
    enabled: false,
    maxDistance: 200.0,
    minDistance: 50.0,
    separation: {
      strength: 1.0,
      desiredSeparation: 50.0
    },
    alignment: {
      strength: 1.0
    },
    cohesion: {
      strength: 1.0,
    },
    flock: null,
    priority: 3,
    method: Automata.prototype.flock
  },
  seek: {
    name: 'seek',
    enabled: false,
    target: null,
    strength: 1.0,
    slowArrial: false, 
    slowingRadius: 10,
    viewDistance: Number.MAX_VALUE,
    priority: 2,
    method: Automata.prototype.seek
  },
  flee: {
    name: 'flee',
    enabled: false,
    target: null,
    strength: 1.0,
    viewDistance: Number.MAX_VALUE,
    priority: 2,
    method: Automata.prototype.flee
  },
  pursue: {
    name: 'pursue',
    enabled: false,
    target: null,
    strength: 1.0,
    viewDistance: Number.MAX_VALUE,
    priority: 1,
    method: Automata.prototype.pursue
  },
  evade: {
    name: 'evade',
    enabled: false,
    intelligent: false,
    target: null,
    strength: 1.0,
    viewDistance: Number.MAX_VALUE,
    priority: 1,
    method: Automata.prototype.evade
  },
  wander: {
    name: 'wander',
    enabled: false,
    strength: 1.0,
    distance: 3.5,
    radius: 3.0,
    theta: 0,
    change: 0.3,
    priority: 6,
    method: Automata.prototype.wander
  }
});

Automata.debug = function(graphics) {
  this.graphics = graphics;

  this.game = this.graphics.game;

  this.actionLabel = this.game.add.text(0,0,'');
  this.actionLabel.anchor.setTo(0.5, 0.5);
  this.actionLabel.fontSize = 12;
  this.actionLabel.font = 'Helvetica';

  this.distanceLabel = this.game.add.text(0,0,'');
  this.distanceLabel.anchor.setTo(0.5, 0.5);
  this.distanceLabel.fontSize = 12;
  this.distanceLabel.font = 'Helvetica';

};

Automata.debug.prototype = Object.create({ 
  setLabel: function(position, text, distance, color, alpha) {
    color = Utils.hexToColorString(color);
    alpha = alpha || 1;

    this.actionLabel.x = position.x;
    this.actionLabel.y = position.y + 50;

    this.actionLabel.x = position.x;
    this.actionLabel.y = position.y + 65;


    this.actionLabel.setText(text);
    this.actionLabel.fill = color;
    this.actionLabel.alpha = alpha;

    this.distanceLabel.setText(distance);
    this.distanceLabel.fill = color;
    this.distanceLabel.alpha = alpha;
  }
});

module.exports = Automata;
