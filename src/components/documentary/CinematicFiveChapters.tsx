'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '@/lib/sound';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicFiveChapters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [chap1Step, setChap1Step] = useState(0);
  const [chap2Step, setChap2Step] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(12.0);
  const [scanStage, setScanStage] = useState('INITIALIZING');
  const [isThermal, setIsThermal] = useState(false);
  const [chap4Step, setChap4Step] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Cases array
  const cases = [
    {
      company: 'SHELL PETROLEUM',
      location: 'North Sea Offshore Platform',
      stat: '100X Flight Frequency',
      detail: 'Operating fully autonomous dock flights on offshore oil platforms in heavy maritime weather.',
      photo: '/photos/oilgas_dashboard.png',
    },
    {
      company: 'SQM LITHIUM',
      location: 'Atacama Desert, Chile',
      stat: '90 Min Leak Detection',
      detail: 'Reduced chemical leak detection time from 3 days to under 90 minutes across vast evaporation ponds.',
      photo: '/photos/dock_mountain_terrain.png',
    },
    {
      company: 'CSX TRANSPORTATION',
      location: 'United States Rail Mesh',
      stat: 'Credit-Card Rail Defects',
      detail: 'Identifying credit-card sized structural anomalies at 100ft altitude without interrupting rail traffic.',
      photo: '/photos/railyard_corrosion_dashboard.png',
    },
  ];

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── CHAPTER 1: WHY AUTONOMOUS INSPECTION MATTERS (500vh) ──
      ScrollTrigger.create({
        trigger: '.chap-1-pin',
        start: 'top top',
        end: '+=3500',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.25) setChap1Step(0);
          else if (p < 0.55) setChap1Step(1);
          else if (p < 0.85) setChap1Step(2);
          else setChap1Step(3);
        },
      });

      // ── CHAPTER 2: JOURNEY INTO A REAL FACILITY (700vh) ──────
      ScrollTrigger.create({
        trigger: '.chap-2-pin',
        start: 'top top',
        end: '+=4500',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.2) setChap2Step(0);
          else if (p < 0.45) setChap2Step(1);
          else if (p < 0.7) setChap2Step(2);
          else if (p < 0.88) setChap2Step(3);
          else setChap2Step(4);
        },
      });

      // ── CHAPTER 3: WATCH AN AUTONOMOUS INSPECTION (800vh) ─────
      ScrollTrigger.create({
        trigger: '.chap-3-pin',
        start: 'top top',
        end: '+=5500',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const conf = Math.min(94.7, 12.0 + p * 82.7);
          setAiConfidence(parseFloat(conf.toFixed(1)));

          if (p < 0.2) setScanStage('SCANNING SURFACE...');
          else if (p < 0.45) setScanStage('ANOMALY BOUNDING BOX DETECTED');
          else if (p < 0.7) {
            setScanStage('THERMAL HEATMAP CONFIRMATION');
            setIsThermal(true);
          } else if (p < 0.9) {
            setScanStage('FINDING CONFIRMED: 94.7%');
          } else {
            setScanStage('CRITICAL: STRUCTURAL CORROSION · AUTO WORK ORDER CREATED');
          }

          if (p > 0.05 && p < 0.95) {
            sound.playScanBeep();
          }
        },
      });

      // ── CHAPTER 4: WHAT ENTERPRISES LEARNED & SILENCE (500vh) ─
      ScrollTrigger.create({
        trigger: '.chap-4-pin',
        start: 'top top',
        end: '+=3500',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.3) setChap4Step(0);
          else if (p < 0.6) setChap4Step(1);
          else if (p < 0.85) setChap4Step(2);
          else setChap4Step(3);
        },
      });

      // ── CHAPTER 5: NESTGEN REVEAL & REGISTRATION (500vh) ─────
      ScrollTrigger.create({
        trigger: '.chap-5-pin',
        start: 'top top',
        end: '+=3500',
        pin: true,
        scrub: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Canvas Laser Scanner Render for Chapter 3
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

      scanY = (scanY + 2.5) % canvas.height;
      ctx.strokeStyle = '#E4B12A';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#E4B12A';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      if (aiConfidence > 25) {
        ctx.strokeStyle = '#C96A35';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#C96A35';
        ctx.shadowBlur = 15;
        ctx.strokeRect(canvas.width * 0.25, canvas.height * 0.28, 220, 160);

        ctx.fillStyle = '#E4B12A';
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillText(`ANOMALY #01 [${aiConfidence}%]`, canvas.width * 0.25, canvas.height * 0.28 - 10);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [aiConfidence]);

  return (
    <div ref={containerRef} className="c5-container">
      <button onClick={toggleSound} className="c5-sound-toggle">
        {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
      </button>

      {/* ── CHAPTER 1: WHY AUTONOMOUS INSPECTION MATTERS (500vh) ── */}
      <div className="c5-pin-wrapper chap-1-pin">
        <section className="c5-stage">
          <div className="c5-content-narrow">
            <div className="c5-tag">CHAPTER 01 // THE ESSENCE</div>

            {chap1Step >= 0 && (
              <h1 className="c5-heading-large">
                Industrial inspection still depends on humans walking dangerous facilities.
              </h1>
            )}

            {chap1Step >= 1 && (
              <p className="c5-text-body">
                Oil refineries. Mining sites. Power grids. Commercial ports. Millions of physical assets are inspected manually, leaving massive blind spots between cycles.
              </p>
            )}

            {chap1Step >= 2 && (
              <p className="c5-text-body highlight">
                Physical AI changes the equation—from reactive repairs after failure to continuous autonomous vigilance.
              </p>
            )}

            {chap1Step >= 3 && (
              <div className="c5-scroll-prompt">
                <span>SCROLL TO ENTER ATACAMA FACILITY</span>
                <span className="c5-prompt-arrow">↓</span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── CHAPTER 2: JOURNEY INTO A REAL FACILITY (700vh) ────── */}
      <div className="c5-pin-wrapper chap-2-pin">
        <section className="c5-stage">
          <div className="c5-content-wide">
            <div className="c5-tag">CHAPTER 02 // REAL INCIDENT DEPLOYMENT</div>
            <h2 className="c5-heading-medium">Atacama Desert, Chile · 2,400m Elevation</h2>

            <div className="c5-media-frame">
              <img
                src={chap2Step >= 3 ? '/photos/site_gallery_07.png' : '/photos/dock_mountain_terrain.png'}
                alt="Atacama Lithium Facility"
                className="c5-media-img"
                style={{
                  transform: chap2Step === 1 ? 'scale(1.15)' : chap2Step >= 2 ? 'scale(1.3)' : 'scale(1)',
                  transition: 'transform 1s ease-out',
                }}
              />

              <div className="c5-media-caption">
                {chap2Step === 0 && <span>SATELLITE VIEW // SQM LITHIUM FACILITY</span>}
                {chap2Step === 1 && <span>ZOOMING TO HOLDING TANK 4A</span>}
                {chap2Step === 2 && <span>WEATHER: 4.2 KTS WINDS · WINDSPEED NOMINAL</span>}
                {chap2Step === 3 && <span>DOCK DOORS UNLOCKED · ROTORS SPINNING</span>}
                {chap2Step >= 4 && <span style={{ color: 'var(--mission-green)' }}>TAKEOFF COMMENCED · BVLOS FLIGHT ACTIVE</span>}
              </div>
            </div>

            <div className="c5-text-body" style={{ marginTop: '2rem' }}>
              {chap2Step <= 2 ? (
                'In one of the world’s most desolate environments, manual leak inspection is practically impossible. Here, autonomous docks perform 24/7 BVLOS missions without human pilots.'
              ) : (
                'The automated dock powers up, verifies local weather telemetry, opens bay doors, and launches into autonomous flight.'
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── CHAPTER 3: WATCH AN AUTONOMOUS INSPECTION (800vh) ───── */}
      <div className="c5-pin-wrapper chap-3-pin">
        <section className="c5-stage c5-stage-dark">
          <div className="c5-inspection-grid">
            <div className="c5-inspection-media">
              <img
                src="/photos/oilgas_dashboard.png"
                alt="Live Inspection"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isThermal ? 'hue-rotate(180deg) invert(0.9) contrast(1.4)' : 'brightness(0.9)',
                }}
              />
              <canvas ref={scanCanvasRef} className="c5-scan-canvas" />
            </div>

            <div className="c5-inspection-sidebar">
              <div className="c5-tag">CHAPTER 03 // LIVE AI SCANNER</div>
              <h3 className="c5-sidebar-title">Holding Tank 4A Structural Scan</h3>

              <div className="c5-confidence-box">
                <span className="c5-confidence-label">CONFIDENCE RATING</span>
                <span className="c5-confidence-val">{aiConfidence}%</span>
                <div className="c5-confidence-bar">
                  <div className="c5-confidence-fill" style={{ width: `${aiConfidence}%` }} />
                </div>
              </div>

              <div className="c5-scan-stage-badge">
                STATUS: {scanStage}
              </div>

              <div className="c5-quote-callout">
                “This wasn't a simulated demo. This happened at a North Sea petroleum platform.”
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CHAPTER 4: WHAT ENTERPRISES LEARNED & SILENCE (500vh) ─ */}
      <div className="c5-pin-wrapper chap-4-pin">
        <section className="c5-stage">
          {chap4Step < 3 ? (
            <div className="c5-content-wide">
              <div className="c5-tag">CHAPTER 04 // ENTERPRISE PROOF AT SCALE</div>
              <h2 className="c5-heading-medium">What Global Leaders Discovered</h2>

              <div className="c5-proof-card">
                <div className="c5-proof-image">
                  <img src={cases[chap4Step].photo} alt={cases[chap4Step].company} />
                </div>
                <div className="c5-proof-info">
                  <div className="c5-proof-loc">📍 {cases[chap4Step].location}</div>
                  <h3 className="c5-proof-stat">{cases[chap4Step].stat}</h3>
                  <p className="c5-proof-detail">{cases[chap4Step].detail}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="c5-content-narrow" style={{ textAlign: 'center' }}>
              <div className="c5-tag">CHAPTER 04 // THE PAUSE</div>
              <blockquote className="c5-silence-quote">
                “Companies build autonomous programs in silence.
                <br />
                <span className="c5-quote-dim">
                  The failed pilots. The procurement headaches. The boardroom debates.
                </span>
                <br />
                That conversation normally stays locked inside corporate walls.
                <br /><br />
                <strong>NestGen is the one day a year it doesn't.</strong>”
              </blockquote>
            </div>
          )}
        </section>
      </div>

      {/* ── CHAPTER 5: NESTGEN REVEAL & REGISTRATION (500vh) ───── */}
      <div className="c5-pin-wrapper chap-5-pin">
        <section className="c5-stage c5-stage-reveal">
          <div className="c5-content-narrow" style={{ textAlign: 'center' }}>
            <div className="c5-tag" style={{ color: 'var(--ink)' }}>SEPTEMBER 29, 2026 · ONLINE GLOBAL SUMMIT</div>
            <h1 className="c5-reveal-title">NESTGEN '26</h1>
            <p className="c5-reveal-sub">
              One day. Real architectures. Real failures. The exact playbooks behind autonomous drone operations.
            </p>

            <div className="c5-speaker-roster">
              {['UK POLICE (NPCC)', 'AIRBUS', 'SHELL', 'SQM CHILE', 'MPA SINGAPORE', 'CSX RAILWAYS'].map((spk, idx) => (
                <span key={idx} className="c5-speaker-badge">
                  ✔ {spk}
                </span>
              ))}
            </div>

            <div style={{ marginTop: '3rem' }}>
              <a
                href="https://nestgen.org"
                target="_blank"
                rel="noopener noreferrer"
                className="c5-cta-btn"
              >
                <span>ACCEPT MISSION BRIEFING & REGISTER</span>
                <span>→</span>
              </a>
              <div className="c5-cta-footnote">
                FREE TO ATTEND · LIFETIME ACCESS TO ALL SESSION RECORDINGS
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
