'use strict';

var CommonCold = require('../prefabs/commonCold');
var Influenza = require('../prefabs/influenza');
var SwineFlu = require('../prefabs/swineFlu');

var LevelManager  = (function() {
  var _levels = [
    {
      score: 0,
      respawnRate: 500,
      maxEnemies: 5,
      enemyTypes: [
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        },
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },
        
      ],
      oxygenRate: 10000,
      id: 1
    },
    {
      score: 10,
      respawnRate: 1000,
      maxEnemies: 10,
      enemyTypes: [
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        },
        {
          enemyClass: Influenza,
          id: 'influenza'
        }
      ],
      oxygenRate: 5000,
      id: 2
    }
  ];
  return { 
    get: function(score) {
      var possible = _.filter(_levels, function(level) {
        return level.score <= score;
      });
      return _.last(possible);

    },
    levels: function() {
      return _levels;
    }
  };
})();


module.exports = LevelManager;