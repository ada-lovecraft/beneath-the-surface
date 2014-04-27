'use strict';


var Player = require('../prefabs/player');
var RedBloodCell = require('../prefabs/redBloodCell');

var Oxygen = require('../prefabs/oxygen');
var Hemoglobin = require('../prefabs/hemoglobin');

var CommonCold = require('../prefabs/commonCold');
var Influenza = require('../prefabs/influenza');
var SwineFlu = require('../prefabs/swineFlu');
// friendlies
exports.whiteBloodCell = {
  id: 'whiteBloodCell',
  name: 'The White Blood Cell',
  tagline: 'The hero of our story',
  description: 'Fast, agile, and loaded with antivirals. Kill the bad guys, protect the innocents, and be awesome.',
  mechanics: 'Click to shoot. WASD to move',
  color: '#ccc',
  spriteClass: Player
};

exports.redBloodCell = {
  id: 'redBloodCell',
  name: 'The Red Blood Cell',
  tagline: 'Great when they are in your body.\nGross when they aren\'t.',
  description: 'These are your flock. Foreign bodies will try to eat red blood cells, so you best protect them. They eat oxygen and try to run away from attackers',
  mechanics: 'If they all die, so do you.',
  color: RedBloodCell.COLOR,
  spriteClass: RedBloodCell
};


// pick ups
exports.oxygen = {
  id: 'oxygen',
  name: 'Oxygen',
  tagline: 'Your life\'s blood\'s life\'s blood',
  description: 'Randomly floats by in the blood stream and is also released when a blood cell dies.',
  mechanics: 'Replenishes a damaged red blood cell\'s health',
  color: Oxygen.COLOR,
  spriteClass: Oxygen
};
exports.hemo = {
  id: 'hemo',
  name: 'Hemoglobin',
  tagline: 'Mmm... Protein',
  description: 'Ocassionally released when you kill an attacking cell and will float away if you don\'t catch it',
  mechanics: 'Collect hemoglobin to spawn more red blood cells.',
  color: Hemoglobin.COLOR,
  spriteClass: Hemoglobin
};

// enemies
exports.commonCold = {
  id: 'commonCold',
  name: 'The Common Cold',
  tagline: 'The most annoying virus in the world',
  description: 'Slow, dumb, and weak, the common cold will wander around and just generally make you wish you didn\'t have to go to work today.',
  mechanics: 'One Shot. One Kill.',
  color: CommonCold.COLOR,
  spriteClass: CommonCold
};

exports.influenza = {
  id: 'influenza',
  name: 'Influenza',
  tagline: 'Say good bye to your weekend',
  description: 'More aggressive than the cold, this guy can put you on your ass for days. Will generally leave red blood cells alone unless they get in its way.',
  mechanics: 'Chases white blood cells.',
  color: Influenza.COLOR,
  spriteClass: Influenza
};

exports.swineFlu = {
  id: 'swineFlu',
  name: 'H1N1',
  tagline: 'Oink, oink, motherfucker!',
  description: 'Fast and unforgiving, the Swine Flu, will destroy everything you know and love. Hard to kill and aggressive.',
  mechanics: 'Chases red blood cells with a vengeance.',
  color: SwineFlu.COLOR,
  spriteClass: SwineFlu
};



