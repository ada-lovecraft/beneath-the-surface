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
},{"./states/boot":16,"./states/gameover":17,"./states/menu":18,"./states/play":19,"./states/preload":20}],2:[function(require,module,exports){
'use strict';
var Introduction = require('../prefabs/introduction');
var Intros = require('./intros');
var IntroManager = function(game) {
  this.game = game;
  this.introQ = [];
  this.storage = JSON.parse(localStorage.getItem('intros')) || {};
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
  localStorage.setItem('intros', JSON.stringify(this.storage));
  intro = this.get(id);
  return new Introduction(this.game, intro);
};


IntroManager.prototype.get = function(id) {
  return Intros[id];
};

IntroManager.prototype.queue = function(id) {
  if(!this.storage[id] || this.storage[id].show !== false) {
    this.introQ.push(id);  
  }
  
};

Object.defineProperty(IntroManager.prototype, 'length', {
  get: function() {
    return this.introQ.length;
  }
});


module.exports = IntroManager;
},{"../prefabs/introduction":11,"./intros":3}],3:[function(require,module,exports){
'use strict';

var CommonCold = require('../prefabs/commonCold');
var Player = require('../prefabs/player');
var Oxygen = require('../prefabs/oxygen');
var Hemoglobin = require('../prefabs/hemoglobin');
var RedBloodCell = require('../prefabs/redBloodCell');

exports.whiteBloodCell = {
  id: 'whiteBloodCell',
  name: 'The White Blood Cell',
  description: 'The hero of our story',
  mechanics: 'Fast, agile, and loaded with antivirals. Kill the bad guys, protect the innocents, and be awesome.\n\nClick to shoot. WASD to move',
  color: 'white',
  spriteClass: Player
};

exports.commonCold = {
  id: 'commonCold',
  name: 'The Common Cold',
  description: 'The most annoying virus in the world',
  mechanics: 'Slow, dumb, and weak, the common cold will wander around and just generally make you annoyed.\n\nOne Shot. One Kill.',
  color: '#33d743',
  spriteClass: CommonCold
};

exports.oxygen = {
  id: 'oxygen',
  name: 'Oxygen',
  description: 'Your life\'s blood\'s life\'s blood',
  mechanics: 'Randomly floats by in the blood stream and is also released when a blood cell dies.\n\nReplenishes a damaged red blood cell\'s health',
  color: '#4e8cff',
  spriteClass: Oxygen
};
exports.hemo = {
  id: 'hemo',
  name: 'Hemoglobin',
  description: 'Mmm... Protein',
  mechanics: 'Released when you kill an attacking cell and will float away if you don\'t catch it\n\nCollect these to spawn more red blood cells.',
  color: '#c820ff',
  spriteClass: Hemoglobin
};

exports.redBloodCell = {
  id: 'redBloodCell',
  name: 'The Red Blood Cell',
  description: 'Great when they are in your body.\nGross when they aren\'t.',
  mechanics: 'These are your flock. Protect them. If they all die, so do you.\n\nWill attempt to run away from foreign bodies and will eat oxygen if damaged. Invulnerable for a time after taking damage.',
  color: '#fc8383',
  spriteClass: RedBloodCell
};
},{"../prefabs/commonCold":7,"../prefabs/hemoglobin":10,"../prefabs/oxygen":12,"../prefabs/player":13,"../prefabs/redBloodCell":15}],4:[function(require,module,exports){
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
  if (sides < 3) return;
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


module.exports = Utils;
},{}],5:[function(require,module,exports){
'use strict';
var Utils = require('../plugins/utils');
var Automata = function(game, x, y, options) {
  Phaser.Sprite.call(this, game, x,y);
  this.options = _.merge({}, Automata.defaultOptions, _.defaults);
  this.setOptions(options);

  this.radius = Math.sqrt(this.height * this.height + this.width + this.width) / 2;

  this.graphics = this.game.add.graphics(0,0);

  this.edges = null; // set automatically by setOptions setter method
  this.renderDebug = new Automata.debug(this.graphics);
  // initialize your prefab here
  
};

Automata.prototype = Object.create(Phaser.Sprite.prototype);
Automata.prototype.constructor = Automata;

Automata.prototype.update = function() {
  
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
          accel.scaleBy(behavior.strength);
          this.applyForce(accel);
          priority.continue = false;
        }
      }
    }, this);
    return priority.continue;
  }, this);


  

  if(this.options.game.rotateToVelocity) {
    this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
  }

  this.body.velocity.limit(this.options.forces.maxVelocity);
  if(this.options.game.debug) {
    this.renderDebug.velocity(this);
  }
};

