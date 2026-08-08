'use client';

import React, { useEffect } from 'react';
import { useMissionStore } from '@/store/useMissionStore';
import { sound } from '@/lib/sound';

export default function SceneCTA() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);

  useEffect(() => {
    setStatus('MISSION COMPLETE');
    sound.playMissionCompleteChime();
  }, [setStatus]);

  return (
    <section
      id="scene-12"
      className="scene-section"
      onMouseEnter={() => setCursorMode('ACCEPT MISSION')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="cta-container">
        <div className="pixel" style={{ fontSize: '0.65rem', color: 'var(--mission-green)', marginBottom: '1.5rem', letterSpacing: '0.2em' }}>
          ✔ MISSION ACCOMPLISHED // DEBRIEFING COMPLETE
        </div>

        <h2 className="pixel" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', color: 'var(--cream)', marginBottom: '1.5rem', maxWidth: '750px' }}>
          YOU'VE SEEN WHAT THEY BUILT. NOW HEAR HOW THEY BUILT IT.
        </h2>

        <p className="mono" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', marginBottom: '3rem' }}>
          Join pioneers from UK Police, Shell, Airbus, and SQM. Real failures, real architectures, real playbooks.
        </p>

        <a
          href="https://nestgen.org"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button"
        >
          <span>ACCEPT MISSION BRIEFING & REGISTER</span>
          <span>→</span>
        </a>

        <div className="mono" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
          FREE TO ATTEND // LIFETIME ACCESS TO ALL RECORDINGS
        </div>
      </div>
    </section>
  );
}
