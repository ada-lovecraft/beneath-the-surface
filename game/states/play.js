
  'use strict';
  var Player = require('../prefabs/player');
  var Enemy = require('../prefabs/enemy');
  var Friendly = require('../prefabs/friendly');
  var Primative = require('../prefabs/primative');
  function Play() {}
  Play.prototype = {
    create: function() {
      
      this.gamehud = Phaser.Plugin.HUDManager.create(this.game, this, 'gamehud');
      this.enemyhud = Phaser.Plugin.HUDManager.create(this.game, this, 'cellhud');
      this.friendlyhud = Phaser.Plugin.HUDManager.create(this.game, this, 'friendlyhud');
      
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY, 16, 'white');
      this.game.add.existing(this.player);

      this.oxygen = this.game.add.group();
      
      this.enemies = this.game.add.group();
      
      this.friendlies = this.game.add.group();
      
      var enemy = new Enemy(this.game, this.game.world.randomX, this.game.world.randomY, 16);

      this.enemies.add(enemy);

      var friendly = new Friendly(this.game, this.game.world.randomX, this.game.world.randomY, 16);
      this.friendlies.add(friendly);

      for(var i = 0; i < 10; i++ ){
        var oxygen = new Primative(this.game, this.game.world.randomX, this.game.world.randomY, 4, '#0e85e1');
        this.oxygen.add(oxygen);
      }

      this.friendlies.setAll('automataOptions', {
        seek: {
          enabled: true,
          target: this.oxygen,
          viewDistance: 100,
          slowArrival: true,
          slowingRadius: 50,
        },
        game: {
          debug: true
        },
        forces: {
          maxForce: 10
        }
      });
    },
    update: function() {
      this.game.physics.arcade.overlap(this.friendlies, this.oxygen, this.oxygenPickup, null, this);

    },
    oxygenPickup: function(friendly, oxygen) {
      if(friendly.health < friendly.maxHealth) {
        oxygen.kill();
        friendly.health++;
      }
    }
  };
  
  module.exports = Play;