'use strict';
var Introduction = require('../prefabs/introduction');
var Intros = require('./intros');
var IntroManager = function(game) {
  this.game = game;
  this.introQ = [];
  this.storage = JSON.parse(localStorage.getItem('intros')) || {};
};

IntroManager.prototype.getNext = function() {
  var q, id, intro;
  if(!this.length) {
    return null;
  }
  id = this.introQ.shift();
  
  if(!this.storage[id]) {
    this.storage[id] = {};
  }
  this.storage[id].show = false;
  localStorage.setItem('intros', JSON.stringify(this.storage));
  intro = this.get(id);
  return new Introduction(this.game, intro);
};


IntroManager.prototype.get = function(id) {
  return Intros[id];
};

IntroManager.prototype.queue = function(id) {
  if((!this.storage.hasOwnProperty(id) || this.storage[id].show)  && !_.contains(this.introQ, id)) {
    this.introQ.push(id);  
  }
  
};

Object.defineProperty(IntroManager.prototype, 'length', {
  get: function() {
    return this.introQ.length;
  }
});


module.exports = IntroManager;