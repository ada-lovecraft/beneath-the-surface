'use strict';

var CommonCold = require('../prefabs/commonCold');
var Player = require('../prefabs/player');
var Oxygen = require('../prefabs/oxygen');
var Hemoglobin = require('../prefabs/hemoglobin');
var RedBloodCell = require('../prefabs/redBloodCell');

exports.whiteBloodCell = {
  id: 'whiteBloodCell',
  name: 'The White Blood Cell',
  description: 'The hero of our story',
  mechanics: 'Fast, agile, and loaded with antivirals. Kill the bad guys, protect the innocents, and be awesome.\n\nClick to shoot. WASD to move',
  color: 'white',
  spriteClass: Player
};

exports.commonCold = {
  id: 'commonCold',
  name: 'The Common Cold',
  description: 'The most annoying virus in the world',
  mechanics: 'Slow, dumb, and weak, the common cold will wander around and just generally make you annoyed.\n\nOne Shot. One Kill.',
  color: '#33d743',
  spriteClass: CommonCold
};

exports.oxygen = {
  id: 'oxygen',
  name: 'Oxygen',
  description: 'Your life\'s blood\'s life\'s blood',
  mechanics: 'Randomly floats by in the blood stream and is also released when a blood cell dies.\n\nReplenishes a damaged red blood cell\'s health',
  color: '#4e8cff',
  spriteClass: Oxygen
};
exports.hemo = {
  id: 'hemo',
  name: 'Hemoglobin',
  description: 'Mmm... Protein',
  mechanics: 'Released when you kill an attacking cell and will float away if you don\'t catch it\n\nCollect these to spawn more red blood cells.',
  color: '#c820ff',
  spriteClass: Hemoglobin
};

exports.redBloodCell = {
  id: 'redBloodCell',
  name: 'The Red Blood Cell',
  description: 'Great when they are in your body.\nGross when they aren\'t.',
  mechanics: 'These are your flock. Protect them. If they all die, so do you.\n\nWill attempt to run away from foreign bodies and will eat oxygen if damaged. Invulnerable for a time after taking damage.',
  color: '#fc8383',
  spriteClass: RedBloodCell
};