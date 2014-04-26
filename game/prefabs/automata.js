'use strict';
var Utils = require('../plugins/utils');
var Automata = function(game, x, y, options) {
  Phaser.Sprite.call(this, game, x,y);
  this.options = _.merge({}, Automata.defaultOptions, _.defaults);
  this.setOptions(options);

  this.radius = Math.sqrt(this.height * this.height + this.width + this.width) / 2;

  this.graphics = this.game.add.graphics(0,0);


  

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

  _.every(this.priorityList, function(priority) {
    priority.continue = true;
    _.each(priority, function(behavior) {
      var accel = new Phaser.Point();
      if(behavior.enabled) {
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



/** Behaviors **/

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
    if(target instanceof Phaser.Group) {
      target = this.getClosestInRange(target, viewDistance);
    }
    
    desired = Phaser.Point.subtract(target, this.position);
    if (desired.getMagnitude() < viewDistance) {
      desired.normalize();
    
      desired.multiply(-this.options.forces.maxVelocity, -this.options.forces.maxVelocity);

      steer = Phaser.Point.subtract(desired, this.body.velocity);
    }
    if(this.options.game.debug && isFleeing) {
      this.debug.renderFlee(this.position, target, viewDistance, steer.getMagnitude());  
    }
  }
  return steer;
};

Automata.prototype.pursue = function(target, viewDistance) {
  var steer = new Phaser.Point(),
      distance;
  if(!!target) {

    if(target instanceof Phaser.Group) {
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

    if(target instanceof Phaser.Group) {
      targets = [this.getClosestInRange(target, viewDistance)];
    } else {
      targets = [target];
    }

    targets.sort(comparator.bind(this));
    var targetCounter = 1;
    //targets = targets.slice(0,3);
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
  seek: function(position, target, viewDistance, active, slowingRadius, slowActive, color, alpha) {

    active = !!active;
    color = color || 0x89b7fd;
    alpha = alpha || 0.25;
    

    this.drawSensorRange(position, viewDistance, active, color, alpha);
    if (slowingRadius) {
      this.drawSensorRange(position, slowingRadius, slowActive, color, alpha)
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
