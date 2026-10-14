'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  ph: number;
  a: number;
}

export function AuraParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let width = 0;
    let height = 0;

    const getThemeHue = () => {
      const theme = document.documentElement.dataset.theme;
      if (theme === 'danger') return 350;
      if (theme === 'violet') return 265;
      if (theme === 'gold') return 42;
      return 205; // Solo leveling electric blue default
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const particleCount = width < 600 ? 55 : 110;

    const spawn = (init = false): Particle => ({
      x: Math.random() * width,
      y: init ? Math.random() * (height - 10) : height + Math.random() * 20,
      r: 0.6 + Math.random() * 2.2,
      vy: 18 + Math.random() * 50,
      ph: Math.random() * 6.28,
      a: 0.25 + Math.random() * 0.7,
    });

    const particles: Particle[] = Array.from({ length: particleCount }, () => spawn(true));

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // Draw static embers for reduced motion
      const hue = getThemeHue();
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowBlur = 10;
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 65%, ${p.a * 0.6})`;
        ctx.shadowColor = `hsla(${hue}, 100%, 65%, 1)`;
        ctx.fill();
      });
      return () => window.removeEventListener('resize', resize);
    }

    let isVisible = true;
    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible) lastTime = performance.now();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = (now: number) => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const t = now / 1000;
      const hue = getThemeHue();

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowBlur = 10;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.vy * dt;
        p.x += Math.sin(t * 1.2 + p.ph) * 12 * dt;

        const life = 1 - (height - p.y) / (height * 0.85);

        if (life <= 0 || p.y < 0) {
          particles[i] = spawn(false);
          continue;
        }

        const alpha = p.a * life * life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const col = `hsla(${hue}, 100%, 65%, ${Math.max(0, alpha)})`;
        ctx.fillStyle = col;
        ctx.shadowColor = `hsla(${hue}, 100%, 65%, 0.9)`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <>
      {/* Background scratches */}
      <div className="scratched-overlay" />
      {/* Bottom aura blue glow band */}
      <div className="bottom-aura-band" />
      {/* Rising particles canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-5"
        style={{ width: '100%', height: '100%' }}
      />
    </>
  );
}
