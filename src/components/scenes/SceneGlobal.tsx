'use client';

import React, { useEffect } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function SceneGlobal() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setTelemetry = useMissionStore((s) => s.setTelemetry);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);

  useEffect(() => {
    setStatus('GLOBAL VIEW');
    setTelemetry({ battery: 80, altitude: 250, speed: 180 });
  }, [setStatus, setTelemetry]);

  const deployments = [
    { name: 'SQM Lithium Mine', location: 'Atacama, Chile', metric: '90 min leak detection' },
    { name: 'BF Kiel Fire Dept', location: 'Kiel, Germany', metric: '7 min rescue response cut' },
    { name: 'MPA Singapore Port', location: 'Singapore', metric: '5km surveillance range' },
    { name: 'CSX Transportation', location: 'United States', metric: 'Credit-card rail defects' },
    { name: 'Shell Petroleum', location: 'North Sea', metric: '100x flight frequency' },
    { name: 'EnBW Solar', location: 'Germany', metric: '1GW scaled with 2 docks' },
  ];

  return (
    <section
      id="scene-7"
      className="scene-section"
      onMouseEnter={() => setCursorMode('TRACK')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="global-container">
        <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '1rem' }}>
          SCENE 07 // GLOBAL DEPLOYMENT NETWORK
        </div>

        <h2 className="pixel" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', color: 'var(--cream)', marginBottom: '2.5rem', textAlign: 'center' }}>
          LIVE ACROSS 12 INDUSTRIES & 5 CONTINENTS.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', width: '100%', maxWidth: '950px' }}>
          {deployments.map((d, i) => (
            <div
              key={i}
              style={{
                background: 'var(--dark-panel)',
                border: '1px solid var(--dark-border)',
                padding: '1.5rem',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--mustard)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--dark-border)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--mustard)', marginBottom: '0.25rem' }}>
                📍 {d.location}
              </div>
              <div className="pixel" style={{ fontSize: '0.65rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                {d.name}
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--mission-green)' }}>
                {d.metric}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
