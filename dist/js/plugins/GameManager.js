'use strict';



var GameManager  = (function() {
  var _cache = {};
  var RedBloodCell = require('../prefabs/redBloodCell');
  var Player = require('../prefabs/player');
  var Hemoglobin = require('../prefabs/hemoglobin');
  var Oxygen = require('../prefabs/oxygen');
  var CommonCold = require('../prefabs/commonCold');
  var _friendlies = [RedBloodCell, Player];
  var _pickups = [Hemoglobin, Oxygen];
  var _enemies = [CommonCold];
  return {
    get: function(id) {
      return _cache[id];
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
    }
  };
})();

module.exports = GameManager;