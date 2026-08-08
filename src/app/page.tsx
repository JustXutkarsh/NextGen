'use client';

import React from 'react';
import LenisProvider from '@/components/LenisProvider';
import NoiseOverlay from '@/components/ui/NoiseOverlay';
import ClassifiedHUD from '@/components/ui/ClassifiedHUD';
import CustomCursor from '@/components/ui/CustomCursor';
import CinematicFiveChapters from '@/components/documentary/CinematicFiveChapters';

export default function Home() {
  return (
    <LenisProvider>
      <NoiseOverlay />
      <ClassifiedHUD />
      <CustomCursor />
      <main className="c5-container">
        <CinematicFiveChapters />
      </main>
    </LenisProvider>
  );
}
