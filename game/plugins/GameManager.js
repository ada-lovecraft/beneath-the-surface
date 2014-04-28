'use strict';




var GameManager  = (function() {
  var _cache = {};
  var Cell = require('../prefabs/cell'); 
  var RedBloodCell = require('../prefabs/redBloodCell');
  var Player = require('../prefabs/player');
  var Hemoglobin = require('../prefabs/hemoglobin');
  var Oxygen = require('../prefabs/oxygen');
  var CommonCold = require('../prefabs/commonCold');
  var _friendlies = [RedBloodCell, Player];
  var _pickups = [Hemoglobin, Oxygen];
  var _enemies = [CommonCold];
  var GameStates = {
    ACTIVE: 1,
    PAUSED: 2
  };

  var _currentState = GameStates.ACTIVE;
  return {
    get: function(id) {
      return _cache[id];
    },
    set: function(id, obj) {
     _cache[id] = obj; 
    },
    add: function(id, obj) {
      if(!_cache.hasOwnProperty(id)) {
        _cache[id] = obj;
      } else {
        throw 'GameManager already contains: ' + id;
      }
    },
    types: function() {
      return _.union(_friendlies, _pickups, _enemies);
    }, 
    pause: function() {
      _currentState = GameStates.PAUSED;
    }, 
    unpause: function() {
      _currentState = GameStates.ACTIVE;
      _.each(_cache, function(item) {
        if(item instanceof Phaser.Group) {
          GameManager.restoreGroup(item);
        }
        else {
          if(item.restoreVelocity) {
            item.restoreVelocity();
          }
        }
      });
    },
    getCurrentState: function() {
      return _currentState;
    },
    restoreGroup: function(group) {
      group.forEachExists(function(item) {
        if(item.restoreVelocity) {
          item.restoreVelocity();
        }
      });
    },
    clearCache: function() {
      _cache = null;
      _cache = {};
    },
    states: GameStates
  };
})();

module.exports = GameManager;