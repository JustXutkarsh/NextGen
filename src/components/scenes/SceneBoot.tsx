'use client';

import React, { useEffect, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';
import { sound } from '@/lib/sound';

export default function SceneBoot() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setTelemetry = useMissionStore((s) => s.setTelemetry);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);
  const [lines, setLines] = useState<string[]>([]);
  const [showAlarm, setShowAlarm] = useState(false);

  const bootSequence = [
    'SYSTEM_INITIALIZE -- SYS_VER: 26.4.0',
    'CONNECTING TO FLYTBASE AUTONOMOUS MESH...',
    'SATELLITE SYNC: LOCKED [12 SATS, 0.02m PRECISION]',
    'DOCK_STATUS: ONLINE [LOCATION: ATACAMA DESERT, CHILE]',
    'BATTERY: 100% | WEATHER: CLEAR | WINDS: 4.2 KTS',
    'AI CORE: LOADED [CONVOLUTIONAL MODEL V9.8]',
    'PRE-FLIGHT DIAGNOSTICS: ALL SYSTEMS NOMINAL.',
    'STANDING BY FOR DISPATCH...',
  ];

  useEffect(() => {
    setStatus('BOOTING');
    setTelemetry({ battery: 100, altitude: 0, speed: 0 });

    let currentLineIndex = 0;

    const interval = setInterval(() => {
      if (currentLineIndex < bootSequence.length) {
        setLines((prev) => [...prev, bootSequence[currentLineIndex]]);
        sound.playTypingBeep();
        currentLineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowAlarm(true);
          setStatus('ALERT');
          sound.playAlarmTone();
        }, 800);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [setStatus, setTelemetry]);

  return (
    <section
      id="scene-1"
      className="scene-section"
      onMouseEnter={() => setCursorMode('TRACK')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="boot-container crt-effect">
        {/* CRT Scanline Overlay */}
        <div className="crt-scanlines" />

        <div className="boot-terminal-title">
          FLYTBASE OPERATING SYSTEM // MISSION CONTROL BOOT V26.4
        </div>
        <div>
          {lines.map((line, idx) => (
            <div key={idx} className="boot-line">
              <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: '0.75rem' }}>
                [{`0${idx + 1}`.slice(-2)}]
              </span>
              {line}
            </div>
          ))}
          {lines.length < bootSequence.length && <span className="boot-cursor" />}
        </div>

        {showAlarm && (
          <div className="boot-alarm-overlay">
            <div className="boot-alarm-title">⚠️ INCIDENT ALARM TRIGGERED</div>
            <div className="mono" style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#fff', textAlign: 'center' }}>
              ZONE 4A -- ANOMALY DETECTED -- SENSORS DISPATCHING DRONE FLEET
              <br />
              <span className="pixel" style={{ color: 'var(--mustard)', fontSize: '0.55rem', display: 'block', marginTop: '0.75rem' }}>
                INITIATING EMERGENCY TAKE-OFF PROCEDURE...
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
