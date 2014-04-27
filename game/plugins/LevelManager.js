'use strict';

var CommonCold = require('../prefabs/commonCold');

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
        }
      ],
    },
    {
      score: 10,
      respawnRate: 1000,
      maxEnemies: 10,
      enemyTypes: [
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        }
      ],
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