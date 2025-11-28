'use client';

import { useEffect, useRef } from 'react';

interface SparklesCoreProps {
  id: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

export default function SparklesCore({
  id,
  background = 'transparent',
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 500,
  className = '',
  particleColor = '#ffffff',
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
  }>>([]);
  const initializedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || 100;
      const height = rect.height || 100;
      
      // Only update if dimensions actually changed
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        
        // Reinitialize particles if dimensions changed
        if (initializedRef.current) {
          initializeParticles();
        }
      }
    };

    const parseColor = (color: string): [number, number, number] => {
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];
      }
      return [255, 255, 255];
    };

    const [r, g, b] = parseColor(particleColor);

    const initializeParticles = () => {
      if (!canvas) return;
      const particleCount = Math.floor((particleDensity * canvas.width * canvas.height) / 10000);
      particlesRef.current = [];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
    };

    const animate = () => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initial setup
    updateDimensions();
    initializeParticles();
    initializedRef.current = true;
    animate();

    // Handle resize
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      initializedRef.current = false;
    };
  }, [minSize, maxSize, particleDensity, particleColor]); // Removed dimensions from dependencies

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{ background, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
}
