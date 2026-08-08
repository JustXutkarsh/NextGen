'use client';

import React, { useEffect } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function SceneAlarm() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setTelemetry = useMissionStore((s) => s.setTelemetry);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);

  useEffect(() => {
    setStatus('ALERT');
    setTelemetry({ battery: 99, altitude: 5, speed: 12 });
  }, [setStatus, setTelemetry]);

  return (
    <section
      id="scene-2"
      className="scene-section"
      onMouseEnter={() => setCursorMode('TRACK')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="command-center">
        <div className="cc-header">
          <span className="pixel" style={{ color: 'var(--mustard)', fontSize: '0.6rem' }}>
            INCIDENT COMMAND // ACTIVE TELEMETRY CONSOLE
          </span>
          <span className="mono" style={{ color: 'var(--alert-red)', fontSize: '0.75rem', fontWeight: 'bold' }}>
            CRITICAL EVENT -- EMERGENCY FLIGHT PLAN GENERATED
          </span>
        </div>

        {/* Panel 1: Map radar */}
        <div className="cc-panel animate-dock-left">
          <span className="panel-tag">GRID MAP RADAR</span>
          <div style={{ padding: '3rem 1.5rem', height: '100%', position: 'relative' }}>
            <div
              style={{
                width: '130px',
                height: '130px',
                border: '1.5px solid var(--mustard)',
                borderRadius: '50%',
                margin: '2rem auto',
                position: 'relative',
                boxShadow: '0 0 20px rgba(228,177,42,0.15)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '50%',
                  width: '65px',
                  height: '2px',
                  background: 'linear-gradient(90deg, var(--mustard), transparent)',
                  transformOrigin: '0 0',
                  animation: 'radar-sweep 2.5s linear infinite',
                }}
              />
            </div>
            <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--cream)', lineHeight: '1.8' }}>
              TARGET: LAT -23.654, LON -70.402
              <br />
              BEARING: 042° NE
              <br />
              WIND VECTORS: 5.1 KTS
            </div>
          </div>
        </div>

        {/* Panel 2: Live Feed console */}
        <div className="cc-panel cc-feed-panel animate-dock-center">
          <span className="panel-tag">LIVE FLYTBASE PLATFORM CONSOLE</span>
          <img
            src="/photos/02_drone_software_console.png"
            alt="FlytBase Console"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="alarm-overlay" />
        </div>

        {/* Panel 3: Diagnostics */}
        <div className="cc-panel animate-dock-right">
          <span className="panel-tag">DIAGNOSTICS</span>
          <div style={{ padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            <div>
              <div className="mono" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                DISPATCH ETA
              </div>
              <div className="mono" style={{ fontSize: '1.8rem', color: 'var(--mustard)', fontWeight: 'bold' }}>
                00:01:45
              </div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                MISSION TYPE
              </div>
              <div className="mono" style={{ fontSize: '0.9rem', color: 'var(--cream)' }}>
                AUTONOMOUS BBOX INSPECTION
              </div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                LINK SECURITY
              </div>
              <div className="mono" style={{ fontSize: '0.9rem', color: 'var(--mission-green)' }}>
                ENCRYPTED (AES-256)
              </div>
            </div>
          </div>
        </div>

        <div className="cc-footer">
          <span className="mono" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
            DOCK 04 // BAY DOORS OPENING...
          </span>
          <span className="pixel" style={{ fontSize: '0.5rem', color: 'var(--mustard)' }}>
            DISPATCH CONFIRMED
          </span>
        </div>
      </div>
    </section>
  );
}
