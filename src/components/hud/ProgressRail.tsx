'use client';

import React from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function ProgressRail() {
  const { currentScene } = useMissionStore();

  const handleDotClick = (sceneIndex: number) => {
    const el = document.getElementById(`scene-${sceneIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="progress-rail">
      {Array.from({ length: 12 }).map((_, i) => {
        const sceneNum = i + 1;
        return (
          <div
            key={sceneNum}
            className={`rail-dot ${currentScene === sceneNum ? 'active' : ''}`}
            onClick={() => handleDotClick(sceneNum)}
            title={`Scene ${sceneNum}`}
          />
        );
      })}
    </div>
  );
}
