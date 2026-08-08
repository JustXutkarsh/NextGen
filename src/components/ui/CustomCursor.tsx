'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('interactive'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Central Crosshair Dot */}
      <div
        className="target-reticle-dot"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isClicking ? 0.7 : 1})`,
        }}
      />

      {/* Surveillance Bracket Reticle */}
      <div
        className={`target-reticle-brackets ${isHovered ? 'hovered' : ''}`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${
            isClicking ? 0.8 : isHovered ? 1.4 : 1
          })`,
        }}
      >
        <span className="b-tl" />
        <span className="b-tr" />
        <span className="b-bl" />
        <span className="b-br" />
      </div>
    </>
  );
}
