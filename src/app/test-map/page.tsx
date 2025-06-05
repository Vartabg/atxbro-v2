'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DeckGlMapWithNoSSR = dynamic(() => import('../../components/vetnav/DeckGlMap'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: '#f0f0f0'
    }}>
      <p>Loading 3D Map...</p>
    </div>
  )
});

export default function TestMapPage() {
  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#2563eb',
          margin: 0,
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          VetNav 3D State Map - Deck.gl
        </h1>
      </div>
      
      <Suspense fallback={
        <div style={{
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: '#f0f0f0'
        }}>
          <p>Preparing Map...</p>
        </div>
      }>
        <DeckGlMapWithNoSSR />
      </Suspense>
    </div>
  );
}
