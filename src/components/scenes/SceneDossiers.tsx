'use client';

import React, { useEffect, useState } from 'react';
import { useMissionStore } from '@/store/useMissionStore';

export default function SceneDossiers() {
  const setStatus = useMissionStore((s) => s.setStatus);
  const setCursorMode = useMissionStore((s) => s.setCursorMode);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setStatus('REVIEWING');
  }, [setStatus]);

  const dossiers = [
    {
      title: 'SHELL PETROLEUM',
      code: 'CASE #9021-OIL',
      img: '/photos/oilgas_dashboard.png',
      metric: '100X FLIGHT FREQUENCY',
      story: 'World’s first fully autonomous drone operation on a floating offshore oil platform in the North Sea.',
    },
    {
      title: 'SQM CHILE LITHIUM',
      code: 'CASE #4412-MINE',
      img: '/photos/dock_mountain_terrain.png',
      metric: '90 MIN LEAK DETECTION',
      story: 'Cut leak detection time from days down to under 90 minutes. 4x iodine yield increase.',
    },
    {
      title: 'CSX TRANSPORTATION',
      code: 'CASE #7710-RAIL',
      img: '/photos/railyard_corrosion_dashboard.png',
      metric: 'CREDIT-CARD RAIL DEFECTS',
      story: 'Spotting rail anomalies at 100ft altitude without shutting down live train tracks.',
    },
  ];

  return (
    <section
      id="scene-8"
      className="scene-section"
      onMouseEnter={() => setCursorMode('OPEN DOSSIER')}
      onMouseLeave={() => setCursorMode('DEFAULT')}
    >
      <div className="dossiers-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className="pixel" style={{ fontSize: '0.55rem', color: 'var(--mustard)' }}>
            SCENE 08 // CLASSIFIED MISSION DOSSIERS
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {dossiers.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="pixel"
                style={{
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.5rem',
                  background: activeTab === i ? 'var(--mustard)' : 'var(--dark-panel)',
                  color: activeTab === i ? 'var(--ink)' : 'var(--cream)',
                  border: '1px solid var(--dark-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                📁 {d.title}
              </button>
            ))}
          </div>

          {/* Active Dossier Card */}
          <div className="dossier-card">
            <div className="dossier-banner">
              <span className="pixel" style={{ fontSize: '0.45rem', color: 'var(--alert-red)' }}>
                CONFIDENTIAL // RESTRICTED BOARDROOM ACCESS
              </span>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
                {dossiers[activeTab].code}
              </span>
            </div>

            <div style={{ height: '240px', overflow: 'hidden' }}>
              <img
                src={dossiers[activeTab].img}
                alt={dossiers[activeTab].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ padding: '1.8rem' }}>
              <div className="pixel" style={{ fontSize: '0.75rem', color: 'var(--cream)', marginBottom: '0.5rem' }}>
                {dossiers[activeTab].title}
              </div>
              <div className="mono" style={{ fontSize: '1.6rem', color: 'var(--mustard)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {dossiers[activeTab].metric}
              </div>
              <p className="mono" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                {dossiers[activeTab].story}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
