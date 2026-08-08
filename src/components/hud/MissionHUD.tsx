'use client';

import React, { useEffect, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function MissionHUD() {
  const { currentScene, progress, status, battery, altitude, speed, missionTime } = useMissionStore();

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  const getStatusClass = () => {
    if (status === 'ALERT') return 'alert';
    if (status === 'IN FLIGHT') return 'flight';
    return '';
  };

  return (
    <header className="mission-hud">
      <div className="hud-left">
        <div className="hud-logo">FLYTBASE // NESTGEN '26</div>
        <div className="hud-status">
          <div className={`hud-status-dot ${getStatusClass()}`} />
          <span className="hud-status-text">{status}</span>
        </div>
      </div>

      <div className="hud-center">
        <div className="hud-progress-track">
          <div
            className="hud-progress-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <span className="hud-progress-label">
          PHASE {currentScene.toString().padStart(2, '0')}/12
        </span>
      </div>

      <div className="hud-right">
        <div className="hud-metric">
          <span className="hud-metric-label">BATTERY</span>
          <span className="hud-metric-value">{battery}%</span>
        </div>
        <div className="hud-metric">
          <span className="hud-metric-label">ALTITUDE</span>
          <span className="hud-metric-value">{altitude}m</span>
        </div>
        <div className="hud-metric">
          <span className="hud-metric-label">SPEED</span>
          <span className="hud-metric-value">{speed}km/h</span>
        </div>
        <div className="hud-timer">{formatTime(missionTime)}</div>
      </div>
    </header>
  );
}
