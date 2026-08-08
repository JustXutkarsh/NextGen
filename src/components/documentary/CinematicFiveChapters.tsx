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
  const [selectedTrack, setSelectedTrack] = useState<string>('Oil & Gas');
  const [isMuted, setIsMuted] = useState(true);

  // Industry Track Speakers Data from NestGen26_Context.md
  const trackData: Record<string, { speakers: string[]; quote: string; photo: string }> = {
    'Public Safety': {
      speakers: ['UK Police (NPCC)', 'Belgian Police (Politie Westkust)', 'LA Metro', 'Fire Dept Kiel (BF Kiel)'],
      quote: 'Drones arrive on scene in under 2 minutes, cutting water-rescue response times by up to 7 minutes.',
      photo: '/photos/02_drone_software_console.png',
    },
    'Security': {
      speakers: ['Airbus', 'Texas Instruments', 'Antea Group', 'Titan Protection'],
      quote: 'Autonomous perimeter patrols cut break-in response times by 50% and operational costs by 60%.',
      photo: '/photos/verkos_security_dashboard.png',
    },
    'Maritime': {
      speakers: ['MPA Singapore (Maritime & Port Authority)', 'Port of Amsterdam'],
      quote: 'Expanded port surveillance range from 400m to 5km with under 90-second incident response.',
      photo: '/photos/site_gallery_05.png',
    },
    'Oil & Gas': {
      speakers: ['Shell Petroleum', 'Marathon Petroleum', 'YPF Argentina', 'EnBW'],
      quote: 'World’s first fully autonomous drone operation on a floating offshore oil platform in the North Sea.',
      photo: '/photos/oilgas_dashboard.png',
    },
    'Mining': {
      speakers: ['SQM Lithium Chile', 'First Quantum Minerals', 'Siyanda Platinum'],
      quote: 'Cut leak detection time from 3 days down to under 90 minutes across Atacama evaporation ponds.',
      photo: '/photos/dock_mountain_terrain.png',
    },
  };

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

      // ── CHAPTER 2: JOURNEY INTO A REAL FACILITY - CHILE (700vh) ──
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

      // ── CHAPTER 3: LIVE AI SCANNER - NORTH SEA SHELL (800vh) ──
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

          if (p < 0.2) setScanStage('SCANNING STORAGE TANK 4A...');
          else if (p < 0.45) setScanStage('CORROSION BOUNDING BOX DETECTED');
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

      // ── CHAPTER 3.5 & 4: WHAT THE CASE STUDY DOESN'T SHOW & PROOF (600vh) ──
      ScrollTrigger.create({
        trigger: '.chap-4-pin',
        start: 'top top',
        end: '+=4200',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.35) setChap4Step(0);      // CHAPTER 03.5: What the Case Study Doesn't Show
          else if (p < 0.6) setChap4Step(1); // Shell Case
          else if (p < 0.82) setChap4Step(2); // SQM Case
          else setChap4Step(3);               // CSX Case
        },
      });

      // ── CHAPTER 5: NESTGEN REVEAL & INTERACTIVE TRACK SELECTOR (500vh) ──
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

      {/* ── CHAPTER 2: JOURNEY INTO A REAL FACILITY - CHILE (MINING ONLY) (700vh) ── */}
      <div className="c5-pin-wrapper chap-2-pin">
        <section className="c5-stage">
          <div className="c5-content-wide">
            <div className="c5-tag">CHAPTER 02 // REAL INCIDENT DEPLOYMENT</div>
            <h2 className="c5-heading-medium">SQM Lithium Facility · Atacama Desert, Chile (2,400m Elevation)</h2>

            <div className="c5-media-frame">
              {/* Uses MINING ONLY imagery: dock_mountain_terrain.png & site_gallery_07.png */}
              <img
                src={chap2Step >= 3 ? '/photos/site_gallery_07.png' : '/photos/dock_mountain_terrain.png'}
                alt="Atacama Mining Facility"
                className="c5-media-img"
                style={{
                  transform: chap2Step === 1 ? 'scale(1.15)' : chap2Step >= 2 ? 'scale(1.3)' : 'scale(1)',
                  transition: 'transform 1s ease-out',
                }}
              />

              <div className="c5-media-caption">
                {chap2Step === 0 && <span>SATELLITE VIEW // SQM CHILE LITHIUM FACILITY</span>}
                {chap2Step === 1 && <span>ZOOMING TO EVAPORATION PONDS</span>}
                {chap2Step === 2 && <span>WEATHER: 4.2 KTS WINDS · SENSORS NOMINAL</span>}
                {chap2Step === 3 && <span>ROBOTIC DOCK DOORS UNLOCKED · ROTORS SPINNING</span>}
                {chap2Step >= 4 && <span style={{ color: 'var(--mission-green)' }}>TAKEOFF COMMENCED · BVLOS FLIGHT ACTIVE</span>}
              </div>
            </div>

            <div className="c5-text-body" style={{ marginTop: '2rem' }}>
              {chap2Step <= 2 ? (
                'In one of the world’s most desolate lithium facilities, manual leak inspection took days across vast evaporation ponds. Here, autonomous docks perform 24/7 BVLOS missions without human pilots.'
              ) : (
                'The automated dock powers up, verifies local weather telemetry, opens bay doors, and launches into autonomous flight.'
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── CHAPTER 3: LIVE AI SCANNER - NORTH SEA SHELL OIL & GAS (800vh) ── */}
      <div className="c5-pin-wrapper chap-3-pin">
        <section className="c5-stage c5-stage-dark">
          <div className="c5-inspection-grid">
            <div className="c5-inspection-media">
              {/* Reserved EXCLUSIVELY for Shell Oil & Gas North Sea */}
              <img
                src="/photos/oilgas_dashboard.png"
                alt="North Sea Platform Inspection"
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
              <div className="c5-location-tag">📍 NORTH SEA OFFSHORE PLATFORM // SHELL PETROLEUM</div>
              <div className="c5-tag">CHAPTER 03 // LIVE AI EDGE SCANNER</div>
              <h3 className="c5-sidebar-title">Scanning Storage Tank 4A</h3>

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
                “World’s first fully autonomous drone operation on a floating offshore oil platform in the North Sea.”
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CHAPTER 03.5 & 04: WHAT THE CASE STUDY DOESN'T SHOW & PROOF (600vh) ── */}
      <div className="c5-pin-wrapper chap-4-pin">
        <section className="c5-stage">
          {chap4Step === 0 ? (
            /* CHAPTER 03.5: WHAT THE CASE STUDY DOESN'T SHOW (QUIET TEXT MOMENT) */
            <div className="c5-content-narrow" style={{ textAlign: 'center' }}>
              <div className="c5-tag" style={{ color: 'var(--mustard)' }}>
                CHAPTER 03.5 // WHAT THE CASE STUDY DOESN'T SHOW
              </div>
              <blockquote className="c5-silence-quote">
                “These wins didn't happen overnight.
                <br /><br />
                <span className="c5-quote-dim">
                  There was a first pilot project that failed.
                  <br />
                  Months spent building the business case internally.
                  <br />
                  One person who finally said yes to the budget.
                </span>
                <br /><br />
                <strong>That part never makes the case study. At NestGen, it does.</strong>”
              </blockquote>
            </div>
          ) : (
            /* CHAPTER 04: PROOF AT SCALE */
            <div className="c5-content-wide">
              <div className="c5-tag">CHAPTER 04 // ENTERPRISE PROOF AT SCALE</div>
              <h2 className="c5-heading-medium">What Global Leaders Discovered</h2>

              <div className="c5-proof-card">
                <div className="c5-proof-image">
                  <img
                    src={
                      chap4Step === 1
                        ? '/photos/oilgas_dashboard.png'
                        : chap4Step === 2
                        ? '/photos/dock_mountain_terrain.png'
                        : '/photos/railyard_corrosion_dashboard.png'
                    }
                    alt="Proof Case"
                  />
                </div>
                <div className="c5-proof-info">
                  <div className="c5-proof-loc">
                    📍 {chap4Step === 1 ? 'North Sea Offshore Rig' : chap4Step === 2 ? 'Atacama Desert, Chile' : 'United States Rail Mesh'}
                  </div>
                  <h3 className="c5-proof-stat">
                    {chap4Step === 1 ? '100X Flight Frequency' : chap4Step === 2 ? '90 Min Leak Detection' : 'Credit-Card Rail Defects'}
                  </h3>
                  <p className="c5-proof-detail">
                    {chap4Step === 1
                      ? 'Shell operates fully autonomous dock flights on floating offshore oil platforms in heavy North Sea maritime weather.'
                      : chap4Step === 2
                      ? 'SQM Chile cut chemical leak detection time from 3 days down to under 90 minutes across vast evaporation ponds.'
                      : 'CSX identifies credit-card sized structural rail anomalies at 100ft altitude without shutting down live train tracks.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── CHAPTER 5: NESTGEN REVEAL & INTERACTIVE TRACK SELECTOR (500vh) ───── */}
      <div className="c5-pin-wrapper chap-5-pin">
        <section className="c5-stage c5-stage-reveal">
          <div className="c5-content-wide" style={{ textAlign: 'center' }}>
            <div className="c5-tag" style={{ color: 'var(--ink)' }}>SEPTEMBER 29, 2026 · ONLINE GLOBAL SUMMIT</div>
            <h1 className="c5-reveal-title">NESTGEN '26</h1>

            {/* REAL INTERACTIVE INDUSTRY TRACK SELECTOR */}
            <div className="c5-track-selector-title">
              SELECT YOUR INDUSTRY TRACK TO REVEAL CONFIRMED SPEAKERS & PLAYBOOKS:
            </div>

            <div className="c5-track-buttons">
              {Object.keys(trackData).map((track) => (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  className={`c5-track-btn ${selectedTrack === track ? 'active' : ''}`}
                >
                  {track}
                </button>
              ))}
            </div>

            {/* TRACK DETAILS DISPLAY */}
            <div className="c5-track-display">
              <div className="c5-track-speakers">
                <span className="c5-track-label">CONFIRMED SPEAKERS FOR {selectedTrack.toUpperCase()}:</span>
                <div className="c5-speaker-roster">
                  {trackData[selectedTrack].speakers.map((spk, idx) => (
                    <span key={idx} className="c5-speaker-badge">
                      ✔ {spk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="c5-track-quote">
                “{trackData[selectedTrack].quote}”
              </div>
            </div>

            {/* CLOSING THE NARRATIVE LOOP (ECHOING CHAPTER 01) */}
            <div className="c5-loop-quote">
              “Chapter 01 showed why humans still walk into the danger. On September 29th, hear from the pioneers proving it doesn't have to stay that way.”
            </div>

            <div style={{ marginTop: '2.5rem' }}>
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
