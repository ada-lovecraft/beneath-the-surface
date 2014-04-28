'use strict';
var Utils = require('../plugins/utils');
var Introduction = function(game,  config) {
  Phaser.Group.call(this, game);
  this.backdropBMD = this.game.add.bitmapData(500, 300);
  this.drawBackground();
  
  this.spriteBMD = this.game.add.bitmapData(128, 128);
  

  this.closeBMD = this.game.add.bitmapData(16,16);
  this.drawClose();

  this.graphics = this.game.add.graphics(0,0);
  this.inTween = null;
  this.outTween = null;
  

  var backdrop = this.game.add.sprite(this.game.width / 2, 100, this.backdropBMD);
  backdrop.anchor.setTo(0.5, 0.5);
  backdrop.alpha = 0.75;
  
  var introStyle = { fill: 'white', font: '24px Audiowide' };
  var titleStyle = {fill: config.color, font: '24px Audiowide'};
  var taglineStyle = {fill: 'white', font: 'italic 16px Audiowide'};
  var descriptionStyle = {fill: 'white', font: '12px Audiowide', wordWrap: true, wordWrapWidth: 250};
  var mechanicsStyle = {fill: config.color, font: '16px Audiowide', wordWrap: true, wordWrapWidth: 250};
  var closeStyle = {fill: 'white', font: '12px Audiowide'};

  var introText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  20, 'INTRODUCING:', introStyle);
  
  var titleText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  50, config.name, titleStyle);
  titleText.fill = config.color;


  
  var taglineText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  100, '"' + config.tagline + '" ', taglineStyle);
  var descriptionText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  150, config.description, descriptionStyle);
  var mechanicsText = this.game.add.text(backdrop.x - backdrop.width / 2 + 20, backdrop.y - backdrop.height / 2 +  225, config.mechanics, mechanicsStyle);

  this.sprite = this.game.add.sprite(backdrop.x + 150 , backdrop.y + 50, this.spriteBMD);
  this.sprite.anchor.setTo(0.5, 0.5);

  this.graphics.lineStyle(2, 0xCCCCCC);
  this.graphics.moveTo(backdrop.x - backdrop.width / 2, backdrop.y - backdrop.height / 2 + 85);
  this.graphics.lineTo(backdrop.x + backdrop.width / 2, backdrop.y - backdrop.height / 2 + 85);

  var closeText = this.game.add.text(backdrop.x, backdrop.y + backdrop.height / 2 - 20, 'Spacebar to close', closeStyle);
  closeText.anchor.setTo(0.5);
  
  if(config.spriteClass) {
    config.spriteClass.drawBody(this.spriteBMD.ctx, 128, config.color,1);
  }

  this.spriteBMD.render();
  this.spriteBMD.refreshBuffer();

  this.add(backdrop);
  this.add(introText);
  this.add(titleText);
  this.add(taglineText);
  this.add(descriptionText);
  this.add(mechanicsText);
  this.add(this.sprite);
  this.add(this.graphics);
  this.add(closeText);

  this.x = 0;
  this.y = this.game.height;

  this.closeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.closeKey.onDown.addOnce(this.close, this);
  this.inTween = this.game.add.tween(this).to({y: 100}, 500, Phaser.Easing.Back.Out, true);
};

Introduction.prototype = Object.create(Phaser.Group.prototype);
Introduction.prototype.constructor = Introduction;

Introduction.prototype.update = function() {
  
  this.sprite.rotation += 0.01;
  
};

Introduction.prototype.close = function() {
  this.outTween = this.game.add.tween(this).to({y: this.game.height}, 500, Phaser.Easing.Back.In, true);
  this.outTween.onComplete.add(function() { this.destroy(); }, this);
};

Introduction.prototype.drawBackground = function() {
  this.backdropBMD.ctx.fillStyle = '#333';
  this.backdropBMD.ctx.strokeStyle = '#000';
  this.backdropBMD.ctx.lineWidth = 4;
  Utils.roundRect(this.backdropBMD.ctx, 2,2, this.backdropBMD.width - 4, this.backdropBMD.height - 4, 20, true, true);
  
  this.backdropBMD.render();
  this.backdropBMD.refreshBuffer();
};

Introduction.prototype.drawClose = function() {
  
  this.closeBMD.ctx.strokeStyle = '#ccc';
  this.closeBMD.ctx.lineWidth = 4;
  this.closeBMD.ctx.moveTo(0,0);
  this.closeBMD.ctx.lineTo(16,16);
  this.closeBMD.ctx.moveTo(0, 16);
  this.closeBMD.ctx.lineTo(16,0);
  this.closeBMD.ctx.stroke();
  this.closeBMD.render();
  this.closeBMD.refreshBuffer();
  
};
module.exports = Introduction;
