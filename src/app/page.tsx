'use client';

import React from 'react';
import LenisProvider from '@/components/LenisProvider';
import CinematicFiveChapters from '@/components/documentary/CinematicFiveChapters';

export default function Home() {
  return (
    <LenisProvider>
      <main className="c5-container">
        <CinematicFiveChapters />
      </main>
    </LenisProvider>
  );
}
