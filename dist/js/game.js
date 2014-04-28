(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'beneath-the-surface');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":24,"./states/gameover":25,"./states/menu":26,"./states/play":27,"./states/preload":28}],2:[function(require,module,exports){
'use strict';




var GameManager  = (function() {
  var _cache = {};
  var Cell = require('../prefabs/cell'); 
  var RedBloodCell = require('../prefabs/redBloodCell');
  var Player = require('../prefabs/player');
  var Hemoglobin = require('../prefabs/hemoglobin');
  var Oxygen = require('../prefabs/oxygen');
  var CommonCold = require('../prefabs/commonCold');
  var _friendlies = [RedBloodCell, Player];
  var _pickups = [Hemoglobin, Oxygen];
  var _enemies = [CommonCold];
  var GameStates = {
    ACTIVE: 1,
    PAUSED: 2
  };

  var _currentState = GameStates.ACTIVE;
  return {
    get: function(id) {
      return _cache[id];
    },
    set: function(id, obj) {
     _cache[id] = obj; 
    },
    add: function(id, obj) {
      if(!_cache.hasOwnProperty(id)) {
        _cache[id] = obj;
      } else {
        throw 'GameManager already contains: ' + id;
      }
    },
    types: function() {
      return _.union(_friendlies, _pickups, _enemies);
    }, 
    pause: function() {
      _currentState = GameStates.PAUSED;
    }, 
    unpause: function() {
      _currentState = GameStates.ACTIVE;
      _.each(_cache, function(item) {
        if(item instanceof Phaser.Group) {
          GameManager.restoreGroup(item);
        }
        else {
          if(item.restoreVelocity) {
            item.restoreVelocity();
          }
        }
      });
    },
    getCurrentState: function() {
      return _currentState;
    },
    restoreGroup: function(group) {
      group.forEachExists(function(item) {
        if(item.restoreVelocity) {
          item.restoreVelocity();
        }
      });
    },
    clearCache: function() {
      _cache = null;
      _cache = {};
    },
    states: GameStates
  };
})();

module.exports = GameManager;
},{"../prefabs/cell":9,"../prefabs/commonCold":11,"../prefabs/hemoglobin":15,"../prefabs/oxygen":19,"../prefabs/player":20,"../prefabs/redBloodCell":22}],3:[function(require,module,exports){
'use strict';
var Introduction = require('../prefabs/introduction');
var Intros = require('./intros');
var IntroManager = function(game) {
  this.game = game;
  this.introQ = [];
  this.storage = {}
};

IntroManager.prototype.getNext = function() {
  var q, id, intro;
  if(!this.length) {
    return null;
  }
  id = this.introQ.shift();
  
  if(!this.storage[id]) {
    this.storage[id] = {};
  }
  this.storage[id].show = false;
  intro = this.get(id);
  return new Introduction(this.game, intro);
};


IntroManager.prototype.get = function(id) {
  return Intros[id];
};

IntroManager.prototype.queue = function(id) {
  if((!this.storage.hasOwnProperty(id) || this.storage[id].show)  && !_.contains(this.introQ, id)) {
    this.introQ.push(id);  
  }
  
};

Object.defineProperty(IntroManager.prototype, 'length', {
  get: function() {
    return this.introQ.length;
  }
});


module.exports = IntroManager;
},{"../prefabs/introduction":18,"./intros":5}],4:[function(require,module,exports){
'use strict';

var CommonCold = require('../prefabs/commonCold');
var Influenza = require('../prefabs/influenza');
var SwineFlu = require('../prefabs/swineFlu');
var HPV = require('../prefabs/hpv');
var AIDS = require('../prefabs/aids');

var LevelManager  = (function() {
  var _levels = [
    {
      id: 1,
      tagline: 'I\'ve got you, under my skin...',
      respawnRate: 500,
      maxEnemies: 5,
      enemyTypes: [
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        }
      ],
      oxygenRate: 10000,
    },
    {
      id: 2,
      tagline: 'Flu Shots', 
      respawnRate: 300,
      maxEnemies: 20,
      enemyTypes: [
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        },
        {
          enemyClass: Influenza,
          id: 'influenza'
        }
      ],
      oxygenRate: 5000
    },
    {
      id: 3,
      tagline: 'Gettin\' Busy', 
      respawnRate: 300,
      maxEnemies: 10,
      enemyTypes: [
        {
          enemyClass: HPV,
          id: 'hpv'
        }
      ],
      oxygenRate: 3000
    },
    {
      id: 4,
      tagline: 'Flu Season', 
      respawnRate: 1000,
      maxEnemies: 20,
      enemyTypes: [
        {
          enemyClass: Influenza,
          id: 'influenza'
        },
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },

      ],
      oxygenRate: 2000
    },
    {
      id: 5,
      tagline: 'Flare Up', 
      respawnRate: 1000,
      maxEnemies: 10,
      enemyTypes: [
        {
          enemyClass: HPV,
          id: 'hpv'
        }
      ],
      oxygenRate: 1000
    },
    {
      id: 6,
      tagline: 'Infection', 
      respawnRate: 1200,
      maxEnemies: 30,
      enemyTypes: [
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },
        {
          enemyClass: HPV,
          id: 'hpv'
        },
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        },
      ],
      oxygenRate: 400
    },
    {
      id: 7,
      tagline: 'Philadelphia', 
      respawnRate: 500,
      maxEnemies: 10,
      enemyTypes: [
        {
          enemyClass: AIDS,
          id: 'aids'
        } 
      ],
      oxygenRate: 500
    },
    {
      id: 8,
      tagline: 'Epidemic', 
      respawnRate: 1200,
      maxEnemies: 20,
      enemyTypes: [ 
        {
          enemyClass: CommonCold,
          id: 'aids'
        },
        {
          enemyClass: Influenza,
          id: 'influenza'
        },
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },
        {
          enemyClass: HPV,
          id: 'hpv'
        },
      ],
      oxygenRate: 500
    },
    {
      id: 9,
      tagline: 'Full. Blown. AIDS.', 
      respawnRate: 200,
      maxEnemies: 10,
      enemyTypes: [
        {
          enemyClass: AIDS,
          id: 'aids'
        },
      ],
      oxygenRate: 300
    },
    {
      id: 10,
      tagline: 'Dead Man Walking', 
      respawnRate: 1000,
      maxEnemies: 10000,
      enemyTypes: [
        {
          enemyClass: AIDS,
          id: 'aids'
        },
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        },
        {
          enemyClass: Influenza,
          id: 'influenza'
        },
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },
        {
          enemyClass: HPV,
          id: 'hpv'
        },
      ],
      oxygenRate: 200
    },

  ];
  return { 
    get: function(id) {
      var possible = _.find(_levels, {'id': id});
      return possible;

    },
    levels: function() {
      return _levels;
    }
  };
})();


