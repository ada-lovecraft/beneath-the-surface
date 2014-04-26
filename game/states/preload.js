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
    this.load.script('HudManager', 'js/plugins/HudManager.js');
    this.load.audio('ouch', 'assets/audio/ouch.wav');
    this.load.audio('oxygenPickup', 'assets/audio/oxygen-pickup.wav');
    this.load.audio('cellDeath', 'assets/audio/cell-death.wav');
    this.load.audio('enemyDeath', 'assets/audio/enemy-death.wav');
    this.load.audio('hemoglobinPickup', 'assets/audio/hemoglobin-pickup.wav');
    this.load.audio('playerDeath', 'assets/audio/player-death.wav');
    this.load.audio('playerShoot', 'assets/audio/player-shoot.wav');


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
