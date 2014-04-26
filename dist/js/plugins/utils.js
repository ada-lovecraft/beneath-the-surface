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


var Utils = function() {};

Utils.hexToColorString = function(value) {
    if (typeof color === 'number') {
      //make sure our hexadecimal number is padded out
      return '#' + ('00000' + (color | 0).toString(16)).substr(-6);
    }
};

Utils.roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == "undefined" ) {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }        
};

Utils.polygon =function(ctx, x, y, radius, sides, startAngle, anticlockwise) {
  if (sides < 3) return;
  var a = (Math.PI * 2)/sides;
  a = anticlockwise?-a:a;
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(startAngle);
  ctx.moveTo(radius,0);
  for (var i = 1; i < sides; i++) {
    ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
  }
  ctx.closePath();
  ctx.restore();
};


module.exports = Utils;