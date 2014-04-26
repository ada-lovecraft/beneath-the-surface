
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