'use client';

import React from 'react';

interface SunGlowOverlayProps {
  progress: number; // 0.0 to 1.0
}

export default function SunGlowOverlay({ progress }: SunGlowOverlayProps) {
  // Compute sun intensity and color temperature based on scroll depth:
  // 0.00 - 0.20: Subtle warm horizon glow (opacity 0.15)
  // 0.20 - 0.50: INTENSE SUN GLOW (Ch02 & Ch03 Atacama/Scanner - opacity 0.45, intense terracotta/mustard)
  // 0.50 - 0.75: RECEDES / COOLS AT THE TURN (opacity 0.05, dark abyss)
  // 0.75 - 1.00: Neutral golden dawn at CTA (opacity 0.35, warm mustard)

  let opacity = 0.15;
  let size = 60;
  let color = '228, 177, 42'; // Mustard default

  if (progress < 0.2) {
    opacity = 0.15 + progress * 0.5;
    size = 60 + progress * 80;
  } else if (progress >= 0.2 && progress < 0.55) {
    // High Risk Altitude (Atacama & Live AI Inspection)
    const factor = (progress - 0.2) / 0.35;
    opacity = 0.25 + factor * 0.25;
    size = 100 + factor * 70;
    color = '201, 106, 53'; // Terracotta heat
  } else if (progress >= 0.55 && progress < 0.75) {
    // Tension released at THE TURN (Recedes into dark abyss)
    const factor = (progress - 0.55) / 0.2;
    opacity = Math.max(0.04, 0.5 - factor * 0.46);
    size = 170 - factor * 100;
    color = '255, 255, 255';
  } else {
    // Danger Resolved at CTA
    const factor = (progress - 0.75) / 0.25;
    opacity = 0.05 + factor * 0.35;
    size = 70 + factor * 60;
    color = '228, 177, 42';
  }

  return (
    <div
      className="sun-glow-background"
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${size}vw`,
        height: `${size}vw`,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${color}, ${opacity}) 0%, rgba(10, 13, 16, 0) 70%)`,
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        mixBlendMode: 'screen',
      }}
    />
  );
}
