'use client';

import React from 'react';

interface DrewDroneProps {
  quote?: string;
  subQuote?: string;
  isIntro?: boolean;
  introStep?: number;
  isTurn?: boolean;
}

export default function DrewDrone({
  quote,
  subQuote,
  isIntro = false,
  introStep = 0,
  isTurn = false,
}: DrewDroneProps) {
  // Intro Sequence Lines
  const introLines = [
    "Hi, I'm Drew 👋",
    "I'll be flying you through your invitation to NestGen '26.",
    "Ready? Scroll down — let's go.",
  ];

  const currentQuote = isIntro ? introLines[introStep] || introLines[0] : quote;

  return (
    <div className={`drew-drone-container ${isTurn ? 'drew-turn-mode' : ''}`}>
      {/* SPEECH CLOUD BUBBLE */}
      {currentQuote && (
        <div className={`drew-speech-cloud ${isTurn ? 'cloud-turn' : ''}`}>
          <div className="cloud-header">
            <span>DREW // MISSION GUIDE</span>
            <span className="cloud-dot" />
          </div>
          <p className="cloud-text">{currentQuote}</p>
          {subQuote && <p className="cloud-text-sub">{subQuote}</p>}
          <div className="cloud-tail" />
        </div>
      )}

      {/* ORIGINAL PIXEL-ART DRONE FIGURE "DREW" */}
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

          {/* Main Body Chassis - Mustard & Forest Green */}
          <rect x="9" y="8" width="18" height="12" fill="#E4B12A" stroke="#2A1F16" strokeWidth="1.5" />
          <rect x="11" y="10" width="14" height="8" fill="#254A33" />

          {/* Center Optical AI Lens Camera - Glowing Green */}
          <rect x="15" y="12" width="6" height="5" fill="#11151C" stroke="#2A1F16" strokeWidth="1" />
          <circle cx="18" cy="14.5" r="1.5" fill="#00FF7F" className="drew-lens-pulse" />

          {/* Landing Skids */}
          <rect x="10" y="20" width="2" height="5" fill="#2A1F16" />
          <rect x="24" y="20" width="2" height="5" fill="#2A1F16" />
          <rect x="8" y="24" width="20" height="2" fill="#C96A35" />
        </svg>
      </div>
    </div>
  );
}
