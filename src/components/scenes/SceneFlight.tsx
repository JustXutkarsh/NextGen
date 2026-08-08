'use client';

import React, { useEffect, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';
import { sound } from '@/lib/sound';

export default function SceneFlight() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setTelemetry = useMissionStore((s) => s.setTelemetry);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    setStatus('AIRBORNE');
    setTelemetry({ battery: 94, altitude: 120, speed: 65 });

    // Trigger Signal Lost Glitch
    const timer = setTimeout(() => {
      setIsGlitching(true);
      setStatus('IN FLIGHT');
      sound.playStaticGlitch();
      setTimeout(() => {
        setIsGlitching(false);
      }, 1800);
    }, 2500);

    return () => clearTimeout(timer);
  }, [setStatus, setTelemetry]);

  return (
    <section
      id="scene-4"
      className="scene-section"
      onMouseEnter={() => setCursorMode('TRACK')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="flight-container">
        {/* Animated SVG Flight Route Map */}
        <svg className="world-map-svg" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Animated Bezier Flight Path */}
          <path
            d="M 150,300 Q 300,120 500,200 T 850,250"
            stroke="var(--mustard)"
            strokeWidth="3"
            strokeDasharray="12 6"
            className="animate-dash"
          />
          {/* World Continent Pins */}
          <g>
            <circle cx="150" cy="300" r="8" fill="var(--terracotta)" />
            <text x="165" y="305" fill="var(--cream)" fontSize="12" fontFamily="var(--font-mono)">CHILE (SQM)</text>

            <circle cx="500" cy="200" r="8" fill="var(--mustard)" />
            <text x="515" y="205" fill="var(--cream)" fontSize="12" fontFamily="var(--font-mono)">GERMANY (BF KIEL)</text>

            <circle cx="850" cy="250" r="8" fill="var(--mission-green)" />
            <text x="750" y="270" fill="var(--cream)" fontSize="12" fontFamily="var(--font-mono)">SINGAPORE (MPA)</text>
          </g>
        </svg>

        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 10,
            maxWidth: '750px',
          }}
        >
          <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '0.75rem' }}>
            SCENE 04 // TRANS-INDUSTRIAL FLIGHT ROUTE
          </div>

          <h2 className="pixel" style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.2rem)', color: 'var(--cream)', marginBottom: '1rem' }}>
            FLYING OVER MINES, PORTS & POWER GRIDS.
          </h2>
        </div>

        {/* Signal Loss Glitch Overlay */}
        {isGlitching && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#000',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--alert-red)',
            }}
          >
            <div
              className="pixel glitch-text"
              style={{
                fontSize: '1.6rem',
                color: 'var(--alert-red)',
                letterSpacing: '0.2em',
                marginBottom: '1rem',
              }}
            >
              ⚠️ TELEMETRY SIGNAL LOST
            </div>
            <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--mustard)', letterSpacing: '0.15em' }}>
              SWITCHING TO AUTONOMOUS EDGE AI MODE...
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
