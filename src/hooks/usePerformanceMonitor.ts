import { useEffect, useState, useRef } from 'react';
import { profiler } from '../utils/performanceProfiler';

export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(0);
  const [triangles, setTriangles] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const measurePerformance = () => {
      const now = performance.now();
      frameCount.current++;

      if (now - lastTime.current >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
        frameCount.current = 0;
        lastTime.current = now;
      }

      requestAnimationFrame(measurePerformance);
    };

    measurePerformance();
  }, []);

  const logPerformance = () => {
    console.log(`FPS: ${fps}, Draw Calls: ${drawCalls}, Triangles: ${triangles}`);
    profiler.logToConsole();
  };

  return {
    fps,
    drawCalls,
    triangles,
    setDrawCalls,
    setTriangles,
    logPerformance
  };
}
