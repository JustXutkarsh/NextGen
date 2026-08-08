'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMissionStore } from '@/store/useMissionStore';

export default function DrewFloatingOverlay() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const { activeStatus } = useMissionStore();

  const [introStep, setIntroStep] = useState(0);
  const [isCursorEnabled, setIsCursorEnabled] = useState(false);

  // INTRO SCRIPT LINES
  const introLines = [
    "Hi, I'm Drew 👋",
    "I'll be flying you through your invitation to NestGen '26.",
    "Ready? Scroll down — let's go.",
  ];

  // NARRATION LINES BASED ON SCROLL / MISSION STATUS
  const getSpeechLine = (): { quote: string; sub?: string; isTurn?: boolean } | null => {
    if (!isCursorEnabled) {
      return { quote: introLines[introStep] || introLines[0] };
    }

    if (activeStatus.includes('CH 01') || activeStatus.includes('THE ESSENCE') || activeStatus.includes('HOOK')) {
      return {
        quote: "First, here's the problem I get sent in to solve.",
        sub: "Industrial inspection still depends on humans walking into dangerous places.",
      };
    }
    if (activeStatus.includes('CH 02') || activeStatus.includes('ATACAMA')) {
      return {
        quote: "This is Atacama, Chile. 2,400 meters up.",
        sub: "I fly here so no one else has to climb it.",
      };
    }
    if (activeStatus.includes('CH 03') || activeStatus.includes('LIVE AI') || activeStatus.includes('SCANNER')) {
      return {
        quote: "Watch — I'm scanning Holding Tank 4A right now.",
      };
    }
    if (activeStatus.includes('CH 03.5') || activeStatus.includes('TURN') || activeStatus.includes('UNFILTERED')) {
      return {
        quote: "Can I be honest with you for a second?",
        sub: "Not every flight worked the first time. There were failed pilots. Budget fights. Someone who almost said no. That part doesn't usually make it into the case study. At NestGen, it does.",
        isTurn: true,
      };
    }
    if (activeStatus.includes('CH 04') || activeStatus.includes('ENTERPRISE')) {
      return {
        quote: "Shell didn't take my word for it either.",
        sub: "Now they run flights 100x more often than before.",
      };
    }
    if (activeStatus.includes('CH 05') || activeStatus.includes('NESTGEN BRIEFING')) {
      return {
        quote: "That's everything I wanted to show you.",
        sub: "September 29th, online — meet the people who actually built this with me.",
      };
    }

    return {
      quote: "Curious which industry this hits closest to home for you?",
    };
  };

  // INTRO SEQUENCE & CURSOR-FOLLOWING GSAP SETUP
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const body = bodyRef.current;
    if (!wrapper || !body) return;

    // 1. Initial Intro Swoop Sequence (Centered Screen)
    gsap.set(wrapper, {
      x: window.innerWidth * 0.35,
      y: window.innerHeight * 0.28,
    });

    const introTl = gsap.timeline({
      onComplete: () => {
        // Enable mousemove quickTo trailing after intro
        setIsCursorEnabled(true);
      },
    });

    introTl.fromTo(
      wrapper,
      { scale: 0, opacity: 0, y: -150 },
      { scale: 1, opacity: 1, y: window.innerHeight * 0.28, duration: 1.2, ease: 'back.out(1.4)' }
    );

    // Intro step timers
    const t1 = setTimeout(() => setIntroStep(1), 1500);
    const t2 = setTimeout(() => setIntroStep(2), 3000);
    const t3 = setTimeout(() => setIsCursorEnabled(true), 4500);

    // 2. Continuous Idle Bob & Rotation on #drew-body (Separated from quickTo wrapper)
    const idleTween = gsap.to(body, {
      y: '+=6',
      rotation: 2,
      duration: 1.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => {
      introTl.kill();
      idleTween.kill();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // REAL-TIME CURSOR-FOLLOWING (`quickTo` with 0.45s power3 ease)
  useEffect(() => {
    if (!isCursorEnabled || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    // GSAP quickTo setters for buttery, lagged-follow motion
    const xTo = gsap.quickTo(wrapper, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(wrapper, 'y', { duration: 0.45, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      // Offset by +35px X & +25px Y so Drew never covers the cursor or blocks clicks
      xTo(e.clientX + 35);
      yTo(e.clientY + 25);
    };

    const mm = gsap.matchMedia();

    // Desktop: Cursor Trail
    mm.add('(pointer: fine)', () => {
      window.addEventListener('mousemove', handleMouseMove);
    });

    // Mobile / Touch: Autonomous Idle Orbit Drift Loop
    mm.add('(pointer: coarse), (max-width: 768px)', () => {
      gsap.to(wrapper, {
        x: '+=40',
        y: '+=30',
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      mm.revert();
    };
  }, [isCursorEnabled]);

  const speechData = getSpeechLine();

  return (
    <div
      ref={wrapperRef}
      className="drew-floating-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9500,
        pointerEvents: 'none',
      }}
    >
      <div ref={bodyRef} className="drew-floating-body">
        {/* SPEECH CLOUD BUBBLE */}
        {speechData && (
          <div className={`drew-speech-cloud ${speechData.isTurn ? 'cloud-turn' : ''}`}>
            <div className="cloud-header">
              <span>DREW // MISSION GUIDE</span>
              <span className="cloud-dot" />
            </div>
            <p className="cloud-text">{speechData.quote}</p>
            {speechData.sub && <p className="cloud-text-sub">{speechData.sub}</p>}
            <div className="cloud-tail" />
          </div>
        )}

        {/* ORIGINAL PIXEL-ART DRONE SPRITE */}
        <div className="drew-drone-sprite">
          <svg
            width="54"
            height="44"
            viewBox="0 0 36 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Left Propeller (Animated spinning blades) */}
            <g className="drew-propeller">
              <rect x="2" y="2" width="10" height="2" fill="#E4B12A" />
              <rect x="6" y="0" width="2" height="6" fill="#EDE8DA" />
            </g>

            {/* Top Right Propeller */}
            <g className="drew-propeller">
              <rect x="24" y="2" width="10" height="2" fill="#E4B12A" />
              <rect x="28" y="0" width="2" height="6" fill="#EDE8DA" />
            </g>

            {/* Quadcopter Arms */}
            <rect x="5" y="6" width="26" height="3" fill="#2A1F16" />

            {/* Main Body Chassis */}
            <rect x="9" y="8" width="18" height="12" fill="#E4B12A" stroke="#2A1F16" strokeWidth="1.5" />
            <rect x="11" y="10" width="14" height="8" fill="#254A33" />

            {/* Center Optical AI Lens Camera */}
            <rect x="15" y="12" width="6" height="5" fill="#11151C" stroke="#2A1F16" strokeWidth="1" />
            <circle cx="18" cy="14.5" r="1.5" fill="#00FF7F" className="drew-lens-pulse" />

            {/* Landing Skids */}
            <rect x="10" y="20" width="2" height="5" fill="#2A1F16" />
            <rect x="24" y="20" width="2" height="5" fill="#2A1F16" />
            <rect x="8" y="24" width="20" height="2" fill="#C96A35" />
          </svg>
        </div>
      </div>
    </div>
  );
}
