'use client';

import React from 'react';

interface IcarusGuideProps {
  quote: string;
  visible?: boolean;
}

export default function IcarusGuide({ quote, visible = true }: IcarusGuideProps) {
  if (!visible || !quote) return null;

  return (
    <div className="icarus-guide-box">
      {/* ORIGINAL PIXEL-ART ICARUS WITH DRONE ROTOR / SOLAR WINGS */}
      <div className="icarus-avatar-frame">
        <svg
          width="44"
          height="44"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dark pixel outline */}
          <rect x="12" y="8" width="8" height="8" fill="#2A1F16" />
          {/* Head - Cream */}
          <rect x="13" y="9" width="6" height="6" fill="#EDE8DA" />
          {/* Goggles/Visor - Mustard */}
          <rect x="14" y="11" width="5" height="2" fill="#E4B12A" />
          
          {/* Body / Torso - Dark Forest */}
          <rect x="11" y="16" width="10" height="10" fill="#254A33" />
          <rect x="13" y="17" width="6" height="8" fill="#1A202C" />
          
          {/* SOLAR / DRONE ROTOR WING (LEFT) */}
          <path d="M 4,14 L 11,16 L 11,20 L 2,17 Z" fill="#E4B12A" stroke="#2A1F16" strokeWidth="1" />
          <line x1="6" y1="15" x2="6" y2="18" stroke="#C96A35" strokeWidth="1" />
          <line x1="8" y1="15.5" x2="8" y2="19" stroke="#C96A35" strokeWidth="1" />
          <circle cx="3" cy="14.5" r="2" fill="#00FF7F" />

          {/* SOLAR / DRONE ROTOR WING (RIGHT) */}
          <path d="M 28,14 L 21,16 L 21,20 L 30,17 Z" fill="#E4B12A" stroke="#2A1F16" strokeWidth="1" />
          <line x1="26" y1="15" x2="26" y2="18" stroke="#C96A35" strokeWidth="1" />
          <line x1="24" y1="15.5" x2="24" y2="19" stroke="#C96A35" strokeWidth="1" />
          <circle cx="29" cy="14.5" r="2" fill="#00FF7F" />
        </svg>
      </div>

      {/* ICARUS SCRIPTED NARRATIVE BUBBLE */}
      <div className="icarus-bubble">
        <div className="icarus-name-tag">ICARUS // FLIGHT LOG COPY</div>
        <p className="icarus-quote-text">“{quote}”</p>
      </div>
    </div>
  );
}
