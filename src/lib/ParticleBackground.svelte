<script>
  import { onMount, onDestroy } from 'svelte';

  const CONFIG = {
    connectionDistance: 150,
    speed: 0.3,
    particleMinRadius: 2.5,
    particleMaxRadius: 4,
    lineOpacity: 0.45,
    particleOpacityMin: 0.35,
    particleOpacityMax: 0.7,
    primaryColor: [125, 245, 255],
    fps: 60,
  };

  let canvas;
  let ctx;
  let w = 0;
  let h = 0;
  let particleCount = CONFIG.particleMinRadius; // set dynamically
  let particles = [];
  let animId;
  let lastTime = 0;
  const interval = 1000 / CONFIG.fps;

  function getParticleCount() {
    const area = w * h;
    // Scale particles by viewport size
    if (area < 500000) return 25;   // small mobile
    if (area < 1000000) return 40;  // tablet
    return 70;                       // desktop
  }

  function getSpeed() {
    if (w < 600) return 0.2;
    return CONFIG.speed;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      const s = getSpeed();
      this.vx = (Math.random() - 0.5) * s * 2;
      this.vy = (Math.random() - 0.5) * s * 2;
      this.radius =
        CONFIG.particleMinRadius +
        Math.random() * (CONFIG.particleMaxRadius - CONFIG.particleMinRadius);
      this.opacity =
        CONFIG.particleOpacityMin +
        Math.random() * (CONFIG.particleOpacityMax - CONFIG.particleOpacityMin);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -this.radius) this.x = w + this.radius;
      if (this.x > w + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = h + this.radius;
      if (this.y > h + this.radius) this.y = -this.radius;
    }

    draw() {
      const [r, g, b] = CONFIG.primaryColor;
      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.12})`;
      ctx.fill();
      // Core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function init() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
    particleCount = getParticleCount();
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const [r, g, b] = CONFIG.primaryColor;
    const maxDist = w < 600 ? 100 : CONFIG.connectionDistance;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = dx * dx + dy * dy; // skip sqrt, compare squared
        if (dist < maxDist * maxDist) {
          const d = Math.sqrt(dist);
          const alpha = Math.max((1 - d / maxDist) * CONFIG.lineOpacity, 0.05);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate(time) {
    animId = requestAnimationFrame(animate);
    const delta = time - lastTime;
    if (delta < interval) return;
    lastTime = time - (delta % interval);

    ctx.clearRect(0, 0, w, h);

    for (const p of particles) p.update();
    drawConnections();
    for (const p of particles) p.draw();
  }

  function onResize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
    const newCount = getParticleCount();
    if (newCount !== particles.length) {
      particles = [];
      for (let i = 0; i < newCount; i++) {
        particles.push(new Particle());
      }
    }
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    init();
    animId = requestAnimationFrame(animate);
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);
  });
</script>

<div class="particle-layer">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .particle-layer {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