module.exports = LevelManager;
},{"../prefabs/aids":7,"../prefabs/commonCold":11,"../prefabs/hpv":16,"../prefabs/influenza":17,"../prefabs/swineFlu":23}],5:[function(require,module,exports){
'use strict';


var Player = require('../prefabs/player');
var RedBloodCell = require('../prefabs/redBloodCell');

var Oxygen = require('../prefabs/oxygen');
var Hemoglobin = require('../prefabs/hemoglobin');

var CommonCold = require('../prefabs/commonCold');
var Influenza = require('../prefabs/influenza');
var SwineFlu = require('../prefabs/swineFlu');
var HPV = require('../prefabs/hpv');
var AIDS = require('../prefabs/aids');
var Death = require('../prefabs/death');


exports.underMySkin = {
  id: 'underMySkin',
  name: 'Under My Skin',
  tagline: 'This best most awesome #LD48 entry ever.',
  description: 'You\'re a white blood cell trying to protect your host from viral invasions. You can\'t win. The game just goes on until you die.',
  mechanics: 'by @codevinsky',
  color: '#e7e871'
};
// friendlies
exports.whiteBloodCell = {
  id: 'whiteBloodCell',
  name: 'The White Blood Cell',
  tagline: 'The hero of our story',
  description: 'Fast, agile, and loaded with antivirals. Kill the bad guys, protect the innocents, and be awesome.',
  mechanics: 'Click to shoot. WASD or Arrow keys to move',
  color: '#ccc',
  spriteClass: Player
};

exports.redBloodCell = {
  id: 'redBloodCell',
  name: 'The Red Blood Cell',
  tagline: 'Great when they are in your body.\nGross when they aren\'t.',
  description: 'These are your flock. Foreign bodies will try to eat red blood cells, so you best protect them. They eat oxygen and try to run away from attackers',
  mechanics: 'If you get hit, a random one takes damage. If they all die, so do you.',
  color: RedBloodCell.COLOR,
  spriteClass: RedBloodCell
};


// pick ups
exports.oxygen = {
  id: 'oxygen',
  name: 'Oxygen',
  tagline: 'Your life\'s blood\'s life\'s blood',
  description: 'Randomly floats by in the blood stream and is also released when a blood cell dies.',
  mechanics: 'Replenishes a damaged red blood cell\'s health',
  color: Oxygen.COLOR,
  spriteClass: Oxygen
};
exports.hemo = {
  id: 'hemo',
  name: 'Hemoglobin',
  tagline: 'Mmm... Protein',
  description: 'Ocassionally released when you kill an attacking cell and will float away if you don\'t catch it',
  mechanics: 'Collect hemoglobin to spawn more red blood cells.',
  color: Hemoglobin.COLOR,
  spriteClass: Hemoglobin
};

// enemies
exports.commonCold = {
  id: 'commonCold',
  name: 'The Common Cold',
  tagline: 'The most annoying virus in the world',
  description: 'Slow, dumb, and weak, the common cold will wander around and just generally make you wish you didn\'t have to go to work today.',
  mechanics: 'One Shot. One Kill.',
  color: CommonCold.COLOR,
  spriteClass: CommonCold
};

exports.influenza = {
  id: 'influenza',
  name: 'Influenza',
  tagline: 'Say good bye to your weekend',
  description: 'More aggressive than the cold, this guy can put you on your ass for days. Will generally leave red blood cells alone unless they get in its way.',
  mechanics: 'Chases white blood cells.',
  color: Influenza.COLOR,
  spriteClass: Influenza
};

exports.swineFlu = {
  id: 'swineFlu',
  name: 'H1N1',
  tagline: 'Oink, oink, motherfucker!',
  description: 'Fast and unforgiving, the Swine Flu, will destroy everything you know and love. Hard to kill and aggressive.',
  mechanics: 'Chases red blood cells with a vengeance.',
  color: SwineFlu.COLOR,
  spriteClass: SwineFlu
};

exports.hpv = {
  id: 'hpv',
  name: 'HPV',
  tagline: 'It\'s ok, basically everyone has it',
  description: 'Dumb but hard to get rid of. It bounces around from place to place until one day it becomes a problem.',
  mechanics: 'Multiplies when killed.',
  color: HPV.COLOR,
  spriteClass: HPV
};

exports.aids = {
  id: 'aids',
  name: 'AIDS',
  tagline: 'Yeah... I went there.',
  description: 'Once it gets a hold, it never lets go.',
  mechanics: 'It chases everything and kills it. Never drops hemoglobin.',
  color: AIDS.COLOR,
  spriteClass: AIDS
};


exports.death = {
  id: 'death',
  name: 'DEATH',
  tagline: 'It was inevitable.',
  description: 'You\'re dead. You are no longer living. You have no more life.',
  mechanics: 'Game Over, man',
  color: 'white',
  spriteClass: Death
};



},{"../prefabs/aids":7,"../prefabs/commonCold":11,"../prefabs/death":13,"../prefabs/hemoglobin":15,"../prefabs/hpv":16,"../prefabs/influenza":17,"../prefabs/oxygen":19,"../prefabs/player":20,"../prefabs/redBloodCell":22,"../prefabs/swineFlu":23}],6:[function(require,module,exports){
'use strict';

// Phaser Point Extensions
if (!Phaser.Point.prototype.limit) {
  Phaser.Point.prototype.limit = function(high, low) {
    high = high || null;
    low = low || null;
    if(high && this.getMagnitude() > high) {
      this.setMagnitude(high);
    }
    if(low && this.getMagnitude() < low) {
      this.setMagnitude(low);
    }

    return this;
  };
}

if (!Phaser.Point.prototype.scaleBy) {
  Phaser.Point.prototype.scaleBy = function(scalar) {
    this.multiply(scalar, scalar);
    return this;
  };
}


var Utils = function() {};

Utils.hexToColorString = function(value) {
    if (typeof color === 'number') {
      //make sure our hexadecimal number is padded out
      return '#' + ('00000' + (color | 0).toString(16)).substr(-6);
    }
};

Utils.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
};

Utils.polygon =function(ctx, x, y, radius, sides, startAngle, anticlockwise) {
  if (sides < 3) {
    return;
  }
  var a = (Math.PI * 2)/sides;
  a = anticlockwise?-a:a;
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(startAngle);
  ctx.moveTo(radius,0);
  for (var i = 1; i < sides; i++) {
    ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
  }
  ctx.closePath();
  ctx.restore();
};

Utils.ellipseByCenter = function(ctx, cx, cy, w, h) {
  Utils.ellipse(ctx, cx - w/2.0, cy - h/2.0, w, h);
};
Utils.ellipse = function(ctx, x, y, w, h) {
  var kappa = 0.5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.restore();
};



module.exports = Utils;
},{}],7:[function(require,module,exports){
'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var AIDS = function(game, x, y, size) {
  var GameManager = require('../plugins/GameManager');
  this.size = size || AIDS.SIZE;
  Enemy.call(this, game, x, y, this.size, AIDS.COLOR, 3);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    enabled: true,
    pursue: {
      enabled: true,
      target: GameManager.get('friendlies'),
    },
    forces: {
      maxVelocity: 1000,
      maxForce: 100
    }
  };
  
  this.events.onKilled.add(this.onChildKilled, this);
  this.events.onRevived.add(this.onChildRevived, this);
};

AIDS.prototype = Object.create(Enemy.prototype);
AIDS.prototype.constructor = AIDS;

AIDS.SIZE = 32;
AIDS.COLOR = '#ffba00';
AIDS.ID = 'aids';
AIDS.HEMOCHANCE = 0.0;

AIDS.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
  }).bind(this));
  // write your prefab's specific update code here
  
};

AIDS.prototype.onChildKilled = function() {
};

AIDS.prototype.onChildRevived = function() {
  this.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
  this.body.velocity.y = this.game.rnd.integerInRange(-200, 200);
};



AIDS.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var lineColor = '#0b8f2d';
  var x = size/2,
  y = size/2,
  radius = size/3;


  //draw circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();

  ctx.fillStyle = AIDS.COLOR;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#bf00fe';
  ctx.strokeStyle = '#6a058b';
  ctx.lineWidth = lineWidth;

  for(var angle = 0; angle < 360; angle += 45) {
    var center = new Phaser.Point(radius * Math.cos(angle * Math.PI / 180) + x, radius * Math.sin(angle * Math.PI / 180) + y);
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius/3, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  

  /*
  //draw dots
  ctx.fillStyle = 'white'
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.3, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.3, size * 0.7, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.4, size * 0.4, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.4, size * 0.12, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.8, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();  

  */
  


};

