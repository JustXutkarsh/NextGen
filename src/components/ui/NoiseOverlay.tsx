'use client';

import React, { useEffect, useRef } from 'react';

export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const generateNoise = () => {
      const imgData = ctx.createImageData(width, height);
      const buffer = new Uint32Array(imgData.data.buffer);
      const len = buffer.length;

      for (let i = 0; i < len; i += 2) {
        if (Math.random() < 0.12) {
          // Subtle grey grain pixel
          buffer[i] = 0x0cffffff; 
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(generateNoise);
    };

    generateNoise();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="noise-canvas-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9000,
        opacity: 0.04,
        mixBlendMode: 'overlay',
      }}
    />
  );
}
