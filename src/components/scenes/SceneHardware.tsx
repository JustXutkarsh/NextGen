'use client';

import React, { useEffect, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function SceneHardware() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setStatus('HARDWARE SCAN');
  }, [setStatus]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 20, y: -y * 20 });
  };

  return (
    <section
      id="scene-9"
      className="scene-section"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorMode('ANALYZE')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="hardware-container">
        <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '1rem', zIndex: 10 }}>
          SCENE 09 // THE PHYSICAL AI OPERATING SYSTEM
        </div>

        <div
          className="hardware-card"
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            boxShadow: '0 30px 60px rgba(0,0,0,0.9)',
          }}
        >
          <img
            src="/photos/05_supported_hardware.png"
            alt="FlytBase Supported Hardware"
            style={{ width: '100%', borderRadius: '4px' }}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', maxWidth: '650px', zIndex: 10 }}>
          <h3 className="pixel" style={{ fontSize: '1rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>
            NOT A DRONE COMPANY.
          </h3>
          <p className="mono" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            FlytBase is the operating system that orchestrates autonomous docks, drones, thermal sensors, and robotics into one unified mesh.
          </p>
        </div>
      </div>
    </section>
  );
}