Automata.prototype.applyForce = function(force, strength) {
  var velocity;
  force.limit(this.options.forces.maxForce);
  velocity = Phaser.Point.add(this.body.velocity, force);
  this.body.velocity.add(velocity.x, velocity.y);
};



/** Behaviors **/

Automata.prototype.seek = function(target, viewDistance, isSeeking) {
  isSeeking = typeof isSeeking === 'undefined' ? true : isSeeking;

  var steer = new Phaser.Point();

  var tpos, pos, desired, distance;

  viewDistance = viewDistance || this.options.seek.viewDistance;

  
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
          var m = Phaser.Math.mapLinear(distance,0, viewDistance,0, this.options.forces.maxVelocity);
          desired.scaleBy(m);
        } else {
          desired.scaleBy(this.options.forces.maxVelocity);
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
    if(target instanceof Phaser.Group || target instanceof Array) {
      target = this.getClosestInRange(target, viewDistance);
    }
    
    desired = Phaser.Point.subtract(target, this.position);
    if (desired.getMagnitude() < viewDistance) {
      desired.normalize();
    
      desired.multiply(-this.options.forces.maxVelocity, -this.options.forces.maxVelocity);

      steer = Phaser.Point.subtract(desired, this.body.velocity);
    }
    if(this.options.game.debug && isFleeing) {
      this.renderDebug.flee(this.position, target, viewDistance, steer.getMagnitude());  
    }
  }
  return steer;
};

Automata.prototype.pursue = function(target, viewDistance) {
  var steer = new Phaser.Point(),
      distance;
  if(!!target) {

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

  targets.forEach(function(target) {
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
    steer.multiply(this.options.forces.maxVelocity, this.options.forces.maxVelocity);
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
    sum.multiply(this.options.forces.maxVelocity, this.options.forces.maxVelocity);
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
  } 
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
  game: {
    wrapWorldBounds: true,
    rotateToVelocity: true,
    edgeWidth: 25,
    debug: false
  },
  forces: {
    maxVelocity: 100.0,
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

},{"../plugins/utils":4}],6:[function(require,module,exports){
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
    }, 
    game: {
      wrapWorldBounds: false
    }
  };
  

  Automata.call(this, game, x, y, options);
  Primative.call(this, game, x, y, size, this.cellColor);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.body.collideWorldBounds = true;
  this.body.bounce.setTo(1,1);

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
    if(this.options.game.wrapWorldBounds === false) {
      this.body.collideWorldBounds = true;
      this.body.bounce.setTo(1,1);
    }
  }
});

