'use client';

import React, { useEffect } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function SceneReveal() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);

  useEffect(() => {
    setStatus('DEBRIEFING');
  }, [setStatus]);

  const speakers = [
    'UK POLICE (NPCC)',
    'AIRBUS',
    'SHELL PETROLEUM',
    'SQM CHILE',
    'MPA SINGAPORE',
    'TEXAS INSTRUMENTS',
    'BELGIAN POLICE',
    'FIRST QUANTUM',
    'CSX RAILWAYS',
    'LA METRO',
  ];

  return (
    <section
      id="scene-11"
      className="scene-section"
      onMouseEnter={() => setCursorMode('DEFAULT')}
    >
      <div className="reveal-container">
        <div className="pixel" style={{ fontSize: '0.6rem', color: 'var(--ink)', opacity: 0.8, marginBottom: '1rem' }}>
          SEPTEMBER 29, 2026 // ONLINE GLOBAL SUMMIT
        </div>

        <h1 className="reveal-headline">
          NESTGEN '26
        </h1>

        <p className="mono" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.3rem)', maxWidth: '650px', marginBottom: '2.5rem', fontWeight: 'bold' }}>
          ONE DAY. THE PLAYBOOK NOBODY USUALLY SHARES.
        </p>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px' }}>
          {speakers.map((s, i) => (
            <span
              key={i}
              className="pixel"
              style={{
                background: 'var(--ink)',
                color: 'var(--mustard)',
                padding: '0.5rem 0.9rem',
                fontSize: '0.5rem',
              }}
            >
              ✔ {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
