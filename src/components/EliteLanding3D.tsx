"use client";
import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ProceduralNebula } from './cosmic/ProceduralNebula';
import { AdvancedStarfield } from './cosmic/AdvancedStarfield';
import { RealisticPlanet } from './cosmic/RealisticPlanet';
import { ShootingStars } from './cosmic/ShootingStars';
import { WarpTransition } from './cosmic/WarpTransition';
import VetNav from './VetNav';
import TariffExplorer from './TariffExplorer';
import PetRadar from './PetRadar';
import JetsStats from './JetsStats';

export default function EliteLanding3D() {
  const [activeApp, setActiveApp] = useState(null);
  const [isWarping, setIsWarping] = useState(false);
  const [pendingApp, setPendingApp] = useState(null);
  
  const cameraRef = useRef();

  const closeApp = () => {
    setIsWarping(true);
    setPendingApp(null);
    setTimeout(() => {
      setActiveApp(null);
      setIsWarping(false);
    }, 1000);
  };

  const handlePlanetClick = (appName) => {
    if (activeApp) return;
    
    setIsWarping(true);
    setPendingApp(appName);
    
    setTimeout(() => {
      setActiveApp(appName);
      setIsWarping(false);
    }, 1500);
  };

  const planets = [
    {
      name: 'VetNav',
      position: [-8, 2, -2],
      size: 1.2,
      color: '#2563eb',
      app: 'vetnav',
      hasAtmosphere: true,
      atmosphereColor: '#4a90e2',
      rotationSpeed: 0.005
    },
    {
      name: 'Tariff Explorer',
      position: [8, -1, 1],
      size: 1.0,
      color: '#059669',
      app: 'tariff',
      hasAtmosphere: true,
      atmosphereColor: '#10b981',
      rotationSpeed: 0.008
    },
    {
      name: 'Pet Radar',
      position: [-6, -4, 3],
      size: 0.9,
      color: '#7c3aed',
      app: 'pet',
      hasAtmosphere: true,
      atmosphereColor: '#a855f7',
      rotationSpeed: 0.012
    },
    {
      name: 'Jets Home',
      position: [5, 4, -1],
      size: 0.8,
      color: '#dc2626',
      app: 'jets',
      hasAtmosphere: false,
      atmosphereColor: '#ef4444',
      rotationSpeed: 0.015
    }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Canvas
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 0, 20]}
          fov={60}
          near={0.1}
          far={1000}
        />
        
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.15} color="#4a5568" />
          <pointLight 
            position={[0, 0, 0]} 
            intensity={2} 
            color="#ffd700"
            distance={50}
            decay={2}
          />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.3} 
            color="#ffffff"
          />
          
          {/* Cosmic Background */}
          <ProceduralNebula />
          <AdvancedStarfield />
          <ShootingStars />
          
          {/* Central Sun */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#ffaa00"
              emissiveIntensity={0.6}
            />
          </mesh>
          
          {/* Planets */}
          {planets.map((planet) => (
            <RealisticPlanet
              key={planet.name}
              position={planet.position}
              size={planet.size}
              color={planet.color}
              name={planet.name}
              hasAtmosphere={planet.hasAtmosphere}
              atmosphereColor={planet.atmosphereColor}
              rotationSpeed={planet.rotationSpeed}
              onClick={() => handlePlanetClick(planet.app)}
            />
          ))}
          
          {/* Orbital Rings */}
          {planets.map((planet, index) => {
            const radius = Math.sqrt(
              planet.position[0] ** 2 + 
              planet.position[1] ** 2 + 
              planet.position[2] ** 2
            );
            return (
              <mesh key={`ring-${index}`} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.1, radius + 0.1, 128]} />
                <meshBasicMaterial 
                  color="#ffffff" 
                  opacity={0.05} 
                  transparent 
                  side={2}
                />
              </mesh>
            );
          })}
          
          {/* Warp Effect */}
          <WarpTransition 
            isActive={isWarping}
            onComplete={() => {}}
          />
          
          {/* Enhanced Controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={40}
            autoRotate={!activeApp}
            autoRotateSpeed={0.2}
            dampingFactor={0.05}
            enableDamping={true}
            panSpeed={0.5}
            rotateSpeed={0.3}
            zoomSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Title */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <h1 className="text-5xl md:text-7xl font-bold text-center">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              What's good, bro
            </span>
          </h1>
          <p className="text-white/80 text-center mt-4 text-lg backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full">
            Navigate the cosmic interface • Click planets to explore
          </p>
        </div>

        {/* App Buttons - Floating */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
            {planets.map((planet) => (
              <button
                key={planet.app}
                onClick={() => handlePlanetClick(planet.app)}
                disabled={isWarping}
                className={`
                  relative overflow-hidden group
                  bg-gradient-to-br from-black/60 via-black/40 to-transparent
                  backdrop-blur-xl border border-white/20
                  hover:border-white/40 hover:bg-black/50
                  text-white py-4 px-8 rounded-2xl
                  transition-all duration-500 ease-out
                  transform hover:scale-105 hover:rotate-1
                  shadow-2xl hover:shadow-3xl
                  ${isWarping ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                style={{
                  boxShadow: `0 0 30px ${planet.color}40, inset 0 1px 0 rgba(255,255,255,0.1)`
                }}
              >
                <div className="relative z-10">
                  <div className="text-lg font-bold mb-1">{planet.name}</div>
                  <div className="text-xs text-white/70 capitalize">
                    {planet.app.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
                
                {/* Animated border */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(45deg, ${planet.color}20, transparent, ${planet.color}20)`,
                    animation: 'borderGlow 3s ease-in-out infinite alternate'
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isWarping && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-4">
                Initiating Warp Drive...
              </div>
              <div className="w-32 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-1500"
                  style={{ width: isWarping ? '100%' : '0%' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* App Modals */}
      {activeApp === 'vetnav' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
          <VetNav />
          <button 
            onClick={closeApp} 
            className="fixed top-6 right-6 text-white hover:text-red-400 text-3xl z-60 transition-colors bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border border-white/20"
          >
            ×
          </button>
        </div>
      )}

      {activeApp === 'tariff' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
          <TariffExplorer />
          <button 
            onClick={closeApp} 
            className="fixed top-6 right-6 text-white hover:text-red-400 text-3xl z-60 transition-colors bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border border-white/20"
          >
            ×
          </button>
        </div>
      )}

      {activeApp === 'pet' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
          <PetRadar />
          <button 
            onClick={closeApp} 
            className="fixed top-6 right-6 text-white hover:text-red-400 text-3xl z-60 transition-colors bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border border-white/20"
          >
            ×
          </button>
        </div>
      )}

      {activeApp === 'jets' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50">
          <JetsStats />
          <button 
            onClick={closeApp} 
            className="fixed top-6 right-6 text-white hover:text-red-400 text-3xl z-60 transition-colors bg-black/50 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border border-white/20"
          >
            ×
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes borderGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
