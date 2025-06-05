"use client";

import React, { useState, useRef, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { ShieldCheck, BarChart3, PawPrint, TrendingUp, LucideProps } from 'lucide-react';
import { MobileOptimizer } from './optimizations/MobileOptimizer';
import { OptimizedServiceObject } from './optimizations/OptimizedServiceObject';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { profiler } from '../utils/performanceProfiler';
import * as THREE from 'three';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  position3D: [number, number, number];
  color: string;
  icon: React.ComponentType<LucideProps>;
  description: string;
}

interface Landing3DMobileProps {
  services: Service[];
  setCurrentView: (view: string) => void;
}

function PerformanceStats() {
  const { fps, logPerformance } = usePerformanceMonitor();
  const { gl } = useThree();
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`FPS: ${fps}, Triangles: ${gl.info.render.triangles}, Calls: ${gl.info.render.calls}`);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [fps, gl]);

  return null;
}

function OptimizedScene({ services, onServiceClick, activeServiceId }: {
  services: Service[];
  onServiceClick: (id: string) => void;
  activeServiceId: string | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const mobileSettings = useMemo(() => MobileOptimizer.getOptimalSettings(), []);

  useFrame((state, delta) => {
    profiler.startMeasure('scene-update');
    
    if (groupRef.current && mobileSettings.effectsQuality === 'high') {
      groupRef.current.rotation.y += delta * 0.01;
    }
    
    profiler.endMeasure('scene-update');
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow={mobileSettings.shadowsEnabled}
      />
      
      {services.map((service) => (
        <OptimizedServiceObject
          key={service.id}
          service={service}
          isActive={service.id === activeServiceId}
          onClick={() => onServiceClick(service.id)}
          isTransitioning={false}
        />
      ))}
      
      {mobileSettings.effectsQuality === 'high' && (
        <gridHelper args={[20, 20]} />
      )}
    </group>
  );
}

export default function Landing3DMobile({ services, setCurrentView }: Landing3DMobileProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 10]);
  
  const mobileSettings = useMemo(() => MobileOptimizer.getOptimalSettings(), []);

  useEffect(() => {
    setIsMounted(true);
    
    // Adjust camera based on screen size
    const updateCamera = () => {
      const aspect = window.innerWidth / window.innerHeight;
      if (aspect < 1) {
        setCameraPosition([0, 0, 14]);
      } else {
        setCameraPosition([0, 0, 10]);
      }
    };
    
    updateCamera();
    window.addEventListener('resize', updateCamera);
    return () => window.removeEventListener('resize', updateCamera);
  }, []);

  const handleServiceClick = (id: string) => {
    profiler.startMeasure('service-click');
    
    if (activeServiceId === id) {
      // Navigate to service
      setTimeout(() => {
        setCurrentView(id);
      }, 500);
    } else {
      setActiveServiceId(id);
    }
    
    profiler.endMeasure('service-click');
  };

  const canvasProps = {
    camera: {
      position: cameraPosition,
      fov: window.innerWidth < 768 ? 65 : 50
    },
    dpr: mobileSettings.pixelRatio,
    antialias: mobileSettings.antialiasing,
    alpha: false,
    powerPreference: "high-performance" as const,
    stencil: false,
    depth: true
  };

  if (!isMounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p>Loading 3D Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="w-full h-full">
        <Canvas {...canvasProps}>
          <Suspense fallback={
            <Html center>
              <span style={{color: 'white'}}>Loading...</span>
            </Html>
          }>
            <PerformanceStats />
            <OptimizedScene 
              services={services}
              onServiceClick={handleServiceClick}
              activeServiceId={activeServiceId}
            />
            <OrbitControls
              enableZoom={!MobileOptimizer.isMobile()}
              enablePan={!MobileOptimizer.isMobile()}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
              enableDamping={true}
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Mobile UI overlay */}
      {MobileOptimizer.isMobile() && activeServiceId && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white">
          <h3 className="text-lg font-bold">
            {services.find(s => s.id === activeServiceId)?.title}
          </h3>
          <p className="text-sm opacity-75">
            {services.find(s => s.id === activeServiceId)?.description}
          </p>
          <button 
            onClick={() => handleServiceClick(activeServiceId)}
            className="mt-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
          >
            Enter
          </button>
        </div>
      )}
    </div>
  );
}