module.exports = Cell;

},{"./automata":5,"./primative":14}],7:[function(require,module,exports){
'use strict';
var Enemy = require('./enemy');
var Utils = require('../plugins/utils');
var CommonCold = function(game, x, y) {
  Enemy.call(this, game, x, y, 16, '#33d743',1);
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);
  
};

CommonCold.prototype = Object.create(Enemy.prototype);
CommonCold.prototype.constructor = CommonCold;

CommonCold.prototype.update = function() {
  Enemy.prototype.update.call(this);
  // write your prefab's specific update code here
  
};

CommonCold.prototype.createTexture = function() {
  this.bmd.clear();
  CommonCold.drawBody(this.bmd.ctx, this.size, this.color);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

CommonCold.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var lineColor = '#258c2f';
  ctx.lineWidth = lineWidth;
  ctx.fillStyle = color;
  ctx.strokeStyle = lineColor;
  
  ctx.beginPath();

  Utils.polygon(ctx, size/2, size/2, size/2 ,6,-Math.PI/2);
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  Utils.polygon(ctx, size/2, size/2, size/2 ,6,-Math.PI/2);
  ctx.stroke();
};

module.exports = CommonCold;

},{"../plugins/utils":4,"./enemy":9}],8:[function(require,module,exports){
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



},{"./primative":14}],9:[function(require,module,exports){
'use strict';
var Cell = require('./cell');

var Enemy = function(game, x, y, size, color, maxHealth) {
  color = color || '#88b25b';
  maxHealth = maxHealth || 1;
  Cell.call(this, game, x, y, size, color, maxHealth);

  this.deathSound = this.game.add.audio('enemyDeath');
};

Enemy.prototype = Object.create(Cell.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
  Cell.prototype.update.call(this);
};

Enemy.prototype.onKilled = function() {
  Cell.prototype.onKilled.call(this);
  this.deathSound.play();
};

module.exports = Enemy;

},{"./cell":6}],10:[function(require,module,exports){
'use strict';
var Primative = require('./primative');

var Hemoglobin = function(game, x, y) {
  Primative.call(this, game, x, y, 16, '#c820ff');
  this.anchor.setTo(0.5, 0.5);

  this.game.physics.arcade.enableBody(this);

  this.killSound = this.game.add.audio('hemoglobinPickup');
  // initialize your prefab here
  
  this.events.onKilled.add(this.onKilled, this);
  this.events.onRevived.add(this.onRevived, this);

};

Hemoglobin.prototype = Object.create(Phaser.Sprite.prototype);
Hemoglobin.prototype.constructor = Hemoglobin;

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
  this.killSound.play();
};

Hemoglobin.prototype.createTexture = function() {
  this.bmd.clear();
  Hemoglobin.drawBody(this.bmd.ctx, this.size, this.color);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Hemoglobin.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  // draw dumbell line
  ctx.strokeStyle = '#761397';
  ctx.fillStyle = color;
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

},{"./primative":14}],11:[function(require,module,exports){
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
  var descriptionStyle = {fill: 'white', font: 'italic 16px Audiowide'};
  var mechanicsStyle = {fill: 'white', font: '12px Audiowide', wordWrap: true, wordWrapWidth: 250};
  var closeStyle = {fill: 'white', font: '12px Audiowide'};

  var introText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  20, 'INTRODUCING:', introStyle);
  
  var titleText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  50, config.name, titleStyle);
  titleText.fill = config.color;


  

  var descriptionText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  100, '"' + config.description + '" ', descriptionStyle);
  var mechanicsText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  150, config.mechanics, mechanicsStyle);

  this.sprite = this.game.add.sprite(backdrop.x + 150 , backdrop.y + 50, this.spriteBMD);
  this.sprite.anchor.setTo(0.5, 0.5);

  this.graphics.lineStyle(2, 0xCCCCCC);
  this.graphics.moveTo(backdrop.x - backdrop.width / 2, backdrop.y - backdrop.height / 2 + 85);
  this.graphics.lineTo(backdrop.x + backdrop.width / 2, backdrop.y - backdrop.height / 2 + 85);

  var closeText = this.game.add.text(backdrop.x, backdrop.y + backdrop.height / 2 - 20, 'Spacebar to close', closeStyle);
  closeText.anchor.setTo(0.5);

  config.spriteClass.drawBody(this.spriteBMD.ctx, 128, config.color,1);

  this.spriteBMD.render();
  this.spriteBMD.refreshBuffer();

  this.add(backdrop);
  this.add(introText);
  this.add(titleText);
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

},{"../plugins/utils":4}],12:[function(require,module,exports){
'use strict';
var Primative = require('./primative');

var Oxygen = function(game, x, y) {
  Primative.call(this, game, x, y, 16, '#4ec3ff');
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

Oxygen.prototype.onRevived = function() {
  this.rotation = this.game.rnd.realInRange(0, 2 * Math.PI);
  this.body.velocity.x = this.game.rnd.integerInRange(-50,50);
  this.body.velocity.y = this.game.rnd.integerInRange(-50,50);
};

Oxygen.prototype.createTexture = function() {
  this.bmd.clear();

  Oxygen.drawBody(this.bmd.ctx, this.size, this.color);
  
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Oxygen.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  ctx.strokeStyle = '#4e8cff';
  ctx.fillStyle = color;

  ctx.beginPath();
  //create circle outline
  ctx.arc(size / 2 , size / 2, size/2 - size / 8, 0, 2 * Math.PI, false);
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

},{"./primative":14}],13:[function(require,module,exports){
'use strict';
var Primative = require('./primative');
var CrossHair = require('./crosshair');

var Player = function(game, x, y) {
  Primative.call(this, game, x, y, 32, 'white');
  this.anchor.setTo(0.5, 0.5);
  
  this.game.physics.arcade.enableBody(this);

  this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);

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
};

Player.prototype = Object.create(Primative.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  this.body.velocity.scaleBy(0);
  // movement
  if(this.leftKey.justPressed()) {
    this.body.velocity.x = -this.moveSpeed;
  }
  if(this.rightKey.justPressed()) {
    this.body.velocity.x = this.moveSpeed;
  }
  if(this.downKey.justPressed()) {
    this.body.velocity.y = this.moveSpeed;
  }
  if(this.upKey.justPressed()) {
    this.body.velocity.y = -this.moveSpeed;
  }

  if (this.game.input.activePointer.isDown) {
    this.fire();
  }
  this.crosshair.position = this.game.input.position;

  this.rotation += 0.05;
  
};

Player.prototype.fire = function() {
  if(this.fireTimer < this.game.time.now) {
    this.shootSound.play();
    var bullet = this.bullets.getFirstExists(false);

    if (!bullet) {
      bullet = new Primative(this.game, 0, 0, 4, '#925bb2');
      this.bullets.add(bullet);
    }
    bullet.reset(this.x, this.y);
    bullet.revive();
    this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed);
    this.fireTimer = this.game.time.now + this.fireRate;
  }
};

Player.prototype.createTexture = function() {
  this.bmd.clear();

  Player.drawBody(this.bmd.ctx, this.size, this.color, 1);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

Player.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;

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

},{"./crosshair":8,"./primative":14}],14:[function(require,module,exports){
'use strict';
var Primative = function(game, x, y, size, color ) {
  this.size = size;
  this.color = color;

  this.bmd = game.add.bitmapData(this.size, this.size);
  this.createTexture();
  Phaser.Sprite.call(this, game, x, y, this.bmd);

  // initialize your prefab here
};

Primative.prototype = Object.create(Phaser.Sprite.prototype);
Primative.prototype.constructor = Primative;

Primative.prototype.setColor = function(color) {
  this.color = color;
  this.createTexture();
};

Primative.prototype.createTexture = function() {
  this.bmd.clear();
  this.bmd.ctx.beginPath();
  this.bmd.ctx.rect(0,0,this.size,this.size);
  this.bmd.ctx.fillStyle = this.color;
  this.bmd.ctx.fill();
  this.bmd.ctx.closePath();
  this.bmd.render();
  this.bmd.refreshBuffer();
};

module.exports = Primative;

},{}],15:[function(require,module,exports){
'use strict';
var Cell = require('./cell');

var RedBloodCell = function(game, x, y, size, color, maxHealth) {
  color = color || '#fc8383';
  size = size || 16;
  maxHealth = maxHealth || 3;
  Cell.call(this, game, x, y, size, color, maxHealth);
  this.canBeDamaged = true;
  this.panicTween = null;
  this.ouchSound = this.game.add.audio('ouch');
  this.oxygenSound = this.game.add.audio('oxygenPickup');
  this.deathSound = this.game.add.audio('cellDeath');

  this.events.onRevived.add(this.onRevived, this);

};

RedBloodCell.prototype = Object.create(Cell.prototype);
RedBloodCell.prototype.constructor = RedBloodCell;

RedBloodCell.prototype.update = function() {
  Cell.prototype.update.call(this);
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
  if(this.options.evade.target && this.canBeDamaged) {
    this.game.physics.arcade.overlap(this, this.options.evade.target, this.takeDamage, null, this);  
  }
  this.game.physics.arcade.overlap(this, this.options.seek.target, this.oxygenPickup, null, this);

};

RedBloodCell.prototype.oxygenPickup = function(RedBloodCell, oxygen) {
  if(RedBloodCell.health < RedBloodCell.maxHealth) {
    oxygen.kill();
    RedBloodCell.health++;
    this.oxygenSound.play();
  }
};

RedBloodCell.prototype.takeDamage = function() {
  
  this.health--;
  if (this.health === 0) {
    this.kill();
    this.deathSound.play();
    this.healthHUD.bar.kill();
  } else {
    this.ouchSound.play();
    this.canBeDamaged = false;
    this.automataOptions = {
      evade: {
        enabled: false
      },
      flee: {
        enabled: true
      },
      forces: {
        maxVelocity: 300
      }
    };

    this.panicTween = this.game.add.tween(this).to({tint: 0x333333 }, 300, Phaser.Easing.Linear.NONE, true, 0, 5, true);
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
          maxVelocity: 100
        }
      };
    }, this);
  }
};

