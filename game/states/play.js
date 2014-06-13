
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.bmd = this.game.make.bitmapData(100,100);
      this.makeTexture();
      this.sprite = this.game.add.sprite(this.game.width /2, this.game.height/2, this.bmd);
      this.sprite.anchor.setTo(0.5,0.5);
      this.origin = new Phaser.Point(this.game.width / 2, this.game.height / 2);
      
      this.rays = [];
      this.angleStep = 10 * Math.PI / 180;
      this.angleMin = 0;
      this.angleMax = Math.PI * 2;
      this.rayLength = 100;
      this.castRays();

    },
    update: function() {

    },
    render: function() {
      var ray, x, y;
      var offset = 25;
      for(var i = 0; i < this.rays.length; i++) {
        ray = this.rays[i];
        this.game.debug.geom(ray);
        x = this.origin.x + Math.sin(ray.angle) * (this.rayLength + offset);
        y = this.origin.y + Math.cos(ray.angle) * (this.rayLength + offset);
        this.game.debug.text(i, x, y);
      }
    },
    makeTexture: function() {
      var ctx = this.bmd.ctx;
      ctx.fillStyle = '#fff';
      ctx.arc(50,50,10,0, Math.PI * 2);
      ctx.fill();
      this.bmd.render();
      this.bmd.refreshBuffer();
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