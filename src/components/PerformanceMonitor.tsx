"use client";
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export function PerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime.current >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / (currentTime - lastTime.current)));
      frameCount.current = 0;
      lastTime.current = currentTime;

      // Check memory usage if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryUsage(Math.round(memory.usedJSHeapSize / 1024 / 1024));
      }
    }
  });

  return null;
}

export function PerformanceDisplay() {
  const [fps, setFps] = useState(60);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime.current;
      
      if (deltaTime >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / deltaTime));
        frameCount.current = 0;
        lastTime.current = currentTime;

        if ('memory' in performance) {
          const memory = (performance as any).memory;
          setMemoryUsage(Math.round(memory.usedJSHeapSize / 1024 / 1024));
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Update frame count on each render
  useEffect(() => {
    frameCount.current++;
  });

  return (
    <div className="absolute top-4 left-4 text-white/60 text-xs font-mono space-y-1">
      <div className={fps < 30 ? 'text-red-400' : fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
        FPS: {fps}
      </div>
      {memoryUsage > 0 && (
        <div className={memoryUsage > 300 ? 'text-red-400' : memoryUsage > 200 ? 'text-yellow-400' : 'text-green-400'}>
          Memory: {memoryUsage}MB
        </div>
      )}
    </div>
  );
}
