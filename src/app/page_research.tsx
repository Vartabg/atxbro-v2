"use client";
import VetNav from '../components/VetNav';
import JetsStats from '../components/JetsStats';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGestureProfiler } from '../hooks/useGestureProfiler';

export default function Home() {
  const [currentView, setCurrentView] = useState('entry');
  const [gestureStage, setGestureStage] = useState(0);
  const [discoveredGestures, setDiscoveredGestures] = useState([]);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [ripples, setRipples] = useState([]);
  const [particles, setParticles] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState(['Home']);
  
  const containerRef = useRef(null);
  const panStartRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0, time: 0 });
  
  const { profile, analyzeGesture, metrics } = useGestureProfiler();

  // Infinite canvas layout (inspired by Miro/Figma)
  const appNodes = [
    { 
      id: 'vetnav', 
      title: 'VetNav', 
      x: -400, 
      y: -300,
      color: 'from-blue-600 to-blue-800',
      icon: '🎖️',
      category: 'Government Services'
    },
    { 
      id: 'jets-stats', 
      title: 'Jets Analytics', 
      x: 400, 
      y: -300,
      color: 'from-green-600 to-green-800',
      icon: '🏈',
      category: 'Sports Data'
    },
    { 
      id: 'pet-radar', 
      title: 'Pet Radar', 
      x: -400, 
      y: 300,
      color: 'from-yellow-600 to-yellow-800',
      icon: '🐕',
      category: 'Social Impact'
    },
    { 
      id: 'tariff-explorer', 
      title: 'Trade Explorer', 
      x: 400, 
      y: 300,
      color: 'from-purple-600 to-purple-800',
      icon: '📊',
      category: 'Economic Analysis'
    }
  ];

  // Progressive gesture onboarding stages (inspired by Clear app)
  const gestureStages = [
    { 
      hint: "Touch anywhere to begin", 
      gesture: "tap",
      description: "Discover through touch"
    },
    { 
      hint: "Drag to explore the canvas", 
      gesture: "pan",
      description: "Navigate your workspace"
    },
    { 
      hint: "Pinch to zoom between overview and detail", 
      gesture: "pinch",
      description: "Scale your perspective"
    },
    { 
      hint: "Long press for contextual actions", 
      gesture: "hold",
      description: "Access deeper functionality"
    }
  ];

  // Sophisticated micro-interactions (Slack/Linear inspired)
  const createSubtleRipple = useCallback((x, y, intensity = 0.3) => {
    const newRipple = {
      id: Date.now() + Math.random(),
      x, y,
      scale: 0,
      opacity: intensity,
      color: 'rgba(255, 255, 255, 0.4)'
    };
    setRipples(prev => [...prev, newRipple]);

    let scale = 0;
    const animate = () => {
      scale += 0.05;
      const opacity = Math.max(0, newRipple.opacity * (1 - scale / 3));
      
      setRipples(prev => prev.map(ripple => 
        ripple.id === newRipple.id 
          ? { ...ripple, scale, opacity }
          : ripple
      ));

      if (opacity > 0 && scale < 3) {
        requestAnimationFrame(animate);
      } else {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // Gesture handlers with progressive disclosure
  const handleGestureStart = (e) => {
    const touch = e.touches?.[0] || e;
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    panStartRef.current = { x, y };
    lastTouchRef.current = { x, y, time: Date.now() };

    // Subtle feedback for professional feel
    createSubtleRipple(x, y);
    
    // Progressive gesture discovery
    if (gestureStage === 0 && !discoveredGestures.includes('tap')) {
      setDiscoveredGestures(prev => [...prev, 'tap']);
      setGestureStage(1);
    }
  };

  const handleGestureMove = (e) => {
    const touch = e.touches?.[0] || e;
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const deltaX = x - panStartRef.current.x;
    const deltaY = y - panStartRef.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Canvas panning (Figma-style)
    if (distance > 10 && currentView === 'canvas') {
      setCanvasPosition(prev => ({
        ...prev,
        x: prev.x + deltaX * 0.5,
        y: prev.y + deltaY * 0.5
      }));
      
      panStartRef.current = { x, y };
      
      // Discover pan gesture
      if (gestureStage === 1 && !discoveredGestures.includes('pan')) {
        setDiscoveredGestures(prev => [...prev, 'pan']);
        setGestureStage(2);
      }
    }
    
    lastTouchRef.current = { x, y, time: Date.now() };
  };

  const handleGestureEnd = () => {
    // Analyze gesture for personality profiling
    const duration = Date.now() - lastTouchRef.current.time;
    analyzeGesture({
      type: 'interaction',
      duration,
      stage: gestureStage,
      view: currentView
    });
  };

  // Entry experience (inspired by Procreate onboarding)
  const renderEntry = () => (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="max-w-2xl px-8">
        <h1 className="text-7xl font-light text-white mb-6 tracking-wide">
          ATX Bro
        </h1>
        <p className="text-2xl text-blue-200 mb-12 font-light">
          Professional Tools Platform
        </p>
        
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl">
              ✨
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Interactive Experience
            </h3>
            <p className="text-blue-300 leading-relaxed">
              Navigate through touch, discover through gesture, and access professional tools through intuitive interaction.
            </p>
          </div>
          
          <button
            onClick={() => setCurrentView('canvas')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-2xl text-white font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Begin Experience
          </button>
        </div>
        
        {gestureStage < gestureStages.length && (
          <div className="mt-8 text-blue-400 text-sm animate-pulse">
            {gestureStages[gestureStage]?.hint}
          </div>
        )}
      </div>
    </div>
  );

  // Infinite canvas view (Miro/Figma inspired)
  const renderCanvas = () => (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Breadcrumb navigation */}
      <div className="absolute top-6 left-6 z-50 flex items-center space-x-2 bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="text-white/80 text-sm">
            {crumb} {index < breadcrumbs.length - 1 && '→'}
          </span>
        ))}
      </div>
      
      {/* Canvas transformation container */}
      <div 
        className="absolute inset-0 transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasPosition.scale})`
        }}
      >
        {/* Central hub */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center">
            <span className="text-4xl">🏠</span>
          </div>
        </div>
        
        {/* App nodes positioned around the canvas */}
        {appNodes.map((node) => (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `calc(50% + ${node.x}px)`,
              top: `calc(50% + ${node.y}px)`
            }}
            onClick={() => {
              setCurrentView(node.id);
              setBreadcrumbs(['Home', node.title]);
            }}
          >
            <div className={`bg-gradient-to-br ${node.color} p-8 rounded-3xl shadow-2xl backdrop-blur-md border border-white/10 min-w-[280px] group-hover:scale-105 transition-all duration-300`}>
              <div className="text-5xl mb-4 text-center">{node.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{node.title}</h3>
              <p className="text-white/70 text-sm mb-4">{node.category}</p>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3">
                <p className="text-white/90 text-sm">
                  Professional {node.category.toLowerCase()} platform with intelligent features
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Gesture progression indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {gestureStages.map((stage, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              discoveredGestures.length > index
                ? 'bg-white scale-125'
                : index === discoveredGestures.length
                ? 'bg-white/50 animate-pulse'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      
      {/* Current gesture hint */}
      {gestureStage < gestureStages.length && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-md rounded-full px-6 py-3">
          <p className="text-white/90 text-sm text-center">
            {gestureStages[gestureStage]?.description}
          </p>
        </div>
      )}
    </div>
  );

  // App-specific views with contextual back navigation
  const renderApp = (appId) => {
    const app = appNodes.find(node => node.id === appId);
    
    return (
      <div className="min-h-screen relative">
        {/* Contextual navigation */}
        <div className="absolute top-6 left-6 z-50 flex items-center space-x-4">
          <button
            onClick={() => {
              setCurrentView('canvas');
              setBreadcrumbs(['Home']);
            }}
            className="bg-black/30 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-black/50 transition-all"
          >
            ← Canvas
          </button>
          <div className="bg-black/20 backdrop-blur-md rounded-2xl px-4 py-2">
            <span className="text-white/80 text-sm">{app?.title}</span>
          </div>
        </div>

        {/* App content */}
        <div className="relative z-10">
          {appId === 'vetnav' && <VetNav />}
          {appId === 'jets-stats' && <JetsStats />}
          {appId === 'pet-radar' && (
            <div className="py-20 bg-gradient-to-br from-yellow-900 via-yellow-800 to-orange-700 text-white min-h-screen">
              <div className="container mx-auto px-4 pt-16">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="text-5xl font-bold mb-6">Pet Adoption Radar</h1>
                  <p className="text-xl text-yellow-200 mb-12">Smart companion matching platform</p>
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
                    <div className="space-y-6">
                      <input 
                        type="text" 
                        placeholder="Enter your location"
                        className="w-full p-4 rounded-2xl bg-white/20 text-white placeholder-white/70 border border-white/10"
                      />
                      <button className="w-full p-4 bg-yellow-600 hover:bg-yellow-700 rounded-2xl text-white font-bold transition-all">
                        Find Compatible Pets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {appId === 'tariff-explorer' && (
            <div className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-700 text-white min-h-screen">
              <div className="container mx-auto px-4 pt-16">
                <div className="text-center max-w-4xl mx-auto">
                  <h1 className="text-5xl font-bold mb-6">Trade Policy Explorer</h1>
                  <p className="text-xl text-purple-200 mb-12">Interactive economic analysis platform</p>
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8">
                    <div className="grid gap-6">
                      <div className="bg-purple-500/20 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-3">Historical Analysis</h3>
                        <p className="text-purple-200">Comprehensive tariff impact modeling</p>
                      </div>
                      <div className="bg-purple-500/20 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-3">Economic Indicators</h3>
                        <p className="text-purple-200">Real-time trade correlation metrics</p>
                      </div>
                      <button className="w-full p-4 bg-purple-600 hover:bg-purple-700 rounded-2xl text-white font-bold transition-all">
                        Launch Analysis Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden"
      onTouchStart={handleGestureStart}
      onTouchMove={handleGestureMove}
      onTouchEnd={handleGestureEnd}
      onMouseDown={handleGestureStart}
      onMouseMove={handleGestureMove}
      onMouseUp={handleGestureEnd}
      style={{ touchAction: 'none' }}
    >
      {/* Subtle gesture overlays */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full border border-white/30 pointer-events-none z-20"
          style={{
            left: ripple.x - 30,
            top: ripple.y - 30,
            width: 60,
            height: 60,
            transform: `scale(${ripple.scale})`,
            opacity: ripple.opacity,
            transition: 'none'
          }}
        />
      ))}

      {/* Development debug panel */}
      {profile && (
        <div className="fixed top-4 right-4 bg-black/60 backdrop-blur-md text-white p-3 rounded-2xl text-xs z-50">
          <div>Stage: {gestureStage}</div>
          <div>View: {currentView}</div>
          <div>Profile: {profile.personality || 'developing'}</div>
        </div>
      )}

      {/* Render current view */}
      {currentView === 'entry' && renderEntry()}
      {currentView === 'canvas' && renderCanvas()}
      {currentView !== 'entry' && currentView !== 'canvas' && renderApp(currentView)}
    </div>
  );
}
