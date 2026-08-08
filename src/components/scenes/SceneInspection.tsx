'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';
import { sound } from '@/lib/sound';

export default function SceneInspection() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setTelemetry = useMissionStore((s) => s.setTelemetry);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);
  const [confidence, setConfidence] = useState(12);
  const [isThermal, setIsThermal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setStatus('INSPECTING');
    setTelemetry({ battery: 89, altitude: 85, speed: 15 });

    let count = 12;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 9) + 3;
      sound.playScanBeep();
      if (count >= 94.7) {
        count = 94.7;
        clearInterval(interval);
        setStatus('AI ANALYZING');
      }
      setConfidence(parseFloat(count.toFixed(1)));
    }, 250);

    return () => clearInterval(interval);
  }, [setStatus, setTelemetry]);

  // Render Canvas AI Bounding Box Scanner
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scanY = 0;

    const render = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scan line
      scanY = (scanY + 2.5) % canvas.height;
      ctx.strokeStyle = '#E4B12A';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#E4B12A';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Bounding box 1
      ctx.strokeStyle = '#C96A35';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#C96A35';
      ctx.shadowBlur = 18;
      ctx.strokeRect(canvas.width * 0.22, canvas.height * 0.28, 210, 160);
      ctx.fillStyle = '#E4B12A';
      ctx.font = '11px "Press Start 2P", monospace';
      ctx.fillText(`CORROSION ANOMALY #01 [94.7%]`, canvas.width * 0.22, canvas.height * 0.28 - 10);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      id="scene-5"
      className="scene-section"
      onMouseEnter={() => setCursorMode('SCAN')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="inspection-container">
        <div className="inspection-viewport">
          <img
            src="/photos/oilgas_dashboard.png"
            alt="FlytBase Inspection"
            className="inspection-img"
            style={{ filter: isThermal ? 'hue-rotate(180deg) invert(0.9) contrast(1.4)' : 'brightness(0.9)' }}
          />
          <canvas ref={canvasRef} className="scan-canvas" />

          {/* Toggle RGB / Thermal */}
          <button
            onClick={() => setIsThermal(!isThermal)}
            className="pixel"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'var(--dark-panel)',
              border: '1px solid var(--mustard)',
              color: 'var(--mustard)',
              fontSize: '0.45rem',
              padding: '0.5rem 0.9rem',
              cursor: 'pointer',
              zIndex: 30,
            }}
          >
            MODE: {isThermal ? 'THERMAL [ON]' : 'RGB [ON]'}
          </button>
        </div>

        <div className="inspection-sidebar">
          <div className="scanner-title">SCENE 05 // LIVE AI EDGE SCANNER</div>

          <div>
            <div className="mono" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
              REAL-TIME CONFIDENCE RATING
            </div>
            <div className={`conf-display ${confidence > 80 ? 'high' : ''}`}>
              {confidence}%
            </div>
            <div className="conf-bar">
              <div className="conf-bar-inner" style={{ width: `${confidence}%` }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--cream)' }}>
              ✔ OBJECT DETECTED: STRUCTURAL CORROSION
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--cream)' }}>
              ✔ SEVERITY: HIGH (ACTION REQUIRED)
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--cream)' }}>
              ✔ AUTO WORK ORDER: CREATED (#WO-9921)
            </div>
          </div>

          {/* Defining Statement */}
          <div
            className="pixel"
            style={{
              marginTop: '1.5rem',
              padding: '0.9rem',
              background: 'rgba(228,177,42,0.1)',
              border: '1px solid var(--mustard)',
              fontSize: '0.5rem',
              color: 'var(--mustard)',
              lineHeight: '1.8',
            }}
          >
            “THIS WASN'T A DEMO. THIS HAPPENED AT A NORTH SEA PETROLEUM PLATFORM.”
          </div>
        </div>
      </div>
    </section>
  );
}