module.exports = AIDS;

},{"../plugins/GameManager":2,"../plugins/utils":6,"./enemy":14}],8:[function(require,module,exports){
'use strict';
var Utils = require('../plugins/utils');
var Primative = require('./primative');
var Automata = function(game, x, y, size, color, options) {
  Primative.call(this, game, x, y, size, color);
  this.options = _.merge({}, Automata.defaultOptions, _.defaults);
  this.setOptions(options);

  this.radius = Math.sqrt(this.height * this.height + this.width + this.width) / 2;

  this.graphics = this.game.add.graphics(0,0);

  this.edges = null; // set automatically by setOptions setter method
  this.renderDebug = new Automata.debug(this.graphics);
  // initialize your prefab here
  
};

Automata.prototype = Object.create(Primative.prototype);
Automata.prototype.constructor = Automata;

Automata.prototype.update = function() {
    if(this.options.enabled) {
    // write your prefab's specific update code here
    if(this.options.game.debug) {
      this.renderDebug.clear();
    }
    var accel = new Phaser.Point();

    _.every(this.priorityList, function(priority) {
      priority.continue = true;
      _.each(priority, function(behavior) {
        if(behavior.enabled) {
          accel.setTo(0,0);
          accel = behavior.method.call(this, behavior.target, behavior.viewDistance);
          if(accel.getMagnitude() > 0) {
            this.applyForce(accel, behavior.strength);
            priority.continue = false;
          }
        }
      }, this);
      return priority.continue;
    }, this);


    

    if(this.options.game.rotateToVelocity) {
      this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    this.body.velocity.limit(this.options.forces.maxSpeed);
    if(this.options.game.debug) {
      this.renderDebug.velocity(this);
    }
  }
};

Automata.prototype.applyForce = function(force, strength) {
  var velocity;
  var limit = this.options.forces.maxForce * strength;
  force.limit(this.options.forces.maxForce * strength);
  velocity = Phaser.Point.add(this.body.velocity, force);
  this.body.velocity.add(velocity.x, velocity.y);
};



/** Behaviors **/

Automata.prototype.seek = function(target, viewDistance, isSeeking) {
  isSeeking = typeof isSeeking === 'undefined' ? true : isSeeking;

  var steer = new Phaser.Point();

  var tpos, pos, desired, distance;

  viewDistance = viewDistance || this.options.seek.viewDistance;

    if(target instanceof Function) {
      target = target();
    }
  
    if(target instanceof Phaser.Group || target instanceof Array) {
      target = this.getClosestInRange(target, viewDistance);
    }

    if(!!target) {
      

      if (target instanceof Phaser.Point) {
        tpos = target;
      } else {
        tpos = target.position;
      }

      pos = this.position;

      desired = Phaser.Point.subtract(tpos, pos);
      distance = desired.getMagnitude();

      if(distance > 0 && distance < viewDistance) {
        desired.normalize();
        if(isSeeking && this.options.seek.slowArrival && distance < this.options.seek.slowingRadius) {
          var m = Phaser.Math.mapLinear(distance,0, viewDistance,0, this.options.forces.maxSpeed);
          desired.scaleBy(m);
        } else {
          desired.scaleBy(this.options.forces.maxSpeed);
        }
        
        

        steer = Phaser.Point.subtract(desired, this.body.velocity);
      }
    }

  if(this.options.game.debug && isSeeking) {
    this.renderDebug.seek(this.position, tpos, viewDistance, steer.getMagnitude(), this.options.seek.slowingRadius, distance < this.options.seek.slowingRadius );  
  }

  return steer;
};

Automata.prototype.flee = function(target, viewDistance, isFleeing) {
  isFleeing = typeof isFleeing === 'undefined' ? true : isFleeing;
  viewDistance = viewDistance || this.options.flee.viewDistance;
  var steer = new Phaser.Point(), 
      desired;
  if(!!target) {
    if(target instanceof Function) {
      target = target();
    }
    if(target instanceof Phaser.Group || target instanceof Array) {
      target = this.getClosestInRange(target, viewDistance);
    }
    if (!!target) {
      desired = Phaser.Point.subtract(target, this.position);
      if (desired.getMagnitude() < viewDistance) {
        desired.normalize();
      
        desired.multiply(-this.options.forces.maxSpeed, -this.options.forces.maxSpeed);

        steer = Phaser.Point.subtract(desired, this.body.velocity);
      }
      if(this.options.game.debug && isFleeing) {
        this.renderDebug.flee(this.position, target, viewDistance, steer.getMagnitude());  
      }
    }
  }
  return steer;
};

Automata.prototype.pursue = function(target, viewDistance) {
  var steer = new Phaser.Point(),
      distance;
  if(!!target) {
    if(target instanceof Function) {
      target = target();
    }
    if(target instanceof Phaser.Group || target instanceof Array) {
      target = this.getClosestInRange(target, viewDistance);
    }
    if(!!target) {
      distance = Phaser.Point.distance(target, this.position);
      if(distance < viewDistance) {
        steer = this.seek(this.getFuturePosition(target), viewDistance, false);
      }
    }
  }

  if (this.options.game.debug) {
    this.renderDebug.pursue(this.position, !!target ? target.position : new Phaser.Point(), viewDistance, steer.getMagnitude());
  }

  return steer;
};

Automata.prototype.evade = function(target, viewDistance) {
  var steer = new Phaser.Point(),
    distance, targets, futurePosition;

  function comparator(a, b) {
    var da = Phaser.Point.distance(a, this.position);
    var db = Phaser.Point.distance(b, this.position);
    return da - db;
  }

  if(!!target) {
    if(target instanceof Function) {
      target = target();
    }
    if(target instanceof Phaser.Group || target instanceof Array) {
      targets = this.getAllInRange(target, viewDistance);
    } else {
      targets = [target];
    }

    targets.sort(comparator.bind(this));
    var targetCounter = 1;
    var totalDistance = 0;
    targets.forEach(function(t) {
      if (t) {
        distance = Phaser.Point.distance(t, this.position);
        steer = Phaser.Point.add(steer, this.flee(this.getFuturePosition(t), viewDistance, false).scaleBy(viewDistance / distance));
        totalDistance += distance;
        targetCounter++;
      }
    }, this);

    steer.divide(targetCounter, targetCounter);
    
  }

  if (this.options.game.debug) {
    this.renderDebug.evade(this.position, futurePosition ? [futurePosition] : targets, viewDistance, steer.getMagnitude());
  }
  return steer;
};

Automata.prototype.wander = function() {
  this.options.wander.theta += this.game.rnd.realInRange(-this.options.wander.change, this.options.wander.change);

  var circleLocation, steer, circleOffset;

  circleLocation = this.body.velocity.clone();
  circleLocation.normalize();
  circleLocation.scaleBy(this.options.wander.distance * this.radius);

  circleOffset = new Phaser.Point(this.options.wander.radius * this.radius * Math.cos(this.options.wander.theta),
                                  this.options.wander.radius * this.radius * Math.sin(this.options.wander.theta));

  steer = Phaser.Point.add(circleLocation, circleOffset);

  return steer.scaleBy(this.options.wander.strength);
  
};

Automata.prototype.getAllInRange = function(targets, viewDistance) {
  var inRange = [], difference;

  targets.forEachExists(function(target) {
    difference = Phaser.Point.subtract(target.position, this.position);
    if(difference.getMagnitude() < viewDistance) {
      inRange.push(target);
    }
  }, this);

  return inRange;
};

Automata.prototype.getClosestInRange = function(targetGroup, viewDistance) {
  var closestTarget = null;
  var closestDistance = viewDistance;

  if(!targetGroup) {
    return null;
  }

  targetGroup.forEachExists(function(target) {
    if(target instanceof Phaser.Group) {
      target = this.getClosestInRange(target);
    }
    var d;
    d = this.position.distance(target.position);

    if(d < closestDistance) {
      closestDistance = d;
      closestTarget = target;
    }
  }, this);

  return closestTarget;
};

Automata.prototype.getFuturePosition = function(target) {
  var difference, distance, time, targetPosition,
      tpos = target.position, pos = this.position;

  difference = Phaser.Point.subtract(tpos, pos);
  distance = difference.getMagnitude();
  if (!!target.body.velocity.getMagnitude()) {
    time = distance / target.body.velocity.getMagnitude();
    targetPosition = Phaser.Point.multiply(target.body.velocity, new Phaser.Point(time,time));
    targetPosition.add(tpos.x, tpos.y);
  } else {
    targetPosition = tpos;
  }

  return targetPosition;
};


/** Flocking **/
Automata.prototype.flock = function() {
  var steer = new Phaser.Point();
  this.applyForce(this.separate());
  this.applyForce(this.align());
  this.applyForce(this.cohesion());
  return steer;
};

Automata.prototype.separate = function() {
  var steer = new Phaser.Point();
  var count = 0;

  this.options.flocking.flock.forEachExists(function(Automata) {
    var d = this.position.distance(Automata.position);

    if((d > 0) && (d < this.options.flocking.separation.desiredSeparation)) {
      var diff = Phaser.Point.subtract(this.position, Automata.position);
      diff.normalize();
      diff.divide(d,d);
      steer.add(diff.x,diff.y);
      count++;
    }
  }, this);

  if(count > 0) {
    steer.divide(count, count);
  }

  if(steer.getMagnitude() > 0) {
    steer.normalize();
    steer.multiply(this.options.forces.maxSpeed, this.options.forces.maxSpeed);
    steer.subtract(this.body.velocity.x, this.body.velocity.y);
    steer.setMagnitude(this.options.flocking.separation.strength);
  }

  return steer;
};

Automata.prototype.align = function() {
  var sum = new Phaser.Point();
  var steer = new Phaser.Point();
  var count = 0;
  this.options.flocking.flock.forEach(function(Automata) {
    var d = this.position.distance(Automata.position);
    if ((d > this.options.flocking.minDistance) && d < this.options.flocking.maxDistance) {
      sum.add(Automata.body.velocity.x, Automata.body.velocity.y);
      count++;
    }
  }, this);

  if (count > 0) {
    sum.divide(count, count);  

    sum.normalize();
    sum.multiply(this.options.forces.maxSpeed, this.options.forces.maxSpeed);
    steer = Phaser.Point.subtract(sum, this.body.velocity);
    steer.setMagnitude(this.options.flocking.alignment.strength);
  }

  return steer;
};

Automata.prototype.cohesion = function() {
  
  var sum = new Phaser.Point();
  var steer = new Phaser.Point();
  var count = 0;

  this.options.flocking.flock.forEach(function(Automata) {
    var d = Phaser.Point.distance(this.position, Automata.position);
    if ((d > 0) && d < this.options.flocking.maxDistance) {
      sum.add(Automata.position.x, Automata.position.y);
      count++;
    }
  }, this);

  if (count > 0) {
    sum.divide(count, count);  
    steer = Phaser.Point.subtract(sum, this.position);
    steer.normalize().setMagnitude(this.options.flocking.cohesion.strength);
    return steer;
    //return this.seek(sum)
  }
  return steer;
};






Automata.prototype.checkBounds = function() {
  var steer = new Phaser.Point();
  if(this.options.game.wrapWorldBounds === true) {
    if(this.position.x < this.edges.left ){
      this.position.x = this.game.width + this.radius;
    }
    if(this.position.y < this.edges.top ){
      this.position.y = this.game.height + this.radius;
    }
    if(this.position.x > this.edges.right ){
      this.position.x = -this.radius;
    }
    if(this.position.y > this.edges.bottom ){
      this.position.y = -this.radius;
    }
  } else {
    var desired = new Phaser.Point();

    if (this.position.x < this.options.game.edgeWidth) {
      desired = new Phaser.Point(this.options.forces.maxSpeed, this.body.velocity.y);
    } 
    else if (this.position.x > this.game.width - this.options.game.edgeWidth) {
      desired = new Phaser.Point(-this.options.forces.maxSpeed, this.body.velocity.y);
    } 

    if (this.position.y < this.options.game.edgeWidth) {
      desired = new Phaser.Point(this.body.velocity.x, this.options.forces.maxSpeed);
    } 
    else if (this.position.y > this.game.height - this.options.game.edgeWidth) {
      desired = new Phaser.Point(this.body.velocity.x, -this.options.game.edgeWidth);
    } 

    steer = desired;
  }
  return steer;
};

Automata.prototype.setOptions = function(options) {
  this._options = _.merge(this.options, options);
  this.priorityList = _.chain(this.options)
  .groupBy('priority')
  .map(function(element, key, obj) {
    obj[key].id = parseInt(key);
    return obj[key];
  }).value();

  this.priorityList.sort(function(a,b) {
    return a.id - b.id;
  });

  if(this.options.game.wrapWorldBounds === false) {
    this.edges = {
      left: this.options.game.edgeWidth,
      right: this.game.width - this.options.game.edgeWidth,
      top: this.options.game.edgeWidth,
      bottom: this.game.height - this.options.game.edgeWidth
    };
  } else {
    this.edges = {
      left: -this.radius,
      right: this.game.width + this.radius,
      top: -this.radius,
      bottom: this.game.height + this.radius
    };
  }
};


Automata.defaultOptions = Object.freeze({
  enabled: true,
  game: {
    wrapWorldBounds: true,
    rotateToVelocity: true,
    edgeWidth: 25,
    debug: false
  },
  
  forces: {
    maxSpeed: 100.0,
    maxForce: 100.0
  },
  checkBounds: {
    name: 'checkBounds',
    enabled: true,
    priority: 0,
    strength: 1,
    method: Automata.prototype.checkBounds
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
    priority: 1,
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
    priority: 1,
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
  },
  velocity: function(automata) {
    var line = new Phaser.Point(automata.x + automata.body.velocity.x, automata.y + automata.body.velocity.y)
    this.graphics.lineStyle(2, 0x000000,1);
    this.graphics.moveTo(automata.x, automata.y);
    this.graphics.lineTo(line.x, line.y);
    this.fill(0x000000,1, true, function() {
      this.graphics.drawCircle(line.x, line.y, 3);
    });
  },
  seek: function(position, target, viewDistance, active, slowingRadius, slowActive, color, alpha) {

    active = !!active;
    color = color || 0x89b7fd;
    alpha = alpha || 0.25;
    

    this.drawSensorRange(position, viewDistance, active, color, alpha);
    if (slowingRadius) {
      this.drawSensorRange(position, slowingRadius, slowActive, color, alpha);
    }
    if(active) {
      this.drawLineToTarget(position, target);
      this.setLabel(position, 'seeking', Phaser.Point.distance(position, target).toFixed(2), color, alpha);
    }

  },
  pursue: function(position, target, viewDistance, active, color, alpha) {

    active = !!active;
    color = color || 0x89fdbd;
    alpha = alpha || 0.25;
    

    this.drawSensorRange(position, viewDistance, active, color, alpha);
    if(active) {
      this.drawLineToTarget(position, target);
      this.setLabel(position, 'pursuing', Phaser.Point.distance(position, target).toFixed(2), color, alpha);
    }

  },
  flee: function(position, target, viewDistance, active, color, alpha) {

    active = !!active;
    color = color || 0xfd89fc;
    alpha = alpha || 0.25;
  
    
    this.drawSensorRange(position, viewDistance, active, color, alpha);

    if(active) {
      this.drawLineToTarget(position, target);
      this.setLabel(position, 'fleeing', Phaser.Point.distance(position, target).toFixed(2), color, alpha);
    }
  },
  evade: function(position, targets, viewDistance, active, color, alpha) {

    active = !!active;
    color = color || 0xff0000;
    alpha = alpha || 0.25;
  
    
    this.drawSensorRange(position, viewDistance, active, color, alpha);

    if(active) {
      targets.forEach(function(target) {
        this.drawLineToTarget(position, target);  
      }, this);
      
      this.setLabel(position, 'evading', Phaser.Point.distance(position, targets[0]).toFixed(2), color, alpha);
    }
    
  },
  bounds: function(edgeWidth, active) {
    this.fill(0x999999, 1, active, function() {

      var x1 = edgeWidth;
      var x2 = this.game.width - edgeWidth;
      var y1 = edgeWidth;
      var y2 = this.game.height - edgeWidth;

      this.graphics.moveTo(x1,y1);
      this.graphics.lineTo(x2, y1);
      this.graphics.lineTo(x2, y2);
      this.graphics.lineTo(x1, y2);
      this.graphics.lineTo(x1,y1);
    });
  },
  drawSensorRange: function(position, viewDistance, active, color, alpha) {
    this.fill(color, alpha, active, function() {
      this.graphics.drawCircle(position.x, position.y, viewDistance);
    });
  },
  drawLineToTarget: function(position, target) {
    this.graphics.moveTo(position.x, position.y);
    this.graphics.lineTo(target.x, target.y);
  },
  fill: function(color, alpha, active, method) {
    this.graphics.lineStyle( 1, color, alpha);
    if(active) {
      this.graphics.beginFill(color, alpha);
    }
    method.call(this);
    if(active) {
      this.graphics.endFill();
    }
  },
  clear: function() {
    this.graphics.clear();
    this.actionLabel.setText('');
    this.distanceLabel.setText('');
  }
});

Automata.debug.constructor = Automata.debug;


module.exports = Automata;

},{"../plugins/utils":6,"./primative":21}],9:[function(require,module,exports){
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

Cell.prototype.restoreVelocity = function() {
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

},{"../plugins/GameManager":2,"./automata":8,"./cellParticle":10}],10:[function(require,module,exports){
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

},{"./primative":21}],11:[function(require,module,exports){
'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var CommonCold = function(game, x, y) {
  var GameManager = require('../plugins/GameManager');
  Enemy.call(this, game, x, y, CommonCold.SIZE, CommonCold.COLOR,1);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    forces: {
      maxVelocity: 50
    },
    wander: {
      enabled: true 
    },
    flee: {
      target: GameManager.get('player'),
      enabled: true,
      viewDistance: 200
    },
    game: {
      debug: false
    }
  };

  
};

CommonCold.prototype = Object.create(Enemy.prototype);
CommonCold.prototype.constructor = CommonCold;

CommonCold.SIZE = 16;
CommonCold.COLOR = '#33d743';
CommonCold.ID = 'commonCold';
CommonCold.HEMOCHANCE = 0.5;

CommonCold.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
  }).bind(this));
  // write your prefab's specific update code here
};



