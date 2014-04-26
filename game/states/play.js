
  'use strict';
  var Player = require('../prefabs/player');
  var CommonCold = require('../prefabs/common-cold');
  var Friendly = require('../prefabs/friendly');
  var Hemoglobin = require('../prefabs/hemoglobin');
  var Oxygen = require('../prefabs/oxygen');
  function Play() {}
  Play.prototype = {
    create: function() {
      this.score = 0;

      this.gamehud = Phaser.Plugin.HUDManager.create(this.game, this, 'gamehud');
      
      this.enemyhud = Phaser.Plugin.HUDManager.create(this.game, this, 'cellhud');
      
      this.friendlyhud = Phaser.Plugin.HUDManager.create(this.game, this, 'friendlyhud');

      var style = { font: '18px Arial', fill: '#ffffff', align: 'center'};
      this.scoreHUD = this.gamehud.addText(10, 10, 'Score: ', style, 'score', this);
      
      this.game.add.existing(this.scoreHUD.text);
      
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      

      this.oxygen = this.game.add.group();
      
      this.enemies = this.game.add.group();

      this.hemoglobins = this.game.add.group();
      
      this.friendlies = this.game.add.group();

      this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY, 16, 'white');
      this.game.add.existing(this.player);
      this.friendlies.add(this.player);

      var i;
      for(i =0; i < 10; i++) {
        var enemy = new CommonCold(this.game, this.game.world.randomX, this.game.world.randomY, 16);
        this.enemies.add(enemy);
      }

      

      for(i = 0; i < 0; i++) {
        var friendly = new Friendly(this.game, this.game.world.randomX, this.game.world.randomY, 16);
        this.friendlies.add(friendly);
      }

      for(i = 0; i < 10; i++ ){
        var oxygen = new Oxygen(this.game, this.game.world.randomX, this.game.world.randomY);
        oxygen.anchor.setTo(0.5, 0.5);
        this.oxygen.add(oxygen);
      }

      for(i = 0; i < 10; i++) {
        var hemo = new Hemoglobin(this.game, this.game.world.randomX, this.game.world.randomY);
        this.hemoglobins.add(hemo);
      }

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

      this.enemies.setAll('automataOptions', {
        pursue: {
          enabled: true,
          target: this.friendlies,
          viewDistance: 300
        },
        game: {
          debug: false,
          wrapWorldBounds: false
        },
        forces: {
          maxVelocity: 200
        }
      });
    },
    update: function() {
      this.game.physics.arcade.overlap(this.player.bullets, this.enemies, this.enemyHit, null, this);
    },
    enemyHit: function(bullet, enemy) {
      bullet.kill();
      enemy.health--;
      if(enemy.health == 0) {
        enemy.kill();
        this.score++;
      }
    }
    
  };
  
  module.exports = Play;