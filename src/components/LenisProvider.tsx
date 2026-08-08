'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMissionStore } from '@/store/useMissionStore';

gsap.registerPlugin(ScrollTrigger);

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollVelocity = useMissionStore((s) => s.setScrollVelocity);
  const tickTimer = useMissionStore((s) => s.tickTimer);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();
      setScrollVelocity(Math.abs(e.velocity || 0));
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Mission timer increment interval
    const timerInterval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => {
      lenis.destroy();
      clearInterval(timerInterval);
    };
  }, [setScrollVelocity, tickTimer]);

  return <>{children}</>;
}
