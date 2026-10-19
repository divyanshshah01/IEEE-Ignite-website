"use client";

import React, { useEffect, useRef } from 'react';

export function FireEffectOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
      type: 'fire' | 'wheel';
      angle?: number;
      radius?: number;
      centerX?: number;
      centerY?: number;
      speed?: number;

      constructor(type: 'fire' | 'wheel', x: number, y: number, radius?: number, speed?: number) {
        this.type = type;
        this.x = x;
        this.y = y;
        
        if (type === 'fire') {
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = -Math.random() * 5 - 2; // Move up faster
          this.maxLife = Math.random() * 60 + 40;
          this.life = this.maxLife;
          this.size = Math.random() * 40 + 20; // Larger particles for fire
          const colors = [
            'rgba(255, 100, 0, opacity)',
            'rgba(255, 150, 0, opacity)',
            'rgba(255, 50, 0, opacity)'
          ];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        } else {
          // Wheel sparks
          this.centerX = x;
          this.centerY = y;
          this.radius = radius || 100;
          this.angle = Math.random() * Math.PI * 2;
          this.speed = speed || 0.1;
          this.maxLife = Math.random() * 20 + 20;
          this.life = this.maxLife;
          this.size = Math.random() * 10 + 2; // Small sparks
          this.color = 'rgba(255, 200, 50, opacity)';
          this.vx = 0;
          this.vy = 0;
        }
      }

      update() {
        if (this.type === 'fire') {
          this.x += this.vx;
          this.y += this.vy;
          this.size *= 0.96; // Shrink as it rises
        } else {
          // Move in a circle
          if (this.angle !== undefined && this.radius !== undefined && this.centerX !== undefined && this.centerY !== undefined && this.speed !== undefined) {
            this.angle += this.speed;
            
            // Add some jitter for realism
            const jitterR = this.radius + (Math.random() - 0.5) * 20;
            
            // Elliptical rotation to match perspective
            this.x = this.centerX + Math.cos(this.angle) * jitterR * 0.8;
            this.y = this.centerY + Math.sin(this.angle) * jitterR * 1.2;
            
            this.size *= 0.95;
          }
        }
        this.life--;
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.life <= 0 || this.size <= 0.5) return;
        
        const opacity = (this.life / this.maxLife);
        
        ctx.beginPath();
        
        if (this.type === 'fire') {
          // Create radial gradient for realistic fire smoke puff
          const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          grad.addColorStop(0, this.color.replace('opacity', `${opacity * 0.8}`));
          grad.addColorStop(0.4, this.color.replace('opacity', `${opacity * 0.4}`));
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = grad;
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sharp sparks for wheels
          ctx.fillStyle = this.color.replace('opacity', `${opacity}`);
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'orange';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    let particles: Particle[] = [];

    const animate = () => {
      // Dark trail effect instead of clearRect for smoother motion
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);
      
      // Screen blend mode for realistic fire overlapping
      ctx.globalCompositeOperation = 'screen';

      // Positions based on percentages to match background image scaling
      const headX = width * 0.55;
      const headY = height * 0.35;
      
      const frontTireX = width * 0.25;
      const frontTireY = height * 0.85;
      const frontTireRadius = width * 0.15;
      
      const backTireX = width * 0.85;
      const backTireY = height * 0.8;
      const backTireRadius = width * 0.12;

      // Spawn Fire (Head)
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle('fire', headX + (Math.random()-0.5)*50, headY + (Math.random()-0.5)*50));
      }

      // Spawn Wheel Sparks (Front)
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle('wheel', frontTireX, frontTireY, frontTireRadius, 0.15));
      }

      // Spawn Wheel Sparks (Back)
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle('wheel', backTireX, backTireY, backTireRadius, -0.15)); // Opposite spin for visual flair
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        
        if (p.life <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full opacity-80"
    />
  );
}
