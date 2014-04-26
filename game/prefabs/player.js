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
  // write your prefab's specific update code here
  
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

module.exports = Player;
