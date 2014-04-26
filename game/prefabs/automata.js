'use strict';

var Automata = function(game, x, y) {
  Phaser.Sprite.call(this, game, x,y);


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
  }
});


module.exports = Automata;
