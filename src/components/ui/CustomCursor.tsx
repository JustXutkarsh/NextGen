'use client';

import React, { useEffect, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const cursorMode = useMissionStore((s) => s.cursorMode);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  const isCustomMode = cursorMode !== 'DEFAULT';

  return (
    <>
      <div
        className="cursor-ring"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isCustomMode ? '48px' : '24px',
          height: isCustomMode ? '48px' : '24px',
          borderColor: isCustomMode ? 'var(--mustard)' : 'var(--cream)',
        }}
      />
      <div
        className="cursor-dot"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
      {isCustomMode && (
        <div
          className="cursor-label"
          style={{
            position: 'fixed',
            left: `${pos.x + 28}px`,
            top: `${pos.y - 12}px`,
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.45rem',
            color: 'var(--mustard)',
            background: 'var(--dark-panel)',
            border: '1px solid var(--mustard)',
            padding: '2px 6px',
            pointerEvents: 'none',
            zIndex: 9999,
            letterSpacing: '0.1em',
            boxShadow: '0 0 10px rgba(0,0,0,0.8)',
          }}
        >
          {cursorMode}
        </div>
      )}
    </>
  );
}
