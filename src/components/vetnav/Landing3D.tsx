'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdvancedPlanetarySystemWithMoons } from './AdvancedPlanetarySystemWithMoons';
import DeckGlMap from './DeckGlMap';
import { CameraController } from './CameraController';

// Device orientation for parallax
function useDeviceTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e) => {
      // Normalize gamma/beta for slight parallax only
      const x = ((e.beta ?? 0) - 90) * 0.0075;
      const y = (e.gamma ?? 0) * 0.0075;
      setTilt({ x, y });
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, []);
  return tilt;
}

export default function Landing3D() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [showVetNavInfo, setShowVetNavInfo] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [underConstruction, setUnderConstruction] = useState(false);
  const [planetFocus, setPlanetFocus] = useState(null);
  const tilt = useDeviceTilt();

  // Focus and zoom camera on planet selection
  const handlePlanetClick = (planet) => {
    setSelectedPlanet(planet);
    setPlanetFocus(planet.id);
    if (planet.id === 'vetnav') {
      setTimeout(() => setShowVetNavInfo(true), 600); // Delay for smooth camera
    } else {
      setTimeout(() => setUnderConstruction(true), 600);
    }
  };

  const handleCloseInfo = () => {
    setShowVetNavInfo(false);
    setPlanetFocus(null);
    setSelectedPlanet(null);
  };

  const handleOpenMap = () => {
    setShowMapModal(true);
  };

  const handleCloseMap = () => {
    setShowMapModal(false);
  };

  const handleCloseUnderConstruction = () => {
    setUnderConstruction(false);
    setPlanetFocus(null);
    setSelectedPlanet(null);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Parallax cosmic background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-200"
        style={{
          background: 'radial-gradient(ellipse at center, #0a174e 0%, #121212 100%)',
          transform: `translate(${tilt.y * 30}px, ${tilt.x * 30}px) scale(1.03)`,
          transition: 'transform 0.3s',
        }}
      />

      {/* 3D Canvas with focus controller */}
      <div className="relative w-full h-full z-10">
        <Canvas
          camera={{
            position:
              planetFocus === 'vetnav'
                ? [ -2.5, 1.2, 12 ] // Closer zoom for VetNav
                : [ 0, 0, 50 ], // Default overview
            fov: planetFocus === 'vetnav' ? 32 : 60,
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            {/* Camera Tracking System */}
            <CameraController
              targetPlanet={selectedPlanet}
              isTracking={!!planetFocus}
              focusOverride={
                planetFocus === 'vetnav'
                  ? { position: [ -2.5, 1.2, 8 ], fov: 32 }
                  : null
              }
            />
            {/* Planet System */}
            <AdvancedPlanetarySystemWithMoons
              onPlanetClick={handlePlanetClick}
              selectedPlanet={selectedPlanet}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay: VetNav Info Card */}
      {showVetNavInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-30">
          {/* Slight portal animation */}
          <div className="absolute inset-0 flex items-center justify-center animate-pulse z-20 pointer-events-none">
            <div className="rounded-full bg-blue-400/30 blur-3xl w-72 h-72 shadow-2xl" />
          </div>
          <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-[92vw] max-w-md flex flex-col items-center">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 via-blue-300 to-green-400 shadow-lg border-4 border-white flex items-center justify-center">
                <span className="text-3xl font-bold text-white drop-shadow">🪐</span>
              </div>
            </div>
            <h2 className="mt-8 mb-1 text-2xl font-bold text-blue-900 text-center">VetNav</h2>
            <p className="mb-6 text-base text-blue-800/80 text-center">Navigate veteran benefits by state, bust myths, and access key resources for veterans.</p>
            <div className="flex flex-col gap-3 w-full">
              <button
                className="bg-gradient-to-r from-blue-700 via-blue-500 to-green-400 text-white font-semibold py-3 rounded-lg shadow-md hover:scale-105 transition-all"
                onClick={() => { setShowMapModal(true); }}
              >
                Search Interactive Map
              </button>
              <button
                className="bg-gradient-to-r from-slate-600 via-blue-400 to-blue-200 text-blue-900 font-semibold py-3 rounded-lg shadow-md hover:scale-105 transition-all"
                onClick={() => alert('Coming soon: Mythbusters')}
              >
                Mythbusters
              </button>
              <button
                className="bg-gradient-to-r from-green-700 via-green-400 to-blue-200 text-blue-900 font-semibold py-3 rounded-lg shadow-md hover:scale-105 transition-all"
                onClick={() => alert('Coming soon: Education Barriers')}
              >
                Education Barriers
              </button>
              <button
                className="bg-gradient-to-r from-blue-700 via-slate-400 to-gray-200 text-blue-900 font-semibold py-3 rounded-lg shadow-md hover:scale-105 transition-all"
                onClick={() => alert('Coming soon: PDF Export')}
              >
                PDF Export
              </button>
            </div>
            <button
              className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
              onClick={handleCloseInfo}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Overlay: DeckGlMap Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/90">
          <div className="absolute top-2 right-4 z-50">
            <button
              className="bg-white/80 backdrop-blur-lg rounded-full px-3 py-2 shadow-xl text-blue-800 hover:bg-blue-200 hover:scale-110 transition"
              onClick={handleCloseMap}
            >
              Close Map
            </button>
          </div>
          <div className="w-full h-full">
            <DeckGlMap />
          </div>
        </div>
      )}

      {/* Overlay: Under Construction Modal */}
      {underConstruction && (
        <div className="fixed inset-0 flex items-center justify-center z-30 bg-black/70">
          <div className="flex flex-col items-center bg-white/90 rounded-xl p-8 shadow-2xl animate-fade-in">
            <div className="text-yellow-500 mb-4 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m-6 4h.01M12 18a6 6 0 100-12 6 6 0 000 12z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Under Construction</h3>
            <p className="mb-4 text-gray-600 text-center">This planet's services are coming soon. Stay tuned!</p>
            <button
              className="mt-2 px-6 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 shadow transition"
              onClick={handleCloseUnderConstruction}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Instruction overlay */}
      {!selectedPlanet && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="text-center text-white">
            <p className="text-xl md:text-2xl text-blue-200 opacity-80 drop-shadow">Select a planet to begin your journey</p>
          </div>
        </div>
      )}
    </div>
  );
}
