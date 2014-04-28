'use strict';

var CommonCold = require('../prefabs/commonCold');
var Influenza = require('../prefabs/influenza');
var SwineFlu = require('../prefabs/swineFlu');
var HPV = require('../prefabs/hpv');
var AIDS = require('../prefabs/aids');

var LevelManager  = (function() {
  var _levels = [
    {
      id: 1,
      tagline: 'I\'ve got you, under my skin...',
      score: 0,
      respawnRate: 500,
      maxEnemies: 5,
      enemyTypes: [
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        }
      ],
      oxygenRate: 10000,
    },
    {
      id: 2,
      tagline: 'Flu Shots', 
      score: 10,
      respawnRate: 300,
      maxEnemies: 20,
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
      oxygenRate: 5000
    },
    {
      id: 3,
      tagline: 'Gettin\' Busy', 
      score: 25,
      respawnRate: 300,
      maxEnemies: 30,
      enemyTypes: [
        {
          enemyClass: HPV,
          id: 'hpv'
        }
      ],
      oxygenRate: 3000
    },
    {
      id: 4,
      tagline: 'Flu Season', 
      score: 50,
      respawnRate: 300,
      maxEnemies: 20,
      enemyTypes: [
        {
          enemyClass: Influenza,
          id: 'influenza'
        },
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },

      ],
      oxygenRate: 2000
    },
    {
      id: 5,
      tagline: 'Flare Up', 
      score: 80,
      respawnRate: 200,
      maxEnemies: 60,
      enemyTypes: [
        {
          enemyClass: HPV,
          id: 'hpv'
        }
      ],
      oxygenRate: 1000
    },
    {
      id: 6,
      tagline: 'Infection', 
      score: 120,
      respawnRate: 300,
      maxEnemies: 30,
      enemyTypes: [
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },
        {
          enemyClass: HPV,
          id: 'hpv'
        },
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        },
      ],
      oxygenRate: 1000
    },
    {
      id: 7,
      tagline: 'Philadelphia', 
      score: 150,
      respawnRate: 300,
      maxEnemies: 10,
      enemyTypes: [
        {
          enemyClass: AIDS,
          id: 'aids'
        },
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        },
      ],
      oxygenRate: 500
    },
    {
      id: 8,
      tagline: 'Epidemic', 
      score: 170,
      respawnRate: 200,
      maxEnemies: 20,
      enemyTypes: [
        {
          enemyClass: CommonCold,
          id: 'aids'
        },
        {
          enemyClass: Influenza,
          id: 'flu'
        },
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },
        {
          enemyClass: HPV,
          id: 'hpv'
        },
      ],
      oxygenRate: 500
    },
    {
      id: 9,
      tagline: 'Full. Blown. AIDS.', 
      score: 200,
      respawnRate: 500,
      maxEnemies: 20,
      enemyTypes: [
        {
          enemyClass: AIDS,
          id: 'aids'
        },
      ],
      oxygenRate: 300
    },
    {
      id: 10,
      tagline: 'Dead Man Walking', 
      score: 210,
      respawnRate: 200,
      maxEnemies: 30,
      enemyTypes: [
        {
          enemyClass: AIDS,
          id: 'aids'
        },
        {
          enemyClass: CommonCold,
          id: 'commonCold'
        },
        {
          enemyClass: Influenza,
          id: 'flu'
        },
        {
          enemyClass: SwineFlu,
          id: 'swineFlu'
        },
        {
          enemyClass: HPV,
          id: 'hpv'
        },
      ],
      oxygenRate: 200
    },

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