'use client';

import React, { useEffect } from 'react';
import { useMissionStore } from '@/store/useMissionStore';
import { sound } from '@/lib/sound';

export default function SceneLaunch() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setTelemetry = useMissionStore((s) => s.setTelemetry);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);

  useEffect(() => {
    setStatus('DISPATCHED');
    setTelemetry({ battery: 98, altitude: 45, speed: 38 });
    sound.startDroneHum();

    return () => {
      sound.stopDroneHum();
    };
  }, [setStatus, setTelemetry]);

  return (
    <section
      id="scene-3"
      className="scene-section"
      onMouseEnter={() => setCursorMode('TRACK')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="launch-container">
        {/* Animated Dock Image */}
        <img
          src="/photos/site_gallery_07.png"
          alt="FlytBase Autonomous Dock"
          className="launch-bg-img"
        />

        {/* Heat distortion & Light Rays overlay */}
        <div className="dock-heat-distortion" />
        <div className="dock-light-rays" />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(13,13,13,0.95), transparent 65%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '4rem clamp(2rem, 6vw, 6rem)',
            zIndex: 10,
          }}
        >
          <div className="pixel" style={{ fontSize: '0.6rem', color: 'var(--mustard)', marginBottom: '0.5rem' }}>
            SCENE 03 // HERO DISPATCH -- DOCK TAKEOFF
          </div>
          <h2 className="pixel" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.8rem)', color: 'var(--cream)', marginBottom: '1rem' }}>
            AUTONOMOUS TAKEOFF COMMENCED.
          </h2>
          <p className="mono" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxWidth: '650px', lineHeight: '1.7' }}>
            No pilots on site. No manual remote controls. The dock powers on, checks weather sensors, opens bay doors, and launches into BVLOS flight.
          </p>
        </div>
      </div>
    </section>
  );
}
