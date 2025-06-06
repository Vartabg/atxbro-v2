"use client";

import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Sphere } from '@react-three/drei';
import { ShieldCheck, BarChart3, PawPrint, TrendingUp } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  position: [number, number, number];
  color: string;
  icon: React.ComponentType;
  description: string;
}

function AnimatedServiceSphere({ service, isActive, onClick }: { 
  service: Service; 
  isActive: boolean; 
  onClick: (id: string) => void;
}) {
  const meshRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group position={service.position} onClick={() => onClick(service.id)}>
      <Sphere ref={meshRef} args={[isActive ? 1.2 : 1, 32, 32]}>
        <meshStandardMaterial 
          color={service.color}
          emissive={isActive ? service.color : '#000000'}
          emissiveIntensity={isActive ? 0.4 : 0.1}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      
      {isActive && (
        <Sphere args={[1.4, 32, 32]}>
          <meshBasicMaterial 
            color={service.color}
            transparent
            opacity={0.2}
            wireframe
          />
        </Sphere>
      )}
    </group>
  );
}

export default function Landing3D() {
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const services: Service[] = [
    { 
      id: 'vetnav', 
      title: 'VetNav', 
      subtitle: 'Benefits Navigator', 
      position: [-4, 2, 0], 
      color: '#2563eb', 
      icon: ShieldCheck, 
      description: 'Navigate veteran benefits effectively.' 
    },
    { 
      id: 'tariff-explorer', 
      title: 'Tariff Explorer', 
      subtitle: 'Trade Insights', 
      position: [4, 2, 0], 
      color: '#10b981', 
      icon: BarChart3, 
      description: 'Explore and understand trade tariffs.' 
    },
    { 
      id: 'pet-radar', 
      title: 'Pet Radar', 
      subtitle: 'Lost & Found Pets', 
      position: [-3, -2, 0], 
      color: '#8b5cf6', 
      icon: PawPrint, 
      description: 'Help find lost pets in your area.' 
    },
    { 
      id: 'jets-home', 
      title: 'Jets Home', 
      subtitle: 'Sports Analytics', 
      position: [3, -2, 0], 
      color: '#dc2626', 
      icon: TrendingUp, 
      description: 'Advanced sports statistics and analytics.' 
    },
  ];

  const handleServiceClick = (id: string) => {
    setActiveServiceId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="relative w-full bg-black">
      <div className="w-full h-80 sm:h-96 md:h-screen">
        <Canvas
          camera={{ position: [0, 0, 12], fov: 50 }}
          className="w-full h-full"
        >
          <Suspense fallback={
            <Html center>
              <div className="text-white text-lg animate-pulse">
                Loading cosmic experience...
              </div>
            </Html>
          }>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.6} color="#4a90e2" />
            <pointLight position={[10, -10, 10]} intensity={0.4} color="#8b5cf6" />
            
            <Stars 
              radius={100} 
              depth={50} 
              count={5000} 
              factor={4} 
              saturation={0} 
              fade 
              speed={1}
            />
            
            {services.map(service => (
              <AnimatedServiceSphere 
                key={service.id} 
                service={service}
                isActive={service.id === activeServiceId}
                onClick={handleServiceClick} 
              />
            ))}
            
            <OrbitControls 
              enableZoom={true} 
              enablePan={true} 
              minDistance={8} 
              maxDistance={20}
              enableDamping={true}
              dampingFactor={0.05}
              autoRotate={!activeServiceId}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
            What's good, bro
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4 drop-shadow-lg">
            Explore interactive cosmic spheres • Click to discover applications
          </p>
          <div className="text-sm text-white/60">
            🌟 Interactive 3D Navigation • 🖱️ Drag to explore
          </div>
        </div>
      </div>

      {/* Service Info Panel */}
      {activeServiceId && (
        <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md text-white p-6 rounded-xl max-w-sm border border-white/30 shadow-2xl animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-4 h-4 rounded-full animate-pulse"
              style={{ backgroundColor: services.find(s => s.id === activeServiceId)?.color }}
            />
            <h3 className="text-xl font-bold text-blue-400">
              {services.find(s => s.id === activeServiceId)?.title}
            </h3>
          </div>
          <p className="text-sm text-white/80 mb-4 leading-relaxed">
            {services.find(s => s.id === activeServiceId)?.description}
          </p>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>🌟 Click sphere to explore</span>
            <span>ESC to deselect</span>
          </div>
        </div>
      )}

      {/* Performance indicator */}
      <div className="absolute top-4 right-4 text-white/50 text-xs font-mono">
        3D Navigation • WebGL • 60fps
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-4 right-4 text-white/50 text-xs">
        Mouse: Orbit • Scroll: Zoom • Click: Select
      </div>
    </div>
  );
}
