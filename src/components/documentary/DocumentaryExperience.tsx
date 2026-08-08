'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sound } from '@/lib/sound';

gsap.registerPlugin(ScrollTrigger);

export default function DocumentaryExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [aiConfidence, setAiConfidence] = useState(12.0);
  const [isThermal, setIsThermal] = useState(false);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Toggle Audio
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // GSAP Editorial Scroll Reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in each editorial chapter smoothly as user scrolls into view
      const chapters = gsap.utils.toArray<HTMLElement>('.doc-chapter');
      chapters.forEach((chap) => {
        gsap.fromTo(
          chap,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: chap,
              start: 'top 75%',
              end: 'top 25%',
              scrub: 0.5,
            },
          }
        );
      });

      // Inspection Pin Sequence: Scroll drives live AI scan confidence 12% -> 94.7%
      ScrollTrigger.create({
        trigger: '.doc-inspection-pin',
        start: 'top top',
        end: '+=2500',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const conf = Math.min(94.7, 12.0 + p * 82.7);
          setAiConfidence(parseFloat(conf.toFixed(1)));
          if (p > 0.1 && p < 0.9) {
            sound.playScanBeep();
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Canvas Laser Scanner Render
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

      // Clean Laser Line
      scanY = (scanY + 2) % canvas.height;
      ctx.strokeStyle = '#E4B12A';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#E4B12A';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();

      // Corrosion Defect Bounding Box
      ctx.strokeStyle = '#C96A35';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#C96A35';
      ctx.shadowBlur = 12;
      ctx.strokeRect(canvas.width * 0.25, canvas.height * 0.28, 220, 160);

      ctx.fillStyle = '#E4B12A';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.fillText(`ANOMALY #01 [${aiConfidence}%]`, canvas.width * 0.25, canvas.height * 0.28 - 10);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [aiConfidence]);

  const cases = [
    {
      company: 'SHELL PETROLEUM',
      location: 'North Sea Offshore Rig',
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

  const currentCase = cases[activeCaseIndex];

  return (
    <div ref={containerRef} className="doc-container">
      {/* Sound Toggle (Minimal, bottom-right) */}
      <button onClick={toggleSound} className="doc-sound-toggle">
        {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
      </button>

      {/* ── CHAPTER 1: COLD OPEN ───────────────────────────── */}
      <section className="doc-chapter doc-chapter-hero">
        <div className="doc-content-narrow">
          <div className="doc-tag">SEPTEMBER 29, 2026 · ONLINE</div>
          <h1 className="doc-hero-title">NESTGEN '26</h1>
          <p className="doc-hero-subtitle">
            An investigative look at how global enterprises deploy physical AI and autonomous drone fleets.
          </p>
          <div className="doc-scroll-indicator">
            <span className="doc-scroll-dot" />
            <span>SCROLL TO READ STORY</span>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 2: WHAT IS NESTGEN? ────────────────────── */}
      <section className="doc-chapter">
        <div className="doc-content-narrow">
          <div className="doc-chapter-num">01 // THE ESSENCE</div>
          <h2 className="doc-section-title">What is NestGen?</h2>
          <p className="doc-body-text">
            Every day, thousands of autonomous drones take off from robotic docks across oil refineries, mining facilities, power grids, and commercial ports.
          </p>
          <p className="doc-body-text">
            They operate without human pilots. They detect structural corrosion, security breaches, and equipment anomalies in real time using edge AI.
          </p>
          <p className="doc-body-text highlight">
            Yet the technical playbooks behind these deployments are almost never shared publicly.
          </p>
        </div>
      </section>

      {/* ── CHAPTER 3: THE UNSPOKEN PROBLEM ────────────────── */}
      <section className="doc-chapter">
        <div className="doc-content-narrow">
          <div className="doc-chapter-num">02 // THE PROBLEM</div>
          <h2 className="doc-section-title">Why Industrial Inspection Fails</h2>
          <p className="doc-body-text">
            Traditional industrial inspection is slow, hazardous, and reactive. Humans walk vast facilities with handheld cameras, often missing subtle defects until catastrophic failure occurs.
          </p>
          <p className="doc-body-text">
            FlytBase developed the software layer that transforms off-the-shelf drones and docks into an autonomous, 24/7 physical AI mesh.
          </p>
        </div>
      </section>

      {/* ── CHAPTER 4: A REAL INCIDENT ──────────────────────── */}
      <section className="doc-chapter">
        <div className="doc-content-wide">
          <div className="doc-chapter-num">03 // REAL-WORLD INCIDENT</div>
          <h2 className="doc-section-title">Incident at Atacama Desert, Chile</h2>
          <div className="doc-media-frame">
            <img src="/photos/dock_mountain_terrain.png" alt="Atacama Site" className="doc-media-img" />
            <div className="doc-media-caption">
              <span>LOCATION: ATACAMA DESERT, CHILE (2,400M ELEVATION)</span>
              <span>SITE: SQM LITHIUM EXTRACTION FACILITY</span>
            </div>
          </div>
          <p className="doc-body-text" style={{ marginTop: '2rem' }}>
            In one of the most remote regions on Earth, a pipeline leak can cause millions in damage before a ground crew notices. Here, manual inspection is practically impossible.
          </p>
        </div>
      </section>

      {/* ── CHAPTER 5: AUTONOMOUS DISPATCH ─────────────────── */}
      <section className="doc-chapter">
        <div className="doc-content-wide">
          <div className="doc-chapter-num">04 // AUTONOMOUS DEPLOYMENT</div>
          <h2 className="doc-section-title">The Dock Opens</h2>
          <div className="doc-media-frame">
            <img src="/photos/site_gallery_07.png" alt="FlytBase Dock Takeoff" className="doc-media-img" />
            <div className="doc-media-caption">
              <span>FLYTBASE ROBOTIC DOCK #04</span>
              <span>STATUS: DISPATCHED · NO HUMAN PILOTS ON SITE</span>
            </div>
          </div>
          <p className="doc-body-text" style={{ marginTop: '2rem' }}>
            An automated weather station verifies wind speeds below 15 knots. Bay doors open. The drone lifts off, executing a pre-programmed BVLOS (Beyond Visual Line of Sight) flight path.
          </p>
        </div>
      </section>

      {/* ── CHAPTER 6: THE LIVE INSPECTION (PINNED SCANNER) ── */}
      <div className="doc-inspection-pin">
        <section className="doc-chapter-pinned">
          <div className="doc-inspection-grid">
            <div className="doc-inspection-media">
              <img
                src="/photos/oilgas_dashboard.png"
                alt="Inspection View"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: isThermal ? 'hue-rotate(180deg) invert(0.9) contrast(1.4)' : 'brightness(0.9)',
                }}
              />
              <canvas ref={scanCanvasRef} className="doc-scan-canvas" />

              <button onClick={() => setIsThermal(!isThermal)} className="doc-vision-toggle">
                VISION: {isThermal ? 'THERMAL [ON]' : 'RGB [ON]'}
              </button>
            </div>

            <div className="doc-inspection-sidebar">
              <div className="doc-chapter-num">05 // LIVE EDGE AI ANALYSIS</div>
              <h3 className="doc-sidebar-title">Scanning Holding Tank 4A</h3>
              <div className="doc-confidence-box">
                <span className="doc-confidence-label">AI CONFIDENCE SCORE</span>
                <span className="doc-confidence-val">{aiConfidence}%</span>
                <div className="doc-confidence-bar">
                  <div className="doc-confidence-fill" style={{ width: `${aiConfidence}%` }} />
                </div>
              </div>
              <div className="doc-analysis-notes">
                <div>✔ ANOMALY: STRUCTURAL CORROSION</div>
                <div>✔ SEVERITY: CRITICAL (ACTION REQUIRED)</div>
                <div>✔ AUTO WORK ORDER: CREATED (#WO-9921)</div>
              </div>
              <div className="doc-quote-callout">
                “This wasn't a simulated demo. This happened at a North Sea petroleum facility.”
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CHAPTER 7: PROOF AT SCALE ──────────────────────── */}
      <section className="doc-chapter">
        <div className="doc-content-wide">
          <div className="doc-chapter-num">06 // DEPLOYMENT AT SCALE</div>
          <h2 className="doc-section-title">Proven Across Global Enterprises</h2>

          <div className="doc-tab-buttons">
            {cases.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveCaseIndex(i)}
                className={`doc-tab-btn ${activeCaseIndex === i ? 'active' : ''}`}
              >
                {c.company}
              </button>
            ))}
          </div>

          <div className="doc-case-card">
            <div className="doc-case-image">
              <img src={currentCase.photo} alt={currentCase.company} />
            </div>
            <div className="doc-case-info">
              <div className="doc-case-location">📍 {currentCase.location}</div>
              <h3 className="doc-case-stat">{currentCase.stat}</h3>
              <p className="doc-case-detail">{currentCase.detail}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 8: SILENCE (THE PAUSE) ─────────────────── */}
      <section className="doc-chapter doc-chapter-silence">
        <div className="doc-content-narrow" style={{ textAlign: 'center' }}>
          <div className="doc-chapter-num" style={{ color: 'var(--mustard)' }}>07 // WHY NESTGEN EXISTS</div>
          <blockquote className="doc-silence-quote">
            “Companies build autonomous programs in silence.
            <br />
            <span className="doc-quote-highlight">
              The failed pilots. The procurement headaches. The boardroom debates.
            </span>
            <br />
            That conversation normally stays locked inside corporate walls.
            <br /><br />
            <strong>NestGen is the one day a year it doesn't.</strong>”
          </blockquote>
        </div>
      </section>

      {/* ── CHAPTER 9: THE EARNED REVEAL & CTA ─────────────── */}
      <section className="doc-chapter doc-chapter-reveal">
        <div className="doc-content-narrow" style={{ textAlign: 'center' }}>
          <div className="doc-tag" style={{ color: 'var(--ink)' }}>SEPTEMBER 29, 2026 · ONLINE GLOBAL SUMMIT</div>
          <h2 className="doc-reveal-title">NESTGEN '26</h2>
          <p className="doc-reveal-sub">
            One day. Real architectures. Real failures. The exact playbooks behind autonomous drone operations.
          </p>

          <div className="doc-speaker-roster">
            {['UK POLICE (NPCC)', 'AIRBUS', 'SHELL', 'SQM CHILE', 'MPA SINGAPORE', 'CSX RAILWAYS'].map((spk, idx) => (
              <span key={idx} className="doc-speaker-badge">
                ✔ {spk}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '3rem' }}>
            <a
              href="https://nestgen.org"
              target="_blank"
              rel="noopener noreferrer"
              className="doc-cta-btn"
            >
              <span>ACCEPT MISSION BRIEFING & REGISTER</span>
              <span>→</span>
            </a>
            <div className="doc-cta-footnote">
              FREE TO ATTEND · LIFETIME ACCESS TO ALL SESSION RECORDINGS
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
