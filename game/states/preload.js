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
    this.load.script('plasma', 'js/plugins/Plasma.js');


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
