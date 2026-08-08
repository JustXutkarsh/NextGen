'use client';

import React from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function AudioToggle() {
  const { isAudioMuted, toggleAudio } = useMissionStore();

  return (
    <button
      className={`audio-toggle ${!isAudioMuted ? 'active' : ''}`}
      onClick={toggleAudio}
      aria-label="Toggle ambient audio"
    >
      <span>SOUND:</span>
      <span>{isAudioMuted ? 'OFF [MUTED]' : 'ON [LIVE]'}</span>
    </button>
  );
}