CommonCold.drawBody = function(ctx, size) {
  var lineWidth = 1;
  var lineColor = '#258c2f';
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = CommonCold.COLOR;
  ctx.strokeStyle = lineColor;
  
  ctx.beginPath();
  Utils.polygon(ctx, size/2, size/2, size/2 - ctx.lineWidth,6,-Math.PI/2);
  ctx.fill();
  ctx.stroke();
};

module.exports = CommonCold;

},{"../plugins/GameManager":2,"../plugins/utils":6,"./enemy":14}],12:[function(require,module,exports){
'use strict';

var Primative = require('./primative');

var CrossHair = function(game, x, y, size, color ) {
  Primative.call(this, game, x, y, size, color);
  this.anchor.setTo(0.5, 0.5);
};

CrossHair.prototype = Object.create(Primative.prototype);
CrossHair.prototype.constructor = CrossHair;

CrossHair.prototype.createTexture = function() {
  this.bmd.clear();
  this.bmd.ctx.beginPath();
  // create circle
  this.bmd.ctx.arc(this.size / 2 , this.size / 2, this.size / 2 - 2, 0, 2 * Math.PI, false);
  this.bmd.ctx.strokeStyle = this.color;
  this.bmd.ctx.lineWidth = 2;
  this.bmd.ctx.moveTo(this.size * 0.5 ,this.size * 0.25);
  this.bmd.ctx.lineTo(this.size * 0.5, this.size * 0.75);
  this.bmd.ctx.moveTo(this.size * 0.25, this.size * 0.5);
  this.bmd.ctx.lineTo(this.size * 0.75, this.size * 0.5);
  this.bmd.ctx.stroke();
  
  this.bmd.render();
  this.bmd.refreshBuffer();
};

module.exports = CrossHair;



},{"./primative":21}],13:[function(require,module,exports){
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

},{"./primative":21}],14:[function(require,module,exports){
'use strict';
var Cell = require('./cell');

var Enemy = function(game, x, y, size, color, maxHealth) {
  color = color || '#88b25b';
  maxHealth = maxHealth || 1;
  Cell.call(this, game, x, y, size, color, maxHealth);

  this.deathSound = this.game.add.audio('enemyDeath');
  this.damageSound = this.game.add.audio('enemyDamage');
  this.alive = false;
};

Enemy.prototype = Object.create(Cell.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(next) {
  Cell.prototype.update.call(this, next);
};

Enemy.prototype.onKilled = function() {
  Cell.prototype.onKilled.call(this);
  this.deathSound.play();
};

Enemy.prototype.damage = function(amount) {
  Cell.prototype.damage.call(this, amount);
  if(this.health > 0) {
    this.damageSound.play();
  }
};
module.exports = Enemy;

},{"./cell":9}],15:[function(require,module,exports){
'use strict';
var Primative = require('./primative');

var Hemoglobin = function(game, x, y) {
  Primative.call(this, game, x, y, Hemoglobin.SIZE, Hemoglobin.COLOR);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  
  // initialize your prefab here
  
  this.events.onKilled.add(this.onKilled, this);
  this.events.onRevived.add(this.onRevived, this);

};

Hemoglobin.prototype = Object.create(Phaser.Sprite.prototype);
Hemoglobin.prototype.constructor = Hemoglobin;

Hemoglobin.SIZE = 16;
Hemoglobin.COLOR = '#c820ff';
Hemoglobin.ID = 'hemoglobin';

Hemoglobin.prototype.update = function() {
  this.rotation += 0.1;
  // write your prefab's specific update code here
  
};


Hemoglobin.prototype.onRevived = function() {
  this.rotation = this.game.rnd.realInRange(0, 2 * Math.PI);
  this.body.velocity.x = this.game.rnd.integerInRange(-50,50);
  this.body.velocity.y = this.game.rnd.integerInRange(-50,50);
};

Hemoglobin.prototype.onKilled = function() {
};

Hemoglobin.prototype.createTexture = function() {
  this.bmd.clear();
  Hemoglobin.drawBody(this.bmd.ctx, this.size, this.color);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Hemoglobin.drawBody = function(ctx, size) {
  var lineWidth = lineWidth || 1;
  // draw dumbell line
  ctx.strokeStyle = '#761397';
  ctx.fillStyle = Hemoglobin.COLOR;
  ctx.lineWidth = lineWidth;
  
  
  ctx.beginPath();
  ctx.arc(size/2, size * 0.3, size/4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.arc(size/2, size * 0.7, size/4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  
  
};

module.exports = Hemoglobin;

},{"./primative":21}],16:[function(require,module,exports){
'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var HPV = function(game, x, y, size) {
  this.size = size || HPV.SIZE;
  Enemy.call(this, game, x, y, this.size, HPV.COLOR, 1);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    enabled: false
  };
  this.rotation = this.game.rnd.realInRange(0, 6 * Math.PI);
  this.events.onKilled.add(this.onChildKilled, this);
  this.events.onRevived.add(this.onChildRevived, this);
};

HPV.prototype = Object.create(Enemy.prototype);
HPV.prototype.constructor = HPV;

HPV.SIZE = 64;
HPV.COLOR = '#b300fe';
HPV.ID = 'hpv';
HPV.HEMOCHANCE = 0.5;

HPV.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
    this._velocityCache = this.body.velocity;
    this.rotation += 0.4;
  }).bind(this));
  // write your prefab's specific update code here
  
};

