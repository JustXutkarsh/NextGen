'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMissionStore } from '@/store/useMissionStore';
import { sound } from '@/lib/sound';

gsap.registerPlugin(ScrollTrigger);

export default function MasterCinematicExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);

  const { setStatus, setTelemetry, setCursorMode } = useMissionStore();

  // Interactive States
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [alarmActive, setAlarmActive] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(12.0);
  const [isThermal, setIsThermal] = useState(false);
  const [activeDossierIndex, setActiveDossierIndex] = useState(0);

  // Scene 1: Quiet CRT Terminal Typing
  useEffect(() => {
    const seq = [
      'SYSTEM_INITIALIZE -- SYS_VER: 26.4.0',
      'CONNECTING TO FLYTBASE AUTONOMOUS MESH...',
      'SATELLITE SYNC: LOCKED [ATACAMA DESERT, CHILE]',
      'DOCK_STATUS: ONLINE [BATTERY 100%]',
      'AI CORE: LOADED [CONVOLUTIONAL MODEL V9.8]',
      'PRE-FLIGHT DIAGNOSTICS: ALL SYSTEMS NOMINAL.',
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < seq.length) {
        setBootLines((prev) => [...prev, seq[idx]]);
        sound.playTypingBeep();
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setAlarmActive(true);
          sound.playAlarmTone();
        }, 700);
      }
    }, 320);

    return () => clearInterval(interval);
  }, []);

  // Master Virtual Camera Timeline (Single Pinned Viewport)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cameraTL = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=7000', // 7000px virtual camera journey
          scrub: 1.2,
          pin: true,
          onUpdate: (self) => {
            const p = self.progress;
            useMissionStore.getState().setProgress(p);

            // Telemetry & Status Management per Narrative Stage
            if (p < 0.12) {
              setStatus(alarmActive ? 'ALERT' : 'BOOTING');
              setTelemetry({ battery: 100, altitude: 0, speed: 0 });
            } else if (p >= 0.12 && p < 0.35) {
              setStatus('AIRBORNE');
              const alt = Math.round(180 * ((p - 0.12) / 0.23));
              const spd = Math.round(220 * ((p - 0.12) / 0.23));
              const bat = Math.max(82, 100 - Math.round(18 * ((p - 0.12) / 0.23)));
              setTelemetry({ battery: bat, altitude: alt, speed: spd });

              // Telemetry Loss Glitch Beat (Sole Glitch Instance)
              if (p > 0.24 && p < 0.27) {
                if (!glitchActive) {
                  setGlitchActive(true);
                  sound.playStaticGlitch();
                }
              } else {
                setGlitchActive(false);
              }
            } else if (p >= 0.35 && p < 0.65) {
              setStatus('INSPECTING');
              setTelemetry({ battery: 82, altitude: 85, speed: 12 });

              // Live Scan Confidence 12.0% -> 94.7%
              const conf = Math.min(94.7, 12.0 + ((p - 0.35) / 0.3) * 82.7);
              setAiConfidence(parseFloat(conf.toFixed(1)));
              if (conf > 85) setStatus('AI ANALYZING');
            } else if (p >= 0.65 && p < 0.80) {
              setStatus('GLOBAL VIEW');
              setTelemetry({ battery: 75, altitude: 240, speed: 190 });
            } else if (p >= 0.80 && p < 0.90) {
              setStatus('DEBRIEFING');
            } else {
              setStatus('MISSION COMPLETE');
            }
          },
        },
      });

      // ── VIRTUAL CAMERA CHOREOGRAPHY ────────────────────────

      // 1. SCENE 1 -> SCENE 2: Push-in from Boot Terminal to Alert
      cameraTL
        .to('.cam-boot', { opacity: 0, z: -200, duration: 1 }, 0.08)
        .fromTo('.cam-alert', { opacity: 0, z: 150 }, { opacity: 1, z: 0, duration: 1 }, 0.08);

      // 2. SCENE 2 -> SCENE 3: SIGNATURE ROTATION #1 — Camera pulls into satellite view and dives to Chile
      cameraTL
        .to('.cam-alert', { opacity: 0, duration: 0.8 }, 0.18)
        .fromTo(
          '.cam-satellite',
          { opacity: 0, scale: 2.2, rotateZ: -45 },
          { opacity: 1, scale: 1, rotateZ: 0, duration: 1.5, ease: 'power2.inOut' },
          0.18
        );

      // 3. SCENE 3 -> SCENE 4: Dive into Drone Dock Takeoff
      cameraTL
        .to('.cam-satellite', { opacity: 0, scale: 0.5, duration: 1 }, 0.34)
        .fromTo('.cam-launch', { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: 1 }, 0.36);

      // 4. SCENE 4 -> SCENE 5: Camera enters inspection photo (STABILIZED FOR READABILITY)
      cameraTL
        .to('.cam-launch', { opacity: 0, duration: 0.8 }, 0.48)
        .fromTo('.cam-inspection', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1 }, 0.50);

      // 5. SCENE 5 -> SCENE 6: Transition into Classified Mission Dossiers
      cameraTL
        .to('.cam-inspection', { opacity: 0, duration: 0.8 }, 0.65)
        .fromTo('.cam-dossiers', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 }, 0.67);

      // 6. SCENE 6 -> SCENE 7: THE PAUSE — Camera freezes completely dead still on clean quote
      cameraTL
        .to('.cam-dossiers', { opacity: 0, duration: 0.8 }, 0.78)
        .fromTo('.cam-pause', { opacity: 0 }, { opacity: 1, duration: 1 }, 0.80);

      // 7. SCENE 7 -> SCENE 8: SIGNATURE ROTATION #2 — Warm Mustard Bloom into NestGen '26 Reveal & CTA
      cameraTL
        .to('.cam-pause', { opacity: 0, duration: 0.8 }, 0.88)
        .fromTo(
          '.cam-reveal',
          { opacity: 0, scale: 0.8, rotateZ: 15 },
          { opacity: 1, scale: 1, rotateZ: 0, duration: 1.2, ease: 'power2.out' },
          0.90
        );
    }, containerRef);

    return () => ctx.revert();
  }, [alarmActive, setStatus, setTelemetry, glitchActive]);

  // Canvas AI Bounding Box Laser Scanner
  useEffect(() => {
    const canvas = scanCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let scanY = 0;

    const render = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Single Clean Laser Scan Line
      scanY = (scanY + 2.5) % canvas.height;
      ctx.strokeStyle = '#E4B12A';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#E4B12A';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Bounding Box Defect Highlight
      ctx.strokeStyle = '#C96A35';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#C96A35';
      ctx.shadowBlur = 18;
      ctx.strokeRect(canvas.width * 0.24, canvas.height * 0.26, 210, 160);

      ctx.fillStyle = '#E4B12A';
      ctx.font = '11px "Press Start 2P", monospace';
      ctx.fillText(`ANOMALY DETECTED [${aiConfidence}%]`, canvas.width * 0.24, canvas.height * 0.26 - 10);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [aiConfidence]);

  const dossiers = [
    {
      title: 'SHELL PETROLEUM',
      code: 'CASE #9021-NORTH-SEA',
      img: '/photos/oilgas_dashboard.png',
      metric: '100X FLIGHT FREQUENCY',
      story: 'World’s first fully autonomous drone operation on a floating offshore oil platform in the North Sea.',
    },
    {
      title: 'SQM CHILE LITHIUM',
      code: 'CASE #4412-ATACAMA',
      img: '/photos/dock_mountain_terrain.png',
      metric: '90 MIN LEAK DETECTION',
      story: 'Cut leak detection time from days down to under 90 minutes. 4x iodine yield increase in Atacama.',
    },
    {
      title: 'CSX RAILWAYS',
      code: 'CASE #7710-RAIL-MESH',
      img: '/photos/railyard_corrosion_dashboard.png',
      metric: 'CREDIT-CARD RAIL DEFECTS',
      story: 'Spotting rail anomalies at 100ft altitude without shutting down live train tracks.',
    },
  ];

  const activeDoc = dossiers[activeDossierIndex] || dossiers[0];

  return (
    <div ref={containerRef} className="master-container">
      {/* ── SINGLE PINNED VIRTUAL CAMERA STAGE ─────────────── */}
      <div className="virtual-camera-viewport">
        {/* NARRATIVE BEAT 1: THE BOOT (Quiet) */}
        <div className="cam-layer cam-boot">
          <div className="clean-terminal-box crt-effect">
            <div className="crt-scanlines" />
            <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '2rem' }}>
              FLYTBASE OPERATING SYSTEM // BOOT V26.4
            </div>
            <div>
              {bootLines.map((line, idx) => (
                <div key={idx} className="boot-line" style={{ fontSize: '0.9rem', lineHeight: '2.2' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', marginRight: '0.75rem' }}>
                    [{`0${idx + 1}`.slice(-2)}]
                  </span>
                  {line}
                </div>
              ))}
              {bootLines.length < 6 && <span className="boot-cursor" />}
            </div>
          </div>
        </div>

        {/* NARRATIVE BEAT 2: MISSION ALERT (Tension) */}
        <div className="cam-layer cam-alert">
          <div className="clean-alert-card">
            <div className="pixel" style={{ fontSize: '1.4rem', color: 'var(--alert-red)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
              ⚠️ INCIDENT ALARM TRIGGERED
            </div>
            <div className="mono" style={{ fontSize: '0.95rem', color: 'var(--cream)', lineHeight: '1.8' }}>
              ATACAMA LITHIUM MINE -- ZONE 4A ANOMALY DETECTED
            </div>
            <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginTop: '1.2rem' }}>
              INITIATING DISPATCH PROCEDURE...
            </div>
          </div>
        </div>

        {/* NARRATIVE BEAT 3: WORLD SATELLITE (Signature Rotation #1) */}
        <div className="cam-layer cam-satellite">
          <div style={{ textAlign: 'center', width: '90%', maxWidth: '850px' }}>
            <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '1rem' }}>
              BEAT 03 // SATELLITE NAVIGATION
            </div>
            <h2 className="pixel" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.4rem)', color: 'var(--cream)', marginBottom: '2rem' }}>
              TARGET: ATACAMA DESERT, CHILE
            </h2>
            <svg viewBox="0 0 1000 450" fill="none" style={{ width: '100%', opacity: 0.4 }}>
              <path
                d="M 150,280 Q 350,100 550,220 T 850,240"
                stroke="var(--mustard)"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              <circle cx="150" cy="280" r="8" fill="var(--terracotta)" />
              <text x="165" y="285" fill="var(--cream)" fontSize="13" fontFamily="var(--font-mono)">CHILE (SQM)</text>
            </svg>
          </div>
        </div>

        {/* NARRATIVE BEAT 4: DRONE DEPLOYMENT (Hero Ground Moment) */}
        <div className="cam-layer cam-launch">
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src="/photos/site_gallery_07.png"
              alt="FlytBase Dock Takeoff"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(13,13,13,0.95), transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '4rem clamp(2rem, 6vw, 6rem)',
              }}
            >
              <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '0.5rem' }}>
                BEAT 04 // HERO DISPATCH
              </div>
              <h2 className="pixel" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)', color: 'var(--cream)', marginBottom: '1rem' }}>
                AUTONOMOUS TAKEOFF.
              </h2>
              <p className="mono" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px' }}>
                No pilots on site. No manual remote controls. The dock powers on, checks weather sensors, opens bay doors, and launches into BVLOS flight.
              </p>
            </div>
          </div>
        </div>

        {/* NARRATIVE BEAT 5: LIVE INSPECTION (The WOW Moment - Stabilized Text) */}
        <div className="cam-layer cam-inspection">
          <div className="inspection-container">
            <div className="inspection-viewport">
              <img
                src="/photos/oilgas_dashboard.png"
                alt="FlytBase Inspection"
                className="inspection-img"
                style={{ filter: isThermal ? 'hue-rotate(180deg) invert(0.9) contrast(1.4)' : 'brightness(0.9)' }}
              />
              <canvas ref={scanCanvasRef} className="scan-canvas" />

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
                VISION: {isThermal ? 'THERMAL [ON]' : 'RGB [ON]'}
              </button>
            </div>

            <div className="inspection-sidebar">
              <div className="scanner-title">BEAT 05 // LIVE AI EDGE SCANNER</div>
              <div>
                <div className="mono" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                  AI CONFIDENCE RATING
                </div>
                <div className={`conf-display ${aiConfidence > 80 ? 'high' : ''}`}>
                  {aiConfidence}%
                </div>
                <div className="conf-bar">
                  <div className="conf-bar-inner" style={{ width: `${aiConfidence}%` }} />
                </div>
              </div>

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
                “THIS WASN'T A DEMO. THIS HAPPENED ON AN OFFSHORE RIG.”
              </div>
            </div>
          </div>
        </div>

        {/* NARRATIVE BEAT 6: CLASSIFIED DOSSIERS */}
        <div className="cam-layer cam-dossiers" onMouseEnter={() => setCursorMode('OPEN DOSSIER')}>
          <div className="dossiers-container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)' }}>
                BEAT 06 // CLASSIFIED MISSION DOSSIERS
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {dossiers.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDossierIndex(i)}
                    className="pixel"
                    style={{
                      padding: '0.6rem 1.2rem',
                      fontSize: '0.5rem',
                      background: activeDossierIndex === i ? 'var(--mustard)' : 'var(--dark-panel)',
                      color: activeDossierIndex === i ? 'var(--ink)' : 'var(--cream)',
                      border: '1px solid var(--dark-border)',
                      cursor: 'pointer',
                    }}
                  >
                    📁 {d.title}
                  </button>
                ))}
              </div>

              <div className="dossier-card">
                <div className="dossier-banner">
                  <span className="pixel" style={{ fontSize: '0.45rem', color: 'var(--alert-red)' }}>
                    CONFIDENTIAL // RESTRICTED ACCESS
                  </span>
                  <span className="mono" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                    {activeDoc.code}
                  </span>
                </div>

                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src={activeDoc.img}
                    alt={activeDoc.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <div className="pixel" style={{ fontSize: '0.7rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                    {activeDoc.title}
                  </div>
                  <div className="mono" style={{ fontSize: '1.5rem', color: 'var(--mustard)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {activeDoc.metric}
                  </div>
                  <p className="mono" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                    {activeDoc.story}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NARRATIVE BEAT 7: THE PAUSE (Frozen Camera, Pure Black, Absolute Readability) */}
        <div className="cam-layer cam-pause">
          <div className="why-container" style={{ background: '#000' }}>
            <div className="why-card">
              <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)', marginBottom: '2rem' }}>
                THE PAUSE // WHY NESTGEN EXISTS
              </div>
              <p className="why-quote">
                “Companies build autonomous programs in silence. <br />
                <span className="why-highlight">The failed pilots. The procurement headaches. The boardroom debates.</span> <br />
                That conversation normally stays locked inside corporate walls. <br /><br />
                <span style={{ color: 'var(--mustard)', fontWeight: 'bold' }}>
                  NestGen is the one day a year it doesn't.
                </span>”
              </p>
            </div>
          </div>
        </div>

        {/* NARRATIVE BEAT 8: NESTGEN '26 REVEAL & CTA (Signature Rotation #2) */}
        <div className="cam-layer cam-reveal" onMouseEnter={() => setCursorMode('ACCEPT MISSION')}>
          <div className="reveal-container">
            <div className="pixel" style={{ fontSize: '0.6rem', color: 'var(--ink)', opacity: 0.8, marginBottom: '1rem' }}>
              SEPTEMBER 29, 2026 // ONLINE GLOBAL SUMMIT
            </div>
            <h1 className="reveal-headline">NESTGEN '26</h1>
            <p className="mono" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.3rem)', maxWidth: '650px', marginBottom: '2.5rem', fontWeight: 'bold' }}>
              ONE DAY. THE PLAYBOOK NOBODY USUALLY SHARES.
            </p>
            <a href="https://nestgen.org" target="_blank" rel="noopener noreferrer" className="cta-button">
              <span>ACCEPT MISSION BRIEFING & REGISTER</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Sole Telemetry Glitch Overlay */}
        {glitchActive && (
          <div className="glitch-overlay">
            <div className="pixel glitch-text" style={{ fontSize: '1.6rem', color: 'var(--alert-red)' }}>
              ⚠️ TELEMETRY SIGNAL LOST
            </div>
            <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--mustard)', marginTop: '0.75rem' }}>
              SWITCHING TO AUTONOMOUS EDGE AI...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
