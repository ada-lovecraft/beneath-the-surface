'use strict';
var Primative = require('./primative');
var Automata = require('./automata');
var Enemy = function(game, x, y, size, color) {
  color = color || '#88b25b';

  var options = {
    wander: {
      enabled: true
    }
  };

  Automata.call(this,game,x,y, options);
  Primative.call(this, game, x, y, size, color);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  
};

Enemy.prototype = Object.create(_.merge(Primative.prototype, Automata.prototype, _.defaults));
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Enemy;
