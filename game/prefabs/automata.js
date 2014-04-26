'use strict';
var Utils = require('../plugins/utils');
var Automata = function(game, x, y, options) {
  Phaser.Sprite.call(this, game, x,y);
  this.options = _.merge({}, Automata.defaultOptions, _.defaults);
  this.setOptions(options);

  this.radius = Math.sqrt(this.height * this.height + this.width + this.width) / 2;

  this.graphics = this.game.add.graphics(0,0);


  

  this.debug = new Automata.debug(this.game.add.graphics(0,0));
  // initialize your prefab here
  
};

Automata.prototype = Object.create(Phaser.Sprite.prototype);
Automata.prototype.constructor = Automata;

Automata.prototype.update = function() {
  
  // write your prefab's specific update code here
  if(this.options.game.debug) {
    this.debug.clear();
  }

  _.every(this.priorityList, function(priority) {
    priority.continue = true;
    _.each(priority, function(behavior) {
      var accel = new Phaser.Point();
      if(behavior.enabled) {
        accel = behavior.method.call(this, behavior.target, behavior.viewDistance);
        if(accel.getMagnitude() > 0) {
          this.applyForce(accel);
          priority.continue = false;
        }
      }
    }, this);
    return priority.continue;
  }, this);

  if(this.options.game.wrapWorldBounds) {
    this.checkBounds();
  }

  if(this.options.game.rotateToVelocity) {
    this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
  }

  this.body.velocity.limit(this.options.forces.maxVelocity);
  this.body.acceleration.setTo(0,0);
};

Automata.prototype.applyForce = function(force) {
  var velocity;
  force.limit(this.options.forces.maxForce);
  velocity = Phaser.Point.add(this.body.velocity, force);
  this.body.velocity.add(velocity.x, velocity.y);
};


Automata.prototype.seek = function(target, viewDistance, isSeeking) {
  isSeeking = typeof isSeeking === 'undefined' ? true : isSeeking;

  var steer = new Phaser.Point();

  var tpos, pos, desired, distance;

  viewDistance = viewDistance || this.options.seek.viewDistance;

  
    if(target instanceof Phaser.Group) {
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
          desired.scaleBy(this.options.forces.maxVelocity * (distance / this.options.seek.slowingRadius));
        } else {
          desired.scaleBy(this.options.forces.maxVelocity);
        }

        steer = Phaser.Point.subtract(desired, this.body.velocity);
      }
    }
  return steer;
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
    var d;
    d = this.position.distance(target.position);

    if(d < closestDistance) {
      closestDistance = d;
      closestTarget = target;
    }
  }, this);

  return closestTarget;
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


Automata.prototype.checkBounds = function() {
  if(this.position.x < -this.radius ){
    this.position.x = this.game.width + this.radius;
  }
  if(this.position.y < -this.radius ){
    this.position.y = this.game.height + this.radius;
  }
  if(this.position.x > this.game.width + this.radius ){
    this.position.x = -this.radius;
  }
  if(this.position.y > this.game.height + this.radius ){
    this.position.y = -this.radius;
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