HPV.prototype.onChildKilled = function() {
  if (this.size > HPV.SIZE / 4) {
    var hpv1 = null;
    var hpv2 = null;
    this.parent.forEachDead(function(cell) {
      if(cell.constructor === HPV && cell.size === this.size / 2) {
        if(!hpv1) {
          hpv1 = cell;
        } else if(!hpv2) {
          hpv2 = cell;
        }
      }
    }, this);

    if(!hpv1) {
      hpv1 = new HPV(this.game, this.x, this.y, this.size / 2);
      this.parent.add(hpv1);
    } 
    if(!hpv2) {
      hpv2 = new HPV(this.game, this.x, this.y, this.size / 2);
      this.parent.add(hpv2);
    }
    hpv1.reset(this.x, this.y);
    hpv2.reset(this.x, this.y);
    hpv1.revive();
    hpv2.revive();
  }
};

HPV.prototype.onChildRevived = function() {
  this.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
  this.body.velocity.y = this.game.rnd.integerInRange(-200, 200);
};



HPV.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var outterColor = HPV.COLOR;
  var innerColor = '#6f079a';
  var lineColor = innerColor;
  var x = size/2,
  y = size/2,
  // Radii of the inner color glow.
  innerRadius = size/4,
  outerRadius = size/2,
  // Radius of the entire circle.
  radius = size/2 - lineWidth;

  var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
  gradient.addColorStop(0, innerColor); //inner color
  gradient.addColorStop(1, outterColor);

  //draw circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();

  ctx.fillStyle = gradient;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  
  ctx.fill();
  ctx.stroke();

  //draw dots
  ctx.fillStyle = 'white'
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.3, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.3, size * 0.7, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.4, size * 0.4, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(size * 0.4, size * 0.12, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(size * 0.7, size * 0.8, size * 0.05, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();  


  


};

module.exports = HPV;

},{"../plugins/utils":6,"./enemy":14}],17:[function(require,module,exports){
'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var Influenza = function(game, x, y) {
  var GameManager = require('../plugins/GameManager');
  Enemy.call(this, game, x, y, Influenza.SIZE, Influenza.COLOR, 2);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    forces: {
      maxVelocity: 100
    },
    wander: {
      enabled: true 
    },
    pursue: {
      enabled: true,
      target: GameManager.get('player'),
      viewDistance: this.game.width / 4
    },
    game: {
      debug: false
    }
  };

  this.body.setSize(this.size/2, this.size/2, this.size/4, this.size/4);
  
};

Influenza.prototype = Object.create(Enemy.prototype);
Influenza.prototype.constructor = Influenza;

Influenza.SIZE = 32;
Influenza.COLOR = '#2ad0e4';
Influenza.ID = 'influenza';
Influenza.HEMOCHANCE = 0.5;

Influenza.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
  }).bind(this));
  // write your prefab's specific update code here
  
};



Influenza.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var outterColor = Influenza.COLOR;
  var innerColor = '#2a82e4';
  var lineColor = innerColor;
  var x = size/2,
  y = size/2,
  // Radii of the inner color glow.
  innerRadius = size/8,
  outerRadius = size/4,
  // Radius of the entire circle.
  radius = size/4;

  var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
  gradient.addColorStop(0, innerColor); //inner color
  gradient.addColorStop(1, outterColor);


  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.closePath();

  ctx.fillStyle = gradient;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  
  ctx.fill();
  ctx.stroke();

  // draw lines
  //top
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.25);
  ctx.lineTo(size * 0.5, 0);
  ctx.closePath();
  ctx.stroke();

  //right
  ctx.beginPath();
  ctx.moveTo(size * 0.75, size * 0.5);
  ctx.lineTo(size, size * 0.5);
  ctx.closePath();
  ctx.stroke();

  //bottom
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.75);
  ctx.lineTo(size * 0.5, size);
  ctx.closePath();
  ctx.stroke();

  //left
  //ctx.beginPath();
  ctx.moveTo(size * 0.25, size * 0.5);
  ctx.lineTo(0, size * 0.5);
  ctx.closePath();
  ctx.stroke();
  


};

module.exports = Influenza;

},{"../plugins/GameManager":2,"../plugins/utils":6,"./enemy":14}],18:[function(require,module,exports){
'use strict';
var Utils = require('../plugins/utils');
var Introduction = function(game,  config) {
  Phaser.Group.call(this, game);
  this.backdropBMD = this.game.add.bitmapData(500, 300);
  this.drawBackground();
  
  this.spriteBMD = this.game.add.bitmapData(128, 128);
  

  this.closeBMD = this.game.add.bitmapData(16,16);
  this.drawClose();

  this.graphics = this.game.add.graphics(0,0);
  this.inTween = null;
  this.outTween = null;
  

  var backdrop = this.game.add.sprite(this.game.width / 2, 100, this.backdropBMD);
  backdrop.anchor.setTo(0.5, 0.5);
  backdrop.alpha = 0.75;
  
  var introStyle = { fill: 'white', font: '24px Audiowide' };
  var titleStyle = {fill: config.color, font: '24px Audiowide'};
  var taglineStyle = {fill: 'white', font: 'italic 16px Audiowide'};
  var descriptionStyle = {fill: 'white', font: '12px Audiowide', wordWrap: true, wordWrapWidth: 250};
  var mechanicsStyle = {fill: config.color, font: '16px Audiowide', wordWrap: true, wordWrapWidth: 250};
  var closeStyle = {fill: 'white', font: '12px Audiowide'};

  var introText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  20, 'INTRODUCING:', introStyle);
  
  var titleText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  50, config.name, titleStyle);
  titleText.fill = config.color;


  
  var taglineText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  100, '"' + config.tagline + '" ', taglineStyle);
  var descriptionText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  150, config.description, descriptionStyle);
  var mechanicsText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  225, config.mechanics, mechanicsStyle);

  this.sprite = this.game.add.sprite(backdrop.x + 150 , backdrop.y + 50, this.spriteBMD);
  this.sprite.anchor.setTo(0.5, 0.5);

  this.graphics.lineStyle(2, 0xCCCCCC);
  this.graphics.moveTo(backdrop.x - backdrop.width / 2, backdrop.y - backdrop.height / 2 + 85);
  this.graphics.lineTo(backdrop.x + backdrop.width / 2, backdrop.y - backdrop.height / 2 + 85);

  var closeText = this.game.add.text(backdrop.x, backdrop.y + backdrop.height / 2 - 20, 'Spacebar to close', closeStyle);
  closeText.anchor.setTo(0.5);
  
  if(config.spriteClass) {
    config.spriteClass.drawBody(this.spriteBMD.ctx, 128, config.color,1);
  }

  this.spriteBMD.render();
  this.spriteBMD.refreshBuffer();

  this.add(backdrop);
  this.add(introText);
  this.add(titleText);
  this.add(taglineText);
  this.add(descriptionText);
  this.add(mechanicsText);
  this.add(this.sprite);
  this.add(this.graphics);
  this.add(closeText);

  this.x = 0;
  this.y = this.game.height;

  this.closeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.closeKey.onDown.addOnce(this.close, this);
  this.inTween = this.game.add.tween(this).to({y: 100}, 500, Phaser.Easing.Back.Out, true);
};