RedBloodCell.prototype.onRevived = function() {

};

RedBloodCell.prototype.createTexture = function() {
  this.bmd.clear();
  RedBloodCell.drawBody(this.bmd.ctx, this.size, this.color);
  this.bmd.render();
  this.bmd.refreshBuffer();
};

RedBloodCell.drawBody = function(ctx, size, color, lineWidth) {
  lineWidth = lineWidth || 1;
  var lineColor = '#9a0b0b';
  ctx.lineWidth = 2;
  ctx.fillStyle = color;
  ctx.strokeStyle = lineColor;
  console.log(size);
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

};

module.exports = RedBloodCell;

},{"./cell":6}],16:[function(require,module,exports){

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

},{}],17:[function(require,module,exports){

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

},{}],18:[function(require,module,exports){

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

},{}],19:[function(require,module,exports){

  'use strict';
  var Player = require('../prefabs/player');
  var CommonCold = require('../prefabs/commonCold');
  var RedBloodCell = require('../prefabs/redBloodCell');
  var Hemoglobin = require('../prefabs/hemoglobin');
  var Oxygen = require('../prefabs/oxygen');
  var IntroManager = require('../plugins/IntroManager');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.introManager = new IntroManager(this.game);

      this.score = 0;
      this.hemoCount = 0;
      this.hemoMax = 10;


      this.gamehud = Phaser.Plugin.HUDManager.create(this.game, this, 'gamehud');
      
      
      this.enemyhud = Phaser.Plugin.HUDManager.create(this.game, this, 'cellhud');
      
      this.friendlyhud = Phaser.Plugin.HUDManager.create(this.game, this, 'friendlyhud');

      var style = { font: '18px Audiowide', fill: '#ffffff', align: 'center'};

      this.scoreHUD = this.gamehud.addText(10, 10, 'Score: ', style, 'score', this);
      this.game.add.existing(this.scoreHUD.text);

      this.hemoTracker = this.gamehud.addBar(this.game.width - 160, 20, 300, 20, this.hemoMax, 'hemoCount', this, '#c820ff','#761397' );
      this.hemoTracker.bar.anchor.setTo(0.5, 0.5);
      this.hemoTracker.bar.alpha = 0.5;
      this.game.add.existing(this.hemoTracker.bar);

      var hemoLabel = this.game.add.text(this.hemoTracker.bar.x, this.hemoTracker.bar.y, 'HEMOGLOBINS', {fill:'#761397', font:'bold 14px Audiowide'});
      hemoLabel.anchor.setTo(0.5, 0.5);
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.oxygen = this.game.add.group();
      
      this.enemies = this.game.add.group();

      this.hemoglobins = this.game.add.group();
      
      this.friendlies = this.game.add.group();

      this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY, 16, 'white');
      this.game.add.existing(this.player);
      this.friendlies.add(this.player);

      this.intros = this.game.add.group();


      var i;
      for(i =0; i < 10; i++) {
        var enemy = new CommonCold(this.game, this.game.world.randomX, this.game.world.randomY, 16);
        this.enemies.add(enemy);
      }

      

      for(i = 0; i < 10; i++) {
        var friendly = new RedBloodCell(this.game, this.game.world.randomX, this.game.world.randomY, 16);
        this.friendlies.add(friendly);
      }

      for(i = 0; i < 10; i++ ){
        var oxygen = new Oxygen(this.game, this.game.world.randomX, this.game.world.randomY);
        oxygen.anchor.setTo(0.5, 0.5);
        this.oxygen.add(oxygen);
      }

      this.oxygen.callAll('onRevived');
        

      this.friendlies.setAll('automataOptions', {
        seek: {
          enabled: true,
          target: this.oxygen,
          viewDistance: 100,
        },
        evade: {
          enabled: true,
          target: this.enemies,
          strength: 1.0,
          viewDistance: 100,
        },
        flee:{
          target: this.enemies,
          strength: 1.0
        },
        game: {
          debug: false,
          wrapWorldBounds: false
        },
        forces: {
          maxVelocity: 200
        }
      });

      this.introManager.queue('whiteBloodCell');
      this.introManager.queue('redBloodCell');
      this.introManager.queue('oxygen');
      this.introManager.queue('hemo');
      this.introManager.queue('commonCold');
      
      

      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.A, Phaser.Keyboard.D]);
    },
    update: function() {
      if(this.introManager.length && !this.intros.getFirstExists(true)) {
        var intro = this.introManager.getNext();
        if(intro) {
          this.intros.add(intro);  
        }
      }
      this.game.physics.arcade.overlap(this.player.bullets, this.enemies, this.enemyHit, null, this);
      this.game.physics.arcade.overlap(this.player, this.hemoglobins, this.hemoglobinHit, null, this);
    },
    enemyHit: function(bullet, enemy) {
      bullet.kill();
      enemy.health--;
      if(enemy.health === 0) {
        enemy.kill();
        this.score++;
        var hemo = this.hemoglobins.getFirstExists(false);
        if(!hemo) {
          hemo = new Hemoglobin(this.game, 0,0);
          this.hemoglobins.add(hemo);
        }
        hemo.reset(enemy.x, enemy.y);
        hemo.revive();
      }
    },
    hemoglobinHit: function(player, hemo) {
      hemo.kill();
      this.hemoCount++;
      if(this.hemoCount === this.hemoMax) {
        this.hemoCount = 0;
        var bloodCell = this.friendlies.getFirstExists(false);
        if(!bloodCell) {
          bloodCell = new RedBloodCell(this.game, 0,0);
          this.friendlies.add(bloodCell);
        }
        var spawnLocation = new Phaser.Point(this.game.world.randomX, this.game.world.randomY);
        bloodCell.reset(spawnLocation.x, spawnLocation.y, bloodCell.maxHealth);
        bloodCell.revive();
        
      }
    }
  };
  
  module.exports = Play;
},{"../plugins/IntroManager":2,"../prefabs/commonCold":7,"../prefabs/hemoglobin":10,"../prefabs/oxygen":12,"../prefabs/player":13,"../prefabs/redBloodCell":15}],20:[function(require,module,exports){
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

    var preload = this;

    window.WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { 
      console.log('active');
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