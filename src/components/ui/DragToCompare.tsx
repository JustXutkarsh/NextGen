'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export default function DragToCompare() {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);

  const [clipWidthPct, setClipWidthPct] = useState(50);

  useEffect(() => {
    const handle = handleRef.current;
    const container = containerRef.current;
    if (!handle || !container) return;

    const draggable = Draggable.create(handle, {
      type: 'x',
      bounds: container,
      onDrag: function () {
        const rect = container.getBoundingClientRect();
        const relativeX = this.x - rect.left;
        const pct = Math.max(5, Math.min(95, (relativeX / rect.width) * 100));
        setClipWidthPct(pct);
      },
    });

    return () => {
      if (draggable[0]) draggable[0].kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="compare-wrap">
      {/* BASE IMAGE: AUTONOMOUS — NOW */}
      <img
        src="/photos/02_drone_software_console.png"
        alt="Autonomous Inspection Now"
        className="compare-base"
      />
      <div className="compare-label right">AUTONOMOUS — NOW</div>

      {/* CLIPPED OVERLAY IMAGE: MANUAL — 2019 */}
      <div
        ref={clipRef}
        className="compare-clip"
        style={{ width: `${clipWidthPct}%` }}
      >
        <img
          src="/photos/site_gallery_05.png"
          alt="Manual Inspection 2019"
          className="compare-top"
        />
        <div className="compare-label left">MANUAL — 2019</div>
      </div>

      {/* DRAGGABLE VERTICAL HANDLE */}
      <div
        ref={handleRef}
        className="compare-handle"
        style={{ left: `${clipWidthPct}%` }}
      >
        <div className="handle-line" />
        <div className="handle-button">
          <span>◄</span>
          <span>►</span>
        </div>
      </div>
    </div>
  );
}