Introduction.prototype = Object.create(Phaser.Group.prototype);
Introduction.prototype.constructor = Introduction;

Introduction.prototype.update = function() {
  
  this.sprite.rotation += 0.01;
  
};

Introduction.prototype.close = function() {
  this.outTween = this.game.add.tween(this).to({y: this.game.height}, 500, Phaser.Easing.Back.In, true);
  this.outTween.onComplete.add(function() { this.destroy(); }, this);
};

Introduction.prototype.drawBackground = function() {
  this.backdropBMD.ctx.fillStyle = '#333';
  this.backdropBMD.ctx.strokeStyle = '#000';
  this.backdropBMD.ctx.lineWidth = 4;
  Utils.roundRect(this.backdropBMD.ctx, 2,2, this.backdropBMD.width - 4, this.backdropBMD.height - 4, 20, true, true);
  
  this.backdropBMD.render();
  this.backdropBMD.refreshBuffer();
};

Introduction.prototype.drawClose = function() {
  
  this.closeBMD.ctx.strokeStyle = '#ccc';
  this.closeBMD.ctx.lineWidth = 4;
  this.closeBMD.ctx.moveTo(0,0);
  this.closeBMD.ctx.lineTo(16,16);
  this.closeBMD.ctx.moveTo(0, 16);
  this.closeBMD.ctx.lineTo(16,0);
  this.closeBMD.ctx.stroke();
  this.closeBMD.render();
  this.closeBMD.refreshBuffer();
  
};
module.exports = Introduction;

},{"../plugins/utils":6}],19:[function(require,module,exports){
'use strict';
var Primative = require('./primative');

var Oxygen = function(game, x, y) {

  Primative.call(this, game, x, y, Oxygen.SIZE, Oxygen.COLOR);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  

  // initialize your prefab here
  
  this.events.onRevived.add(this.onRevived, this);
  
};

Oxygen.prototype = Object.create(Phaser.Sprite.prototype);
Oxygen.prototype.constructor = Oxygen;

Oxygen.prototype.update = function() {
  
  // write your prefab's specific update code here
  this.rotation += 0.01;
  
};

Oxygen.SIZE = 16;
Oxygen.COLOR = '#4ec3ff';
Oxygen.ID = 'oxygen';

Oxygen.prototype.onRevived = function() {
  this.rotation = this.game.rnd.realInRange(0, 2 * Math.PI);
  this.position = new Phaser.Point(this.game.world.randomX, this.game.world.randomY);
  this.body.velocity.x = this.game.rnd.integerInRange(10,50);
  this.body.velocity.y = this.game.rnd.integerInRange(10,50);
  var flip = Math.random();
  
  if(flip < 0.25) {
    //spawn right
    this.position.x = this.game.width;
    this.body.velocity.x *= -1;
  } else if(flip < 0.5) {
    //spawn left
    this.position.x = 0;
  } else if(flip < 0.75) {
    //spawn top
    this.position.y = 0
  } else {
    //spawn bottom
    this.position.y = this.game.height;
    this.body.velocity.y *= -1;
  }
};

Oxygen.prototype.createTexture = function() {
  this.bmd.clear();

  Oxygen.drawBody(this.bmd.ctx, this.size, this.color);
  
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Oxygen.drawBody = function(ctx, size) {
  ctx.strokeStyle = '#4e8cff';
  ctx.fillStyle = Oxygen.COLOR;

  ctx.beginPath();
  //create circle outline
  ctx.arc(size / 2 , size / 2, size/2 - ctx.lineWidth, 0, 2 * Math.PI, false);
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  // create small circle on outside
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(size / 2, size / 8, size / 8, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.closePath();
  
};



module.exports = Oxygen;

},{"./primative":21}],20:[function(require,module,exports){
'use strict';
var Cell = require('./cell');
var CrossHair = require('./crosshair');
var Primative = require('./primative');

var Player = function(game, x, y) {
  this.GameManager = require('../plugins/GameManager');
  this.maxHealth = 16;
  Cell.call(this, game, x, y, Player.SIZE, Player.COLOR, this.maxHealth);
  this.automataOptions = {
    enabled: false
  };
  this.anchor.setTo(0.5, 0.5);
  
  this.game.physics.arcade.enableBody(this);

  this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.cursors = this.game.input.keyboard.createCursorKeys();

  this.moveSpeed = 400;
  this.bulletSpeed = 1000;

  this.bullets = this.game.add.group();
  this.bullets.enableBody = true;
  this.bullets.bodyType = Phaser.Physics.Arcade.Body;


  this.crosshair = new CrossHair(this.game, this.game.width/2, this.game.height/2, 32, '#33');
  this.game.add.existing(this.crosshair);

  this.shootSound = this.game.add.audio('playerShoot');
  this.body.collideWorldBounds = true;

  this.fireTimer = 0;
  this.fireRate = 200;
  this.alive = true;
};

Player.SIZE = 32;
Player.COLOR = 'white';
Player.ID = 'whiteBloodCell';

Player.prototype = Object.create(Cell.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  Cell.prototype.update.call(this, (function() {
    this.body.velocity.scaleBy(0);
    // movement
    if(this.leftKey.justPressed() || this.cursors.left.isDown) {
      this.body.velocity.x = -this.moveSpeed;
    }
    if(this.rightKey.justPressed() || this.cursors.right.isDown) {
      this.body.velocity.x = this.moveSpeed;
    }
    if(this.downKey.justPressed() || this.cursors.down.isDown) {
      this.body.velocity.y = this.moveSpeed;
    }
    if(this.upKey.justPressed() || this.cursors.up.isDown) {
      this.body.velocity.y = -this.moveSpeed;
    }

    if (this.game.input.activePointer.isDown) {
      this.fire();
    }
    this.crosshair.position = this.game.input.position;

    this.rotation += 0.05;
  }).bind(this));
};

Player.prototype.fire = function() {
  if(this.fireTimer < this.game.time.now) {
    this.shootSound.play('',0, this.GameManager.get('mute'));
    var bullet = this.bullets.getFirstExists(false);

    if (!bullet) {
      bullet = new Primative(this.game, 0, 0, 6, '#925bb2');
      this.bullets.add(bullet);
    }
    bullet.reset(this.x, this.y);
    bullet.revive();
    this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed);
    this.fireTimer = this.game.time.now + this.fireRate;
  }
};


Player.drawBody = function(ctx, size) {
  var color = Player.COLOR;

  // left circle
  ctx.arc(size *0.33 , size / 2, size / 4, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // right circle
  ctx.beginPath();
  ctx.arc(size * 0.66 , size / 2, size / 4, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // top circle
  ctx.beginPath();
  ctx.arc(size / 2 , size *0.33, size / 4, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // bottom circle
  ctx.beginPath();
  ctx.arc(size / 2 , size *0.66, size / 4, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

};

module.exports = Player;

},{"../plugins/GameManager":2,"./cell":9,"./crosshair":12,"./primative":21}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
'use strict';
var Cell = require('./cell');


var RedBloodCell = function(game, x, y, size, color, maxHealth) {
  this.GameManager = require('../plugins/GameManager');
  color = color || RedBloodCell.COLOR;
  size = size || RedBloodCell.SIZE;
  maxHealth = maxHealth || 3;
  Cell.call(this, game, x, y, size, color, maxHealth);

  this.canBeDamaged = true;
  this.panicTween = null;
  this.ouchSound = this.game.add.audio('ouch');
  this.oxygenSound = this.game.add.audio('oxygenPickup');
  this.deathSound = this.game.add.audio('cellDeath');
  this.alive = false;

  this.automataOptions = {
    seek: {
      target: (function() { return this.GameManager.get('oxygen'); }).bind(this),
      priority: 2,
      strength: 1.0,
      viewDistance: this.game.width
    },
    evade: {
      enabled: true,
      target: (function() { return this.GameManager.get('enemies');}).bind(this),
      strength: 1.0,
      viewDistance: 100,
      priority: 1
    },
    flee: {
      target: (function() { return this.GameManager.get('enemies');}).bind(this),
      priority: 1
    },
    wander: {
      strength: 1.0,
      enabled: true
    },
    game: {
      debug: false,
      wrapWorldBounds: false
    },
    forces: {
      maxVelocity: 200
    }
  };


  this.events.onRevived.add(this.onRevived, this);
  this.alive = true;

};

RedBloodCell.prototype = Object.create(Cell.prototype);
RedBloodCell.prototype.constructor = RedBloodCell;

RedBloodCell.SIZE = 16;
RedBloodCell.COLOR = '#fc8383';
RedBloodCell.ID = 'redBloodCell';

RedBloodCell.prototype.update = function() {
  Cell.prototype.update.call(this, (function() {
    if(this.health === this.maxHealth && this.options.seek.enabled) {
      this.automataOptions = {
        seek: {
          enabled: false
        }
      };
    } else if (this.health < this.maxHealth && !this.options.seek.enabled) {
      this.automataOptions = {
        seek: {
          enabled: true
        }
      };
    }
    if(this.canBeDamaged) {
      this.game.physics.arcade.overlap(this, this.GameManager.get('enemies'), this.takeDamage, null, this);  
    }
    this.game.physics.arcade.overlap(this, this.GameManager.get('oxygen'), this.oxygenPickup, null, this);
  }).bind(this));

};

RedBloodCell.prototype.oxygenPickup = function(cell, oxygen) {
  if(this.health < this.maxHealth) {
    oxygen.kill();
    this.health++;
    this.oxygenSound.play();
    this.GameManager.get('player').health++;
  }
  if(this.health === this.maxHealth) {
    this.automataOptions = {
      seek: {
        enabled: false
      }
    };
  }
};

RedBloodCell.prototype.takeDamage = function() {
  
  this.GameManager.get('player').damage();
  this.health--;
  if (this.health === 0) {
    this.kill();
    this.deathSound.play();
    this.healthHUD.bar.kill();
  } else {
    this.ouchSound.play();
    this.canBeDamaged = false;
    this.automataOptions = {
      seek: {
        enabled: true
      },
      flee: {
        enabled: true,
      },
      evade: {
        enabled: false
      },
      forces: {
        maxVelocity: 400
      },
    };

    this.panicTween = this.game.add.tween(this).to({tint: 0x333333 }, 500, Phaser.Easing.Linear.NONE, true, 0, 5, true);
    this.panicTween.onComplete.add(function() {
      this.canBeDamaged = true;
      this.automataOptions = {
        evade: {
          enabled: true
        },
        flee: {
          enabled: false
        },
        forces: {
          maxVelocity: 200
        }
      };
    }, this);
  }
};




RedBloodCell.drawBody = function(ctx, size) {
  var color = RedBloodCell.COLOR;
  var lineColor = '#9a0b0b';
  ctx.lineWidth = 2;
  ctx.fillStyle = color;
  ctx.strokeStyle = lineColor;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2 - ctx.lineWidth, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

};

module.exports = RedBloodCell;

},{"../plugins/GameManager":2,"./cell":9}],23:[function(require,module,exports){
'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');


var SwineFlu = function(game, x, y) {
  var GameManager = require('../plugins/GameManager');
  Enemy.call(this, game, x, y, SwineFlu.SIZE, SwineFlu.COLOR, 3);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.automataOptions = {
    forces: {
      maxVelocity: 200
    },
    wander: {
      enabled: true 
    },
    pursue: {
      enabled: true,
      target: GameManager.get('friendlies'),
      viewDistance: this.game.width / 4
    },
    flocking: {
      enabled: false,
      flock: GameManager.get('swine')
    },
    game: {
      debug: false
    }
  };

  this.body.setSize(this.size/2, this.size/2, this.size/4, this.size/4);
  
};

SwineFlu.prototype = Object.create(Enemy.prototype);
SwineFlu.prototype.constructor = SwineFlu;

SwineFlu.SIZE = 32;
SwineFlu.COLOR = '#ff8af8';
SwineFlu.ID = 'swineFlu';
SwineFlu.HEMOCHANCE = 0.75;

SwineFlu.prototype.update = function() {
  Enemy.prototype.update.call(this, (function() {
  }).bind(this));
  // write your prefab's specific update code here
  
};



SwineFlu.drawBody = function(ctx, size) {
  ctx.strokeStyle = '#9a2c94';
  ctx.fillStyle = SwineFlu.COLOR;

  Utils.ellipseByCenter(ctx, size/2, size/2, size, size/2);
  ctx.fill();
  ctx.stroke();

  ctx.moveTo(size * 0.75, size * 0.5);
  ctx.beginPath();
  ctx.arc(size * 0.75, size * 0.5, size * 0.25, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  


};

module.exports = SwineFlu;

},{"../plugins/GameManager":2,"../plugins/utils":6,"./enemy":14}],24:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.stage.backgroundColor = '#ffcaca';
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],25:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {

    this.titleText = this.game.add.bitmapText(200, 100, 'minecraftia','Game Over\n',64);
    
    this.congratsText = this.game.add.bitmapText(320, 200, 'minecraftia','You win!',32);

    this.instructionText = this.game.add.bitmapText(330, 300, 'minecraftia','Tap to play again!',12);
    
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],26:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);


    this.titleText = this.game.add.bitmapText(200, 250, 'minecraftia','\'Allo, \'Allo!',64);

    this.instructionsText = this.game.add.bitmapText(200, 400, 'minecraftia','Tap anywhere to play\n "Catch the Yeoman Logo"',24);
    this.instructionsText.align = 'center';
    
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],27:[function(require,module,exports){

  'use strict';
  var Player = require('../prefabs/player');
  var RedBloodCell = require('../prefabs/redBloodCell');
  var Hemoglobin = require('../prefabs/hemoglobin');
  var Oxygen = require('../prefabs/oxygen');
  var IntroManager = require('../plugins/IntroManager');
  var LevelManager = require('../plugins/LevelManager');
  var GameManager = require('../plugins/GameManager');

  function Play() {}
  Play.prototype = {
    create: function() {
      // inits
      GameManager.clearCache();
      this.score = 0;
      this.hemoCount = 0;
      this.hemoMax = 10;
      this.maxBloodcells = 5;
      this.levelCount = 1;
      this.level = LevelManager.get(this.levelCount);
      this._levelCache = null;
      this.introManager = new IntroManager(this.game);
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      GameManager.add('volume',1);

      

      // timers
      this.respawnTimer = 0;
      this.oxygenTimer = 0;

      // background
      this.background = this.game.add.sprite(0,0);
      this.background.width = this.game.width;
      this.background.height = this.game.height;
      
      //filters
      this.plasma = this.game.add.filter('Plasma', this.game.width, this.game.height);
      this.plasma.size = 0.003;
      this.plasma.blueShift = 0.0;
      this.plasma.greenShift = 0.0;
      this.plasma.redShift = 0.3;
      this.plasma.alpha = 0.15;
      this.background.filters = [this.plasma];

      

      
      // huds
      this.gamehud = Phaser.Plugin.HUDManager.create(this.game, this, 'gamehud');
      this.enemyhud = Phaser.Plugin.HUDManager.create(this.game, this, 'cellhud');
      this.friendlyhud = Phaser.Plugin.HUDManager.create(this.game, this, 'friendlyhud');



      // trackers
      this.hemoTracker = this.gamehud.addBar(this.game.width - 160, 20, 300, 20, this.hemoMax, 'hemoCount', this, '#c820ff','#761397' );
      this.hemoTracker.bar.anchor.setTo(0.5, 0.5);
      this.hemoTracker.bar.alpha = 0.5;
      this.game.add.existing(this.hemoTracker.bar);
      this.hemoTracker.bar.visible = false;

      

      // labels
      var style = { font: '18px Audiowide', fill: '#ffffff', align: 'center', stroke: '#333', strokeThickness: 3};
      this.hemoLabel = this.game.add.text(this.hemoTracker.bar.x, this.hemoTracker.bar.y, 'HEMOGLOBINS', {fill:'#761397', font:'bold 14px Audiowide'});
      this.hemoLabel.anchor.setTo(0.5, 0.5);
      this.hemoLabel.visible = false;

      

      this.scoreHUD = this.gamehud.addText(10, 10, 'Score: ', style, 'score', this);
      this.game.add.existing(this.scoreHUD.text);

      

      var levelStyle = { font: '36px Audiowide', fill: '#ffffff', align: 'center', stroke: '#333', strokeThickness: 3};
      var taglineStyle = { font: '24px Audiowide', fill: '#ffffff', align: 'center', stroke: '#333', strokeThickness: 3};
      this.levelLabel = this.game.add.text(this.game.width, 0, 'LEVEL: ' + this.level.id, levelStyle);
      this.levelLabel.alpha = 0.5;
      this.levelTagline = this.game.add.text(this.game.width, 0, '' + this.level.id, taglineStyle);
      this.levelTagline.alpha = 0.5;

      this.pausedText = this.game.add.group();
      var pausedLabel = this.game.add.text(this.game.width/2, this.game.height * 0.25, 'PAUSED', {
        fill: 'white', 
        stroke:'black', 
        font:'bold 24px Audiowide', 
        strokeThickness: 3
      });
      pausedLabel.anchor.setTo(0.5);
      var continueLabel = this.game.add.text(this.game.width/2, this.game.height * 0.25 + 30, 'Press Space to continue', {
        fill: 'white', 
        stroke:'black', 
        font:'12px Audiowide',
        strokeThickness: 1
      });
      continueLabel.anchor.setTo(0.5);
      this.pausedText.add(pausedLabel);
      this.pausedText.add(continueLabel);
      this.pausedText.visible = false;
      

      

      // sprites
      this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY, 16, 'white');
      this.game.add.existing(this.player);
      

      // groups
      this.oxygen = this.game.add.group();
      this.enemies = this.game.add.group();
      this.hemoglobins = this.game.add.group();
      this.redBloodCells = this.game.add.group();
      this.intros = this.game.add.group();
      this.swine = this.game.add.group();

      this.redBloodCells.add(this.player);


      // game manager populator
      GameManager.add('player', this.player);
      GameManager.add('enemies', this.enemies);
      GameManager.add('friendlies', this.redBloodCells);
      GameManager.add('oxygen', this.oxygen);
      GameManager.add('swine', this.swine);
      // init red bloodcells
      var i;
      for(i = 0; i < this.maxBloodcells; i++) {
        var friendly = new RedBloodCell(this.game, this.game.world.randomX, this.game.world.randomY, 16);
        this.redBloodCells.add(friendly);
      }

      // introduction queue
      
      this.introManager.queue('underMySkin');
      this.introManager.queue('whiteBloodCell');
      this.introManager.queue('redBloodCell');
      this.introManager.queue('oxygen');
      this.introManager.queue('commonCold');
      

      // sounds
      this.pickupSound = this.game.add.audio('hemoglobinPickup');

      // controls
      this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.pauseKey.onDown.add(this.togglePause, this);

      this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
      this.pauseKey.onDown.add(this.toggleMute, this);
      
      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.A, Phaser.Keyboard.D]);

    },
    update: function() {
      this.plasma.update();
      if(this.introManager.length && !this.intros.getFirstExists(true)) {
          var intro = this.introManager.getNext();
          if (intro) {
            GameManager.pause();
            this.intros.add(intro);  
          }
        } 
      if (GameManager.getCurrentState() === GameManager.states.PAUSED) {
        this.pausedText.visible = true;
      } else {
        this.pausedText.visible = false;
          
          // spawn enemy
          if(this.respawnTimer < this.game.time.now && this.enemies.length < this.level.maxEnemies) {
            var reanimated = null;
            var targetEnemy = _.sample(this.level.enemyTypes);
            this.enemies.forEachDead(function(enemy) {
              if( targetEnemy.enemyClass.constructor === enemy.constructor) {
                reanimated = enemy;
                return false;
              }
            });
            if (!reanimated) {
              reanimated = new targetEnemy.enemyClass(this.game,0,0, targetEnemy.enemyClass.SIZE);
              this.enemies.add(reanimated);
            }

            reanimated.reset(this.game.world.randomX, this.game.world.randomY);
            reanimated.revive();
            this.introManager.queue(targetEnemy.id);
            this.respawnTimer = this.game.time.now + this.level.respawnRate;
          }

          // spawn oxygen
          if(this.oxygenTimer < this.game.time.now) {
            var oxygen = this.oxygen.getFirstExists(false);
            if(!oxygen) {
              oxygen = new Oxygen(this.game);
              this.oxygen.add(oxygen);
            }
            oxygen.revive();
            this.oxygenTimer = this.game.time.now + this.level.oxygenRate;
          }

          // show level label on new level
          if(this.level !== this._levelCache) {
            this.levelLabel.text = 'LEVEL: ' + this.level.id;
            this.levelTagline.text = this.level.tagline;
            this._levelCache = this.level;
            this.levelLabel.x = this.game.width;
            this.levelLabel.y = this.game.height / 2;
            this.levelTagline.x = this.game.width;
            this.levelTagline.y = this.game.height / 2 + 40;
            this.game.add.tween(this.levelLabel).to({x: -this.levelLabel.width}, 5000, Phaser.Easing.Linear.NONE, true);
            this.game.add.tween(this.levelTagline).to({x: -this.levelTagline.width}, 5000, Phaser.Easing.Linear.NONE, true);
            
          }

        // collisions  
        this.game.physics.arcade.overlap(this.player.bullets, this.enemies, this.enemyHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.hemoglobins, this.hemoglobinHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
      }
    },
    enemyHit: function(bullet, enemy) {
      bullet.kill();
      enemy.damage(1);
      if(enemy.health === 0) {
        enemy.kill();
        this.score++;
        //increase level
        if(this.level.maxEnemies <= this.enemies.countDead() && this.enemies.countLiving() === 0) {
          this.enemies.removeAll();
          this.levelCount++;
          this.level = LevelManager.get(this.levelCount);
        }
        if(this.redBloodCells.countLiving() - 1 < this.maxBloodcells && this.game.rnd.realInRange(0,1) < enemy.constructor.HEMOCHANCE) {
          this.hemoTracker.bar.visible = true;
          this.hemoLabel.visible = true;
          var hemo = this.hemoglobins.getFirstExists(false);
          if(!hemo) {
            hemo = new Hemoglobin(this.game, 0,0);
            this.hemoglobins.add(hemo);
          }
          this.respawnTimer = this.game.time.now + this.level.respawnRate;
          this.introManager.queue('hemo');
          hemo.reset(enemy.x, enemy.y);
          hemo.revive();
        }
      } else {

      }
    },
    hemoglobinHit: function(player, hemo) {
      if(this.redBloodCells.countLiving() - 1 < this.maxBloodcells) {
        hemo.kill();
        this.pickupSound.play('',0,GameManager.get('mute'));
        this.hemoCount++;
        if(this.hemoCount === this.hemoMax) {
          this.hemoCount = 0;
          var bloodCell = this.redBloodCells.getFirstExists(false);
          if(!bloodCell) {
            bloodCell = new RedBloodCell(this.game, 0,0);
            this.redBloodCells.add(bloodCell);
          }
          var spawnLocation = new Phaser.Point(this.game.world.randomX, this.game.world.randomY);
          bloodCell.reset(spawnLocation.x, spawnLocation.y, bloodCell.maxHealth);
          bloodCell.revive();
          player.health += bloodCell.health;
          
        }
      }
    },
    playerHit: function(player, enemy) {
      enemy.kill();
      console.log('player hit');
      
      if(this.redBloodCells.countLiving() > 1) {
        var friendly = null;
        var i = 0;
        while(friendly instanceof RedBloodCell === false || !friendly.exists) {
          friendly = this.redBloodCells.getAt(i);
          i++;
        }
        friendly.takeDamage();
      } else {
        player.kill();
        this.introManager.queue('death');
      }
    },
    togglePause: function() {
      if(!this.intros.getFirstExists(true)) {
        if(GameManager.getCurrentState() === GameManager.states.ACTIVE) {
          GameManager.pause();
        } else {
          GameManager.unpause();
        }
      }
    },
    toggleMute: function() {
      GameManager.set('mute', Number(!GameManager.get('mute')));
    }
  };
  
  module.exports = Play;
},{"../plugins/GameManager":2,"../plugins/IntroManager":3,"../plugins/LevelManager":4,"../prefabs/hemoglobin":15,"../prefabs/oxygen":19,"../prefabs/player":20,"../prefabs/redBloodCell":22}],28:[function(require,module,exports){
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
  this.fontReady = false;
}

Preload.prototype = {
  preload: function() {


    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    
    this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia.png', 'assets/fonts/minecraftia.xml');
    this.load.script('HudManager', 'js/plugins/HudManager.js');
    this.load.audio('ouch', 'assets/audio/ouch.wav');
    this.load.audio('oxygenPickup', 'assets/audio/oxygen-pickup.wav');
    this.load.audio('cellDeath', 'assets/audio/cell-death.wav');
    this.load.audio('enemyDeath', 'assets/audio/enemy-death.wav');
    this.load.audio('hemoglobinPickup', 'assets/audio/hemoglobin-pickup.wav');
    this.load.audio('playerDeath', 'assets/audio/player-death.wav');
    this.load.audio('playerShoot', 'assets/audio/player-shoot.wav');
    this.load.audio('enemyDamage', 'assets/audio/enemy-damage2.wav');
    this.load.script('plasma', 'js/plugins/Plasma.js');



    var preload = this;

    window.WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { 
      preload.game.time.events.add(Phaser.Timer.SECOND, preload.fontLoaded, preload); 
    },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Audiowide::latin']
    }



  };

  this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

  this.game.introductionStorage = localStorage.getItem('introductions');
  
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready && !!this.fontReady) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  },
  fontLoaded: function() {
    this.fontReady = true;
  }
};

module.exports = Preload;

},{}]},{},[1])