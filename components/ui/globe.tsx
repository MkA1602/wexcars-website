'use client';

import { useEffect, useRef } from 'react';

interface EarthProps {
  scale?: number;
  baseColor?: [number, number, number];
  markerColor?: [number, number, number];
  glowColor?: [number, number, number];
}

export default function Earth({
  scale = 1,
  baseColor = [0.2, 0.5, 1],
  markerColor = [1, 1, 1],
  glowColor = [0.3, 0.6, 1],
}: EarthProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Simple CSS-based globe effect
    const container = containerRef.current;
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      style={{ transform: `scale(${scale})` }}
    >
      <style>{`
        @keyframes globe-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div
        className="relative rounded-full"
        style={{
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle at 30% 30%, rgba(${glowColor[0] * 255}, ${glowColor[1] * 255}, ${glowColor[2] * 255}, 0.8), rgba(${baseColor[0] * 255}, ${baseColor[1] * 255}, ${baseColor[2] * 255}, 0.6))`,
          boxShadow: `0 0 60px rgba(${glowColor[0] * 255}, ${glowColor[1] * 255}, ${glowColor[2] * 255}, 0.5), inset 0 0 60px rgba(${baseColor[0] * 255}, ${baseColor[1] * 255}, ${baseColor[2] * 255}, 0.3)`,
          animation: 'globe-spin 20s linear infinite',
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 70% 70%, rgba(${markerColor[0] * 255}, ${markerColor[1] * 255}, ${markerColor[2] * 255}, 0.3), transparent 60%)`,
          }}
        />
      </div>
    </div>
  );
}

