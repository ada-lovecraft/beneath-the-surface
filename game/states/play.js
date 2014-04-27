
  'use strict';
  var Player = require('../prefabs/player');
  var RedBloodCell = require('../prefabs/redBloodCell');
  var Hemoglobin = require('../prefabs/hemoglobin');
  var Oxygen = require('../prefabs/oxygen');
  var Background = require('../prefabs/background');
  var IntroManager = require('../plugins/IntroManager');
  var LevelManager = require('../plugins/LevelManager');
  var GameManager = require('../plugins/GameManager');

  function Play() {}
  Play.prototype = {
    create: function() {
      this.score = 0;
      this.hemoCount = 0;
      this.hemoMax = 10;
      this.level = null;
      this.introManager = new IntroManager(this.game);

      this.level = LevelManager.get(this.score);


      this.respawnTimer = 0;
      this.background = this.game.add.sprite(0,0);
      this.background.width = this.game.width;
      this.background.height = this.game.height;
      
      this.plasma = this.game.add.filter('Plasma', this.game.width, this.game.height);
      this.plasma.size = 0.003;
      this.plasma.blueShift = 0.0;
      this.plasma.greenShift = 0.0;
      this.plasma.redShift = 0.3;
      this.plasma.alpha = 0.15;
      this.background.filters = [this.plasma];

      

      

      


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
      
      this.redBloodCells = this.game.add.group();

      this.player = new Player(this.game, this.game.world.centerX, this.game.world.centerY, 16, 'white');
      
      this.game.add.existing(this.player);
      this.redBloodCells.add(this.player);

      this.intros = this.game.add.group();

      GameManager.add('player', this.player);
      GameManager.add('enemies', this.enemies);
      GameManager.add('friendlies', this.friendlies);
      GameManager.add('oxygen', this.oxygen);
      var i;

      

      for(i = 0; i < 10; i++) {
        var friendly = new RedBloodCell(this.game, this.game.world.randomX, this.game.world.randomY, 16);
        this.redBloodCells.add(friendly);
      }

      for(i = 0; i < 10; i++ ){
        var oxygen = new Oxygen(this.game, this.game.world.randomX, this.game.world.randomY);
        oxygen.anchor.setTo(0.5, 0.5);
        this.oxygen.add(oxygen);
      }

      this.oxygen.callAll('onRevived');

      this.introManager.queue('whiteBloodCell');
      this.introManager.queue('redBloodCell');
      this.introManager.queue('oxygen');
      this.introManager.queue('hemo');
      this.introManager.queue('commonCold');

      this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.W, Phaser.Keyboard.S, Phaser.Keyboard.A, Phaser.Keyboard.D]);
      this.pickupSound = this.game.add.audio('hemoglobinPickup');
    },
    update: function() {
      this.plasma.update();
      

      if(this.introManager.length && !this.intros.getFirstExists(true)) {
        var intro = this.introManager.getNext();
        if(intro) {
          this.intros.add(intro);  
        }
      } else {
        if(this.respawnTimer < this.game.time.now && this.enemies.countLiving() < this.level.maxEnemies) {
          var reanimated = null;
          var targetEnemy = _.sample(this.level.enemyTypes);
          this.enemies.forEachDead(function(enemy) {
            if( targetEnemy.enemyClass.constructor === enemy.constructor) {
              reanimated = enemy;
              return false;
            }
          });
          if (!reanimated) {
            reanimated = new targetEnemy.enemyClass(this.game,0,0, 16);
            this.enemies.add(reanimated);
          }

          reanimated.reset(this.game.world.randomX, this.game.world.randomY);
          reanimated.revive();
          this.introManager.queue(targetEnemy.id);
          this.respawnTimer = this.game.time.now + this.level.respawnRate;
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
        this.level = LevelManager.get(this.score);
        var hemo = this.hemoglobins.getFirstExists(false);
        if(!hemo) {
          hemo = new Hemoglobin(this.game, 0,0);
          this.hemoglobins.add(hemo);
        }
        this.respawnTimer = this.game.time.now + this.level.respawnRate;
        hemo.reset(enemy.x, enemy.y);
        hemo.revive();
      }
    },
    hemoglobinHit: function(player, hemo) {
      hemo.kill();
      this.pickupSound.play();
      this.hemoCount++;
      if(this.hemoCount === this.hemoMax) {
        this.hemoCount = 0;
        var bloodCell = this.redBloodCells.getFirstExists(false);
        if(!bloodCell) {
          bloodCell = new RedBloodCell(this.game, 0,0);
          this.redBloodCells.add(bloodCell);
        }
        var spawnLocation = new Phaser.Point(this.game.world.randomX, this.game.world.randomY);
        bloodCell.reset(spawnLocation.x, spawnLocation.y, bloodCell.maxHealth);
        bloodCell.revive();
        
      }
    }
  };
  
  module.exports = Play;