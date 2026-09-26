/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface FloatingHeartsProps {
  enabled: boolean;
}

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(244, 63, 94, ',   // rose-500
      'rgba(251, 113, 133, ', // rose-400
      'rgba(225, 29, 72, ',   // rose-600
      'rgba(244, 114, 182, ', // pink-400
      'rgba(217, 119, 6, ',   // warm gold/amber
    ];

    const particles: HeartParticle[] = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      size: 8 + Math.random() * 14,
      speedY: 0.4 + Math.random() * 0.7,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: 0.15 + Math.random() * 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(size / 20, size / 20);
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(-10, -10, -20, 5, 0, 20);
      context.bezierCurveTo(20, 5, 10, -10, 0, 0);
      context.fillStyle = `${color}${opacity})`;
      context.fill();
      context.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 opacity-70"
      aria-hidden="true"
    />
  );
};
