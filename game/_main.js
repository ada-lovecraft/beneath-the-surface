'use strict';

//global variables
var <%= _.pluck(gameStates,'stateName').join(', ') %>, game;
window.onload = function () {
  game = new Phaser.Game(<%= gameWidth %>, <%= gameHeight %>, Phaser.AUTO, '<%= _.slugify(projectName) %>');

  WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, boot, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Codystar']
    }

};



  // Game States
  <% _.forEach(gameStates, function(gameState) {  %>
  game.state.add('<%= gameState.shortName %>', <%= gameState.stateName %>);
  <% }); %>

  function boot() {
    game.state.start('boot');
  }
};