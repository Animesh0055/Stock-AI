import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
      init();
    };
    window.addEventListener('resize', handleResize);

    class Star {
      x: number; y: number; z: number; size: number;
      twinkleSpeed: number;
      twinkleOpacity: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * width;
        this.size = this.z / width * 2 + 0.5;
        this.twinkleSpeed = Math.random() * 0.05;
        this.twinkleOpacity = Math.random();
      }
      update() {
        this.z -= 0.3;
        if (this.z < 1) {
          this.z = width;
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        }

        this.twinkleOpacity += this.twinkleSpeed;
        if (this.twinkleOpacity > 1 || this.twinkleOpacity < 0.2) {
            this.twinkleSpeed *= -1;
        }
      }
      draw() {
        const x = (this.x - width / 2) * (width / this.z) + width / 2;
        const y = (this.y - height / 2) * (width / this.z) + height / 2;
        const radius = this.size;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 230, 240, ${ (1 - this.z / width) * this.twinkleOpacity })`;
        ctx.fill();
      }
    }

    class Planet {
      x: number; y: number; radius: number; color: string; speedX: number; speedY: number;
      constructor() {
        this.radius = Math.random() * 50 + 20;
        this.x = Math.random() > 0.5 ? width + this.radius : -this.radius;
        this.y = Math.random() * height;
        this.color = `hsl(${240 + Math.random() * 60}, 50%, 15%)`;
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = (Math.random() - 0.5) * 0.05;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -this.radius || this.x > width + this.radius || this.y < -this.radius || this.y > height + this.radius) {
            this.x = Math.random() > 0.5 ? width + this.radius : -this.radius;
            this.y = Math.random() * height;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(this.x - this.radius/2, this.y - this.radius/2, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, `hsl(${240 + Math.random() * 60}, 50%, 25%)`);
        gradient.addColorStop(1, this.color);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    let stars: Star[] = [];
    let planets: Planet[] = [];

    function init() {
      stars = [];
      planets = [];
      for (let i = 0; i < 300; i++) stars.push(new Star());
      for (let i = 0; i < 7; i++) planets.push(new Planet());
    }

    let animationFrameId: number;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      planets.forEach(p => { p.update(); p.draw(); });
      stars.forEach(s => { s.update(); s.draw(); });
      animationFrameId = requestAnimationFrame(animate);
    }

    init();
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 -z-10 bg-gradient-hero"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
};

export default AnimatedBackground;
