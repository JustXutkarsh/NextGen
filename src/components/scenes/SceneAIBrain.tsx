'use client';

import React, { useEffect } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function SceneAIBrain() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setTelemetry = useMissionStore((s) => s.setTelemetry);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);

  useEffect(() => {
    setStatus('AI ANALYZING');
    setTelemetry({ battery: 85, altitude: 85, speed: 0 });
  }, [setStatus, setTelemetry]);

  const pipeline = [
    { step: '01', title: 'EDGE AI (DRONE)', detail: 'YOLOv8 model running on onboard computer' },
    { step: '02', title: 'CLOUD MESH', detail: 'Telemetry & imagery routed via 5G/Satcom' },
    { step: '03', title: 'OPERATOR DASH', detail: 'Alert & thermal overlay flagged in console' },
    { step: '04', title: 'ERP / MAINTENANCE', detail: 'Work order generated automatically in SAP' },
  ];

  return (
    <section
      id="scene-6"
      className="scene-section"
      onMouseEnter={() => setCursorMode('ANALYZE')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="ai-brain-container">
        <div style={{ maxWidth: '900px', width: '90%', textAlign: 'center', zIndex: 2 }}>
          <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '1rem' }}>
            SCENE 06 // EDGE AI DATA PIPELINE
          </div>

          <h2 className="pixel" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', color: 'var(--cream)', marginBottom: '2.5rem' }}>
            PACKETS TRAVEL FROM DRONE TO ERP IN 1.2 SECONDS.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem' }}>
            {pipeline.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--dark-panel)',
                  border: '1px solid var(--dark-border)',
                  padding: '1.5rem 1.2rem',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div className="pixel" style={{ fontSize: '0.45rem', color: 'var(--mustard)', marginBottom: '0.5rem' }}>
                  STEP {item.step}
                </div>
                <div className="pixel" style={{ fontSize: '0.65rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                  {item.title}
                </div>
                <div className="mono" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
