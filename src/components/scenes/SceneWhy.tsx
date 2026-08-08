'use client';

import React, { useEffect } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function SceneWhy() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);

  useEffect(() => {
    setStatus('DEBRIEFING');
  }, [setStatus]);

  return (
    <section
      id="scene-10"
      className="scene-section"
      onMouseEnter={() => setCursorMode('DEFAULT')}
    >
      <div className="why-container">
        <div className="why-card">
          <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '2rem' }}>
            SCENE 10 // THE PAUSE -- WHY NESTGEN EXISTS
          </div>

          <p className="why-quote">
            “Companies build these autonomous programs in silence. <br />
            <span className="why-highlight">The failed pilots. The procurement headaches. The internal debates.</span> <br />
            That conversation normally stays locked inside four corporate walls. <br /><br />
            <span style={{ color: 'var(--mustard)', fontWeight: 'bold' }}>
              NestGen is the one day a year it doesn't.
            </span>”
          </p>
        </div>
      </div>
    </section>
  );
}
