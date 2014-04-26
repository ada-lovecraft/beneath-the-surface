
  'use strict';
  var Player = require('../prefabs/player');
  var CommonCold = require('../prefabs/common-cold');
  var Friendly = require('../prefabs/friendly');
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

      

      for(i = 0; i < 0; i++) {
        var friendly = new Friendly(this.game, this.game.world.randomX, this.game.world.randomY, 16);
        this.friendlies.add(friendly);
      }

      for(i = 0; i < 10; i++ ){
        var oxygen = new Oxygen(this.game, this.game.world.randomX, this.game.world.randomY);
        oxygen.anchor.setTo(0.5, 0.5);
        this.oxygen.add(oxygen);
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

      this.introManager.queue('whiteBloodCell');
      this.introManager.queue('commonCold');
      this.introManager.queue('oxygen');

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
          bloodCell = new Friendly(this.game, 0,0);
          this.friendlies.add(bloodCell);
        }
        var spawnLocation = new Phaser.Point(this.game.world.randomX, this.game.world.randomY);
        bloodCell.reset(spawnLocation.x, spawnLocation.y, bloodCell.maxHealth);
        bloodCell.revive();
        
      }
    }
  };
  
  module.exports = Play;