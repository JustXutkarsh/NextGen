'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { useMissionStore } from '@/store/useMissionStore';
import { sound } from '@/lib/sound';
import DrewFloatingOverlay from '@/components/ui/DrewFloatingOverlay';
import SunGlowOverlay from '@/components/ui/SunGlowOverlay';
import DragToCompare from '@/components/ui/DragToCompare';

gsap.registerPlugin(ScrollTrigger);

export default function CinematicFiveChapters() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  const { progress, setProgress, setStatus } = useMissionStore();

  // Chapter 04 Active Panel State (0 to 5)
  const [activePanelIdx, setActivePanelIdx] = useState(0);

  // Redaction Declassifying Click States
  const [isDeclassifiedCh1, setIsDeclassifiedCh1] = useState(false);
  const [isDeclassifiedTurn, setIsDeclassifiedTurn] = useState(false);

  // AI Scanner & UI States
  const [aiConfidence, setAiConfidence] = useState(12.0);
  const [scanStage, setScanStage] = useState('INITIALIZING');
  const [isThermal, setIsThermal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('Oil & Gas');
  const [isLockingTrack, setIsLockingTrack] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Company Chips Data for Chapter 04
  const companyChips = [
    { id: 0, label: '01 // SHELL PETROLEUM', loc: 'North Sea Rig', code: 'SHELL' },
    { id: 1, label: '02 // SQM CHILE', loc: 'Atacama Desert', code: 'SQM' },
    { id: 2, label: '03 // CSX RAILWAYS', loc: 'US Rail Mesh', code: 'CSX' },
    { id: 3, label: '04 // ENBW & AIRBUS', loc: 'Europe Fleet', code: 'ENBW' },
    { id: 4, label: '05 // MPA SINGAPORE', loc: 'Global Ports', code: 'MPA' },
    { id: 5, label: '06 // THE UNFILTERED TURN', loc: 'Internal Case Study', code: 'TURN' },
  ];

  // Industry Track Speakers Data
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

  const handleTrackSelect = (trackName: string) => {
    if (selectedTrack === trackName) return;
    setIsLockingTrack(true);
    sound.playLockOnConfirmSFX();
    setTimeout(() => {
      setSelectedTrack(trackName);
      setIsLockingTrack(false);
    }, 280);
  };

  // CHIP CLICK NAVIGATOR (WORKS ON DESKTOP & MOBILE)
  const handleChipClick = (id: number) => {
    setActivePanelIdx(id);
    const chip = companyChips[id];
    if (id === 5) {
      setStatus('CH 03.5 // UNFILTERED TURN STORY');
    } else {
      setStatus(`CH 04 // ${chip.code} // ${chip.label}`);
    }

    // Scroll directly to target panel element on mobile
    const panelEl = document.querySelector(`.horizontal-panel.panel-${id + 1}`);
    if (panelEl && window.innerWidth <= 768) {
      panelEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // FAST, SMOOTH CLICK-TO-DECLASSIFY HANDLERS
  const triggerDeclassifyCh1 = () => {
    if (isDeclassifiedCh1) return;
    setIsDeclassifiedCh1(true);
    sound.playDeclassifySFX();

    const bar = document.querySelector('#redact-bar-ch1');
    if (bar) {
      gsap.to(bar, {
        scaleX: 0,
        duration: 0.4,
        ease: 'power3.inOut',
      });
    }
  };

  const triggerDeclassifyTurn = () => {
    if (isDeclassifiedTurn) return;
    setIsDeclassifiedTurn(true);
    sound.playDeclassifySFX();

    const bar = document.querySelector('#redact-bar-turn');
    if (bar) {
      gsap.to(bar, {
        scaleX: 0,
        duration: 0.4,
        ease: 'power3.inOut',
      });
    }
  };

  // MAGNETIC REGISTER CTA BUTTON SETUP
  useEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xTo(relX * 0.3);
      yTo(relY * 0.3);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // MASTER SCROLLTRIGGER CHOREOGRAPHY
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. KINETIC TYPOGRAPHY REVEALS
      const headlines = document.querySelectorAll('.kinetic-headline');
      headlines.forEach((hl) => {
        const textObj = new SplitType(hl as HTMLElement, { types: 'chars' });
        if (textObj.chars) {
          gsap.from(textObj.chars, {
            opacity: 0,
            y: 35,
            rotateX: -90,
            stagger: 0.02,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: hl,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          });
        }
      });

      // 2. CHAPTER 01: THE ESSENCE
      ScrollTrigger.create({
        trigger: '.chap-1-pin',
        start: 'top top',
        end: '+=1800',
        pin: window.innerWidth > 768,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p * 0.2);
          setStatus('CH 01 // THE ESSENCE');
        },
      });

      // 3. CHAPTER 02: ATACAMA DISPATCH
      ScrollTrigger.create({
        trigger: '.chap-2-pin',
        start: 'top top',
        end: '+=2000',
        pin: window.innerWidth > 768,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(0.2 + p * 0.25);
          setStatus('CH 02 // ATACAMA ALTITUDE');
        },
      });

      // 4. CHAPTER 03: LIVE AI SCANNER
      ScrollTrigger.create({
        trigger: '.chap-3-pin',
        start: 'top top',
        end: '+=2400',
        pin: window.innerWidth > 768,
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(0.45 + p * 0.25);
          setStatus('CH 03 // LIVE AI SCANNER');

          const conf = Math.min(94.7, 12.0 + p * 82.7);
          setAiConfidence(parseFloat(conf.toFixed(1)));

          if (p < 0.25) setScanStage('SCANNING STORAGE TANK 4A...');
          else if (p < 0.5) setScanStage('CORROSION BOUNDING BOX DETECTED');
          else if (p < 0.75) {
            setScanStage('THERMAL HEATMAP CONFIRMATION');
            setIsThermal(true);
          } else {
            setScanStage('CRITICAL: STRUCTURAL CORROSION · AUTO WORK ORDER CREATED');
          }

          if (p > 0.05 && p < 0.95) {
            sound.playMechanicalTick();
          }
        },
      });

      // 5. CHAPTER 04: MATCHMEDIA DESKTOP PINNED HORIZONTAL VS MOBILE STACKED SCROLL
      const mm = gsap.matchMedia();

      // DESKTOP: PINNED HORIZONTAL CAROUSEL
      mm.add('(min-width: 769px)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel');

        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: 'none',
          scrollTrigger: {
            trigger: '.chap-4-horizontal-wrapper',
            pin: true,
            scrub: 0.8,
            end: () => '+=' + (panels.length * window.innerWidth * 0.55),
            onUpdate: (self) => {
              const p = self.progress;
              setProgress(0.7 + p * 0.15);

              const idx = Math.min(5, Math.floor(p * 5.99));
              setActivePanelIdx(idx);

              const currentChip = companyChips[idx];
              if (idx === 5) {
                setStatus('CH 03.5 // UNFILTERED TURN STORY');
              } else {
                setStatus(`CH 04 // ${currentChip.code} // ${currentChip.label}`);
              }
            },
          },
        });
      });

      // MOBILE (< 769px): NATURAL STACKED SCROLL WITH CARD SCROLL TRIGGER DETECT
      mm.add('(max-width: 768px)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.horizontal-panel');

        panels.forEach((panel, idx) => {
          ScrollTrigger.create({
            trigger: panel,
            start: 'top 65%',
            end: 'bottom 35%',
            onEnter: () => updateMobilePanel(idx),
            onEnterBack: () => updateMobilePanel(idx),
          });
        });

        function updateMobilePanel(idx: number) {
          setActivePanelIdx(idx);
          const currentChip = companyChips[idx];
          if (idx === 5) {
            setStatus('CH 03.5 // UNFILTERED TURN STORY');
          } else {
            setStatus(`CH 04 // ${currentChip.code} // ${currentChip.label}`);
          }
        }
      });

      // 6. CHAPTER 05: NESTGEN REVEAL & CTA
      ScrollTrigger.create({
        trigger: '.chap-5-pin',
        start: 'top top',
        end: '+=1800',
        pin: window.innerWidth > 768,
        scrub: 0.8,
        onUpdate: (self) => {
          setProgress(0.85 + self.progress * 0.15);
          setStatus('CH 05 // NESTGEN BRIEFING');
        },
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, [setProgress, setStatus]);

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
        ctx.font = '10px "Chakra Petch", monospace';
        ctx.fillText(`ANOMALY #01 [${aiConfidence}%]`, canvas.width * 0.25, canvas.height * 0.28 - 10);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [aiConfidence]);

  return (
    <div ref={containerRef} className="c5-container">
      {/* ATMOSPHERIC SUN GLOW BACKGROUND */}
      <SunGlowOverlay progress={progress} />

      {/* DREW FLOATING OVERLAY */}
      <DrewFloatingOverlay />

      {/* Sound Toggle */}
      <button onClick={toggleSound} className="c5-sound-toggle">
        {isMuted ? 'SOUND: OFF' : '🔊 SOUND: ON'}
      </button>

      {/* ── CHAPTER 1: THE ESSENCE (WITH DRAG-TO-COMPARE & CLICK-TO-DECLASSIFY) ── */}
      <div className="c5-pin-wrapper chap-1-pin">
        <section className="c5-stage">
          <div className="c5-content-narrow">
            <div className="c5-tag display-font">CHAPTER 01 // THE ESSENCE</div>

            <h1 className="c5-heading-large kinetic-headline display-font">
              Industrial inspection still depends on{' '}
              <span
                className={`redact-wrap ${isDeclassifiedCh1 ? 'declassified' : ''}`}
                onClick={triggerDeclassifyCh1}
                title="Click to declassify"
              >
                <span className="redact-text">humans walking dangerous facilities.</span>
                <span id="redact-bar-ch1" className="redact-bar" />
              </span>
            </h1>

            <button
              onClick={triggerDeclassifyCh1}
              className="declassify-label-hint"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {isDeclassifiedCh1 ? '✔ DECLASSIFIED FILE' : '[ CLICK TO DECLASSIFY CLASSIFIED TEXT ]'}
            </button>

            {/* INTERACTIVE DRAG-TO-COMPARE SLIDER */}
            <div style={{ margin: '2rem 0' }}>
              <DragToCompare />
            </div>

            <p className="c5-text-body highlight mono-font">
              Physical AI changes the equation—from reactive repairs after failure to continuous autonomous vigilance.
            </p>

            <div className="c5-scroll-prompt display-font">
              <span>SCROLL TO ENTER ATACAMA FACILITY</span>
              <span className="c5-prompt-arrow">↓</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── CHAPTER 2: ATACAMA ALTITUDE (SQM CHILE) ────────────── */}
      <div className="c5-pin-wrapper chap-2-pin">
        <section className="c5-stage">
          <div className="c5-content-wide">
            <div className="c5-tag display-font">CHAPTER 02 // REAL INCIDENT DEPLOYMENT</div>
            <h2 className="c5-heading-medium kinetic-headline display-font">
              SQM Lithium Facility · Atacama Desert, Chile
            </h2>

            <div className="c5-media-frame c2-parallax-box">
              <img
                src="/photos/dock_mountain_terrain.png"
                alt="Atacama Mining Facility"
                className="c5-media-img c2-layer-bg"
              />

              <div className="c2-layer-fg c5-media-caption mono-font">
                <span>LAT: -23.8647° | ELEVATION: 2,400M | SQM LITHIUM FACILITY</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CHAPTER 3: LIVE AI SCANNER (SHELL NORTH SEA) ───────── */}
      <div className="c5-pin-wrapper chap-3-pin">
        <section className="c5-stage c5-stage-dark">
          <div className="c5-inspection-grid">
            <div className="c5-inspection-media">
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
              <div className="c5-location-tag display-font">📍 NORTH SEA OFFSHORE PLATFORM // SHELL PETROLEUM</div>
              <div className="c5-tag display-font">CHAPTER 03 // LIVE AI EDGE SCANNER</div>
              <h3 className="c5-sidebar-title kinetic-headline display-font">Scanning Storage Tank 4A</h3>

              <div className="c5-confidence-box">
                <span className="c5-confidence-label mono-font">CONFIDENCE RATING (SCRUB-LINKED TICKER)</span>
                <span className="c5-confidence-val display-font">{aiConfidence}%</span>
                <div className="c5-confidence-bar">
                  <div className="c5-confidence-fill" style={{ width: `${aiConfidence}%` }} />
                </div>
              </div>

              <div className="c5-scan-stage-badge mono-font">
                STATUS: {scanStage}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── CHAPTER 04: PINNED HORIZONTAL BREAKOUT WITH PEEKING PANELS ── */}
      <div className="chap-4-horizontal-wrapper">
        <div className="chap-4-ambient-bg">
          <div className="chap-4-grid-lines" />
          <div className="chap-4-radar-sweep" />
        </div>

        <div className="chap-4-chip-header">
          <div className="chip-header-label display-font">CLASSIFIED ENTERPRISE DOSSIERS // PROOF AT SCALE</div>
          <div className="chip-header-row">
            {companyChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => handleChipClick(chip.id)}
                className={`company-chip ${activePanelIdx === chip.id ? 'active' : ''}`}
                style={{ cursor: 'pointer', background: 'none', border: '1px solid var(--dark-border)' }}
              >
                <span className="chip-indicator">{activePanelIdx === chip.id ? '●' : '○'}</span>
                <span className="chip-title mono-font">{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="horizontal-panels-container">
          {/* PANEL 1: SHELL PETROLEUM */}
          <div className={`horizontal-panel panel-1 ${activePanelIdx === 0 ? 'panel-active' : 'panel-peeking'}`}>
            <div
              className="panel-inner panel-card-bg"
              style={{ backgroundImage: 'linear-gradient(to top, rgba(10,14,20,0.96) 20%, rgba(10,14,20,0.65) 100%), url(/photos/oilgas_dashboard.png)' }}
            >
              <div className="c5-tag display-font">CHAPTER 04 // ENTERPRISE PROOF</div>
              <div className="c5-proof-loc mono-font">📍 North Sea Offshore Oil Platform</div>
              <h2 className="c5-proof-stat display-font">SHELL PETROLEUM</h2>
              <div className="panel-metric display-font">100X FLIGHT FREQUENCY</div>
              <p className="c5-proof-detail mono-font">
                Shell operates fully autonomous dock flights on floating offshore oil platforms in heavy North Sea maritime weather without human pilots onboard.
              </p>
            </div>
          </div>

          {/* PANEL 2: SQM LITHIUM CHILE */}
          <div className={`horizontal-panel panel-2 ${activePanelIdx === 1 ? 'panel-active' : 'panel-peeking'}`}>
            <div
              className="panel-inner panel-card-bg"
              style={{ backgroundImage: 'linear-gradient(to top, rgba(10,14,20,0.96) 20%, rgba(10,14,20,0.65) 100%), url(/photos/dock_mountain_terrain.png)' }}
            >
              <div className="c5-tag display-font">CHAPTER 04 // ENTERPRISE PROOF</div>
              <div className="c5-proof-loc mono-font">📍 Atacama Desert, Chile</div>
              <h2 className="c5-proof-stat display-font">SQM LITHIUM</h2>
              <div className="panel-metric display-font">90 MIN LEAK DETECTION</div>
              <p className="c5-proof-detail mono-font">
                SQM Chile cut chemical leak detection time from 3 days down to under 90 minutes across vast lithium evaporation ponds.
              </p>
            </div>
          </div>

          {/* PANEL 3: CSX TRANSPORTATION */}
          <div className={`horizontal-panel panel-3 ${activePanelIdx === 2 ? 'panel-active' : 'panel-peeking'}`}>
            <div
              className="panel-inner panel-card-bg"
              style={{ backgroundImage: 'linear-gradient(to top, rgba(10,14,20,0.96) 20%, rgba(10,14,20,0.65) 100%), url(/photos/verkos_security_dashboard.png)' }}
            >
              <div className="c5-tag display-font">CHAPTER 04 // ENTERPRISE PROOF</div>
              <div className="c5-proof-loc mono-font">📍 United States Rail Mesh</div>
              <h2 className="c5-proof-stat display-font">CSX TRANSPORTATION</h2>
              <div className="panel-metric display-font">CREDIT-CARD RAIL DEFECTS</div>
              <p className="c5-proof-detail mono-font">
                CSX identifies credit-card sized structural rail anomalies at 100ft altitude without shutting down live passenger or freight tracks.
              </p>
            </div>
          </div>

          {/* PANEL 4: ENBW SOLAR & AIRBUS */}
          <div className={`horizontal-panel panel-4 ${activePanelIdx === 3 ? 'panel-active' : 'panel-peeking'}`}>
            <div
              className="panel-inner panel-card-bg"
              style={{ backgroundImage: 'linear-gradient(to top, rgba(10,14,20,0.96) 20%, rgba(10,14,20,0.65) 100%), url(/photos/site_gallery_05.png)' }}
            >
              <div className="c5-tag display-font">CHAPTER 04 // ENTERPRISE PROOF</div>
              <div className="c5-proof-loc mono-font">📍 Germany & European Solar Grids</div>
              <h2 className="c5-proof-stat display-font">ENBW SOLAR & AIRBUS</h2>
              <div className="panel-metric display-font">60% COST REDUCTION</div>
              <p className="c5-proof-detail mono-font">
                EnBW & Airbus deploy autonomous dock fleets for solar panel thermography and perimeter security, slashing security response times by 50%.
              </p>
            </div>
          </div>

          {/* PANEL 5: MPA SINGAPORE & UK POLICE */}
          <div className={`horizontal-panel panel-5 ${activePanelIdx === 4 ? 'panel-active' : 'panel-peeking'}`}>
            <div
              className="panel-inner panel-card-bg"
              style={{ backgroundImage: 'linear-gradient(to top, rgba(10,14,20,0.96) 20%, rgba(10,14,20,0.65) 100%), url(/photos/02_drone_software_console.png)' }}
            >
              <div className="c5-tag display-font">CHAPTER 04 // ENTERPRISE PROOF</div>
              <div className="c5-proof-loc mono-font">📍 Port of Singapore & UK NPCC</div>
              <h2 className="c5-proof-stat display-font">MPA SINGAPORE & UK POLICE</h2>
              <div className="panel-metric display-font">&lt; 90 SEC INCIDENT DISPATCH</div>
              <p className="c5-proof-detail mono-font">
                Expanded commercial port surveillance from 400m to 5km, dispatching autonomous first-responder aerial support in under 90 seconds.
              </p>
            </div>
          </div>

          {/* PANEL 6: THE UNFILTERED TURN */}
          <div className={`horizontal-panel panel-6 ${activePanelIdx === 5 ? 'panel-active' : 'panel-peeking'}`}>
            <div className="panel-inner text-center" style={{ background: '#000', border: '1px solid var(--mustard)' }}>
              <div className="c5-tag display-font" style={{ color: 'var(--mustard)' }}>
                THE TURN // WHAT THE CASE STUDY DOESN'T SHOW
              </div>

              <blockquote className="c5-silence-quote display-font" style={{ marginTop: '1.5rem' }}>
                <span
                  className={`redact-wrap ${isDeclassifiedTurn ? 'declassified' : ''}`}
                  onClick={triggerDeclassifyTurn}
                  title="Click to declassify"
                >
                  <span className="redact-text">That part doesn't usually make it into the case study. At NestGen, it does.</span>
                  <span id="redact-bar-turn" className="redact-bar" />
                </span>
              </blockquote>

              <button
                onClick={triggerDeclassifyTurn}
                className="declassify-label-hint"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '0.8rem' }}
              >
                {isDeclassifiedTurn ? '✔ DECLASSIFIED FILE' : '[ CLICK TO DECLASSIFY CLASSIFIED TEXT ]'}
              </button>
            </div>
          </div>
        </div>

        <div className="chap-4-progress-dots">
          {companyChips.map((chip) => (
            <span
              key={chip.id}
              className={`progress-dot ${activePanelIdx === chip.id ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* ── CHAPTER 5: NESTGEN REVEAL & CTA ────────────────────── */}
      <div className="c5-pin-wrapper chap-5-pin">
        <section className="c5-stage c5-stage-reveal">
          <div className="c5-content-wide" style={{ textAlign: 'center' }}>
            <div className="c5-tag display-font" style={{ color: 'var(--ink)' }}>SEPTEMBER 29, 2026 · ONLINE GLOBAL SUMMIT</div>
            <h1 className="c5-reveal-title kinetic-headline display-font">NESTGEN '26</h1>

            <div className="c5-track-selector-title display-font" style={{ marginTop: '1.5rem' }}>
              TARGET LOCK // SELECT AN INDUSTRY TRACK TO REVEAL CONFIRMED SPEAKERS & PLAYBOOKS:
            </div>

            <div className="c5-track-buttons">
              {Object.keys(trackData).map((track) => (
                <button
                  key={track}
                  onClick={() => handleTrackSelect(track)}
                  className={`c5-track-btn display-font ${selectedTrack === track ? 'active' : ''} ${isLockingTrack ? 'locking' : ''}`}
                >
                  <span className="track-icon">🎯</span> {track}
                </button>
              ))}
            </div>

            <div className={`c5-track-display ${isLockingTrack ? 'target-locking' : ''}`}>
              <div className="c5-track-speakers">
                <span className="c5-track-label display-font">CONFIRMED SPEAKERS FOR {selectedTrack.toUpperCase()}:</span>
                <div className="c5-speaker-roster">
                  {trackData[selectedTrack].speakers.map((spk, idx) => (
                    <span key={idx} className="c5-speaker-badge display-font">
                      ✔ {spk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="c5-track-quote mono-font">
                “{trackData[selectedTrack].quote}”
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <a
                ref={ctaBtnRef}
                href="https://nestgen.org"
                target="_blank"
                rel="noopener noreferrer"
                className="c5-cta-btn register-btn display-font"
              >
                <span>ACCEPT MISSION BRIEFING & REGISTER</span>
                <span>→</span>
              </a>
              <div className="c5-cta-footnote mono-font">
                FREE TO ATTEND · LIFETIME ACCESS TO ALL SESSION RECORDINGS
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
