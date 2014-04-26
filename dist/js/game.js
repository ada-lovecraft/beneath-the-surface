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
},{"./states/boot":7,"./states/gameover":8,"./states/menu":9,"./states/play":10,"./states/preload":11}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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



},{"./primative":6}],4:[function(require,module,exports){
'use strict';
var Primative = require('./primative');
var Automata = require('./automata');
var Enemy = function(game, x, y, size, color) {
  color = color || '#88b25b';
  Automata.call(this,game,x,y);
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

},{"./automata":2,"./primative":6}],5:[function(require,module,exports){
'use strict';
var Primative = require('./primative');
var CrossHair = require('./crosshair');

var Player = function(game, x, y) {
  Primative.call(this, game, x, y, 16, 'white');
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

  this.game.input.onDown.add(this.fire, this);

  this.crosshair = new CrossHair(this.game, this.game.width/2, this.game.height/2, 32, '#33');
  this.game.add.existing(this.crosshair);
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

  this.crosshair.position = this.game.input.position;
  // write your prefab's specific update code here
  
};

Player.prototype.fire = function() {
  var bullet = this.bullets.getFirstExists(false);

  if (!bullet) {
    bullet = new Primative(this.game, 0, 0, 4, '#925bb2');
    this.bullets.add(bullet);
  }
  bullet.reset(this.x, this.y);
  bullet.revive();
  this.game.physics.arcade.moveToPointer(bullet, this.bulletSpeed);
};

module.exports = Player;

},{"./crosshair":3,"./primative":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){

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

},{}],8:[function(require,module,exports){

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

},{}],9:[function(require,module,exports){

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

},{}],10:[function(require,module,exports){

  'use strict';
  var Player = require('../prefabs/player');
  var Enemy = require('../prefabs/enemy');
  function Play() {}
  Play.prototype = {
    create: function() {
      
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY, 16, 'white');
      this.game.add.existing(this.player);

      this.enemies = this.game.add.group();
      var enemy = new Enemy(this.game, this.game.world.randomX, this.game.world.randomY, 16);
      this.enemies.add(enemy);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;
},{"../prefabs/enemy":4,"../prefabs/player":5}],11:[function(require,module,exports){
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia.png', 'assets/fonts/minecraftia.xml');


  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])