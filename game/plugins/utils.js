'use strict';

// Phaser Point Extensions
if (!Phaser.Point.prototype.limit) {
  Phaser.Point.prototype.limit = function(high, low) {
    high = high || null;
    low = low || null;
    if(high && this.getMagnitude() > high) {
      this.setMagnitude(high);
    }
    if(low && this.getMagnitude() < low) {
      this.setMagnitude(low);
    }

    return this;
  };
}

if (!Phaser.Point.prototype.scaleBy) {
  Phaser.Point.prototype.scaleBy = function(scalar) {
    this.multiply(scalar, scalar);
    return this;
  };
}
