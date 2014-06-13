(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'angular-math');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {

    this.titleText = this.game.add.bitmapText(200, 100, 'minecraftia','Game Over\n',64);
    
    this.congratsText = this.game.add.bitmapText(320, 200, 'minecraftia','You win!',32);

    this.instructionText = this.game.add.bitmapText(330, 300, 'minecraftia','Tap to play again!',12);
    
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);


    this.titleText = this.game.add.bitmapText(200, 250, 'minecraftia','\'Allo, \'Allo!',64);

    this.instructionsText = this.game.add.bitmapText(200, 400, 'minecraftia','Tap anywhere to play\n "Catch the Yeoman Logo"',24);
    this.instructionsText.align = 'center';
    
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.origin = new Phaser.Point(this.game.width / 2, this.game.height / 2);

      this.bmd = this.game.make.bitmapData(100,100);
      this.makeTexture();
      this.sprite = this.game.add.sprite(this.origin.x, this.origin.y, this.bmd);
      this.sprite.anchor.setTo(0.5);
      
      
      this.rays = [];
      this.angleStep = 10 * Math.PI / 180;
      this.angleMin = 0;
      this.angleMax = Math.PI * 2;
      this.rayLength = 100;
      this.castRays();

      this.polygon = this.game.make.bitmapData(this.rayLength * 2, this.rayLength * 2);
      this.makePolygon();
      this.fillSprite = this.game.add.sprite(this.origin.x, this.origin.y, this.polygon);
      this.fillSprite.anchor.setTo(0.5);
      this.showDebug = true;
      this.debugKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
      this.debugKey.onDown.add(function() {
        this.showDebug = !this.showDebug;
      }, this);

    },
    update: function() {

    },
    render: function() {
      if(this.showDebug) {
        var ray, x, y;
        var offset = 25;
        for(var i = 0; i < this.rays.length; i++) {
          ray = this.rays[i];
          this.game.debug.geom(ray);
          x = this.origin.x + Math.sin(ray.angle) * (this.rayLength + offset);
          y = this.origin.y + Math.cos(ray.angle) * (this.rayLength + offset);
          this.game.debug.text(i, x, y);
        }
      }
      this.game.debug.text('(D)ebug is: ' + (this.showDebug === true ? 'ON':'OFF'), 20, 20);
    },
    makeTexture: function() {
      var ctx = this.bmd.ctx;
      ctx.fillStyle = '#fff';
      ctx.arc(50,50,10,0, Math.PI * 2);
      ctx.fill();
      this.bmd.render();
      this.bmd.refreshBuffer();
    },
    makePolygon: function() {
      var ctx = this.polygon.ctx;
      var ray, x, y;
      ctx.fillStyle = '#999';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.translate(this.rayLength, this.rayLength);
      x = this.rays[0].end.x - this.origin.x;
      y = this.rays[0].end.y - this.origin.y;
      ctx.moveTo(x,y);
      for(var i = 1; i < this.rays.length; i++) {
        ray = this.rays[i];
        x = ray.end.x - this.origin.x;
        y = ray.end.y - this.origin.y;
        ctx.lineTo(x, y);
      }
      x = this.rays[0].end.x - this.origin.x;
      y = this.rays[0].end.y - this.origin.y;
      ctx.lineTo(x,y);
      ctx.stroke();
      ctx.fill();
      ctx.closePath();
      this.polygon.render();
      this.polygon.refreshBuffer();
    },
    castRays: function() {
      var ray, 
          x,
          y;

      for(var i = this.angleMin; i < this.angleMax - this.angleStep; i += this.angleStep) {
        x = this.origin.x + Math.sin(i) * this.rayLength;
        y = this.origin.y + Math.cos(i) * this.rayLength;
        ray = new Phaser.Line(this.origin.x, this.origin.y, x, y);
        this.rays.push(ray);
      }
    }
  };
  
  module.exports = Play;
},{}],6:[function(require,module,exports){
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
    this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia.png', 'assets/fonts/minecraftia.xml');


  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])