
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