'use client';

import React, { useEffect, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function ClassifiedHUD() {
  const { progress, activeStatus } = useMissionStore();
  const [timestamp, setTimestamp] = useState('');
  const [coords, setCoords] = useState('LAT: -23.8647° | LONG: -69.1328°');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toISOString().substring(11, 19) + 'Z');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update coords slightly based on scroll progress for operational flavor
  useEffect(() => {
    const lat = (-23.8647 + progress * 0.05).toFixed(4);
    const long = (-69.1328 - progress * 0.08).toFixed(4);
    setCoords(`LAT: ${lat}° | LONG: ${long}°`);
  }, [progress]);

  const percent = Math.round(progress * 100);

  return (
    <div className="classified-hud-container">
      {/* TOP-LEFT CORNER */}
      <div className="hud-corner top-left">
        <span className="hud-badge-tag">CLASSIFIED BRIEFING</span>
        <span className="hud-title-line">FLYTBASE // {activeStatus || 'MISSION ACTIVE'}</span>
      </div>

      {/* TOP-RIGHT CORNER */}
      <div className="hud-corner top-right">
        <span className="hud-mono-val">{timestamp || '15:49:37Z'}</span>
        <span className="hud-mono-sub">{coords}</span>
      </div>

      {/* BOTTOM-LEFT CORNER */}
      <div className="hud-corner bottom-left">
        <div className="hud-progress-wrapper">
          <span className="hud-progress-label">DOSSIER READOUT: {percent}%</span>
          <div className="hud-progress-gauge">
            <div className="hud-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
