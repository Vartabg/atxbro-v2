"use client";
import VetNav from '../components/VetNav';
import JetsStats from '../components/JetsStats';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGestureProfiler } from '../hooks/useGestureProfiler';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const [particles, setParticles] = useState([]);
  const [magneticElements, setMagneticElements] = useState([]);
  const [swipeTrail, setSwipeTrail] = useState([]);
  
  const containerRef = useRef(null);
  const lastTouchRef = useRef({ x: 0, y: 0, time: 0 });
  const gestureStartTime = useRef(0);

  const { profile, analyzeGesture, metrics } = useGestureProfiler();

  const sections = [
    { id: 'welcome', title: 'ATX Bro', subtitle: 'Interactive Experience', color: 'from-blue-900' },
    { id: 'vetnav', title: 'VetNav', subtitle: 'Veterans Benefits Guide', color: 'from-blue-900' },
    { id: 'jets-stats', title: 'Jets Stats', subtitle: 'NY Jets Analytics Hub', color: 'from-green-900' },
    { id: 'pet-radar', title: 'Pet Radar', subtitle: 'Find Your Perfect Pet', color: 'from-yellow-900' },
    { id: 'tariff-explorer', title: 'Tariff Explorer', subtitle: 'Economic Trade Analysis', color: 'from-purple-900' }
  ];
  // Universal gesture effects that work on ALL sections
  const createRipple = useCallback((x, y) => {
    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      scale: 0,
      opacity: 1
    };
    setRipples(prev => [...prev, newRipple]);

    let scale = 0;
    let opacity = 1;
    const animate = () => {
      scale += 0.1;
      opacity -= 0.02;
      
      setRipples(prev => prev.map(ripple => 
        ripple.id === newRipple.id 
          ? { ...ripple, scale, opacity: Math.max(0, opacity) }
          : ripple
      ));

      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }
    };
    requestAnimationFrame(animate);
  }, []);

  const createParticles = useCallback((x, y, count = 15) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 1,
      size: Math.random() * 6 + 2,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));

    setParticles(prev => [...prev, ...newParticles]);

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.15,
        life: particle.life - 0.015,
        vx: particle.vx * 0.98
      })).filter(particle => particle.life > 0));

      if (particles.some(p => p.life > 0)) {
        requestAnimationFrame(animateParticles);
      }
    };
    requestAnimationFrame(animateParticles);
  }, [particles]);

    const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    gestureStartTime.current = Date.now();
    setDragStart({ x, y });
    setDragPosition({ x, y });
    setIsDragging(true);
    lastTouchRef.current = { x, y, time: Date.now() };

    // Smart gesture application based on context
    const shouldCreateRipple = () => {
      // Welcome screen - always show effects
      if (currentSection === 0) return true;
      
      // Only on empty space (not on interactive elements)
      const target = e.target;
      const isInteractiveElement = target.tagName === 'BUTTON' || 
                                  target.tagName === 'INPUT' || 
                                  target.tagName === 'A' ||
                                  target.closest('button') ||
                                  target.closest('input') ||
                                  target.closest('a') ||
                                  target.closest('.interactive');
      
      return !isInteractiveElement;
    };

    if (shouldCreateRipple()) {
      createRipple(x, y);
    }
  };

  const handleTouchEnd = () => {
    const duration = Date.now() - gestureStartTime.current;
    const totalDistance = Math.sqrt(
      Math.pow(dragPosition.x - dragStart.x, 2) + 
      Math.pow(dragPosition.y - dragStart.y, 2)
    );
    
    // Smart particle creation
    const shouldCreateParticles = () => {
      // Only on significant movement in non-form areas
      if (totalDistance < 100) return false;
      if (currentSection === 0) return true; // Welcome screen
      
      // Avoid particles when user is likely trying to scroll/navigate content
      const target = document.elementFromPoint(dragPosition.x, dragPosition.y);
      const isContentArea = target?.closest('.content-area') || 
                           target?.closest('table') ||
                           target?.closest('form');
      
      return !isContentArea;
    };

    if (shouldCreateParticles()) {
      createParticles(dragPosition.x, dragPosition.y, 6); // Reduced count
    }
    
    // Navigation logic
    if (Math.abs(velocity.y) > 12) { // Higher threshold for navigation
      if (velocity.y < 0) {
        setCurrentSection(prev => Math.min(sections.length - 1, prev + 1));
      } else {
        setCurrentSection(prev => Math.max(0, prev - 1));
      }
    }
    
    setIsDragging(false);
    setTimeout(() => setSwipeTrail([]), 600);
  };

  const handleTap = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Smart tap effects
    const target = e.target;
    const isButton = target.tagName === 'BUTTON' || target.closest('button');
    
    if (isButton) {
      // Subtle effect for button presses (like iOS button feedback)
      createRipple(x, y);
    } else if (currentSection === 0) {
      // Full effects on welcome screen
      createRipple(x, y);
      createParticles(x, y, 4);
      if (currentSection === 0) {
        setCurrentSection(1);
      }
    }
  };


  // Initialize magnetic elements
  useEffect(() => {
    setMagneticElements(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      targetX: Math.random() * window.innerWidth,
      targetY: Math.random() * window.innerHeight,
      size: 15 + Math.random() * 25
    })));
  }, []);

  // Animate magnetic elements
  useEffect(() => {
    const animate = () => {
      setMagneticElements(prev => prev.map(elem => ({
        ...elem,
        x: elem.x + (elem.targetX - elem.x) * 0.05,
        y: elem.y + (elem.targetY - elem.y) * 0.05
      })));
      requestAnimationFrame(animate);
    };
    animate();
  }, []);
  const renderProfileDebug = () => {
    if (!profile) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs z-50">
        <div>Personality: {profile.personality}</div>
        <div>Confidence: {(profile.confidence * 100).toFixed(0)}%</div>
        <div>CTA Type: {profile.preferredCTA}</div>
        <div>Gestures: {metrics.tapSpeed.toFixed(1)}</div>
      </div>
    );
  };

  const getPersonalizedCTA = () => {
    if (!profile || profile.confidence < 0.3) {
      return {
        text: "Discover Your Path",
        style: "bg-blue-600 hover:bg-blue-700",
        urgency: "normal"
      };
    }

    switch (profile.preferredCTA) {
      case 'urgent':
        return {
          text: "CLAIM NOW - Limited Time",
          style: "bg-red-600 hover:bg-red-700 animate-pulse",
          urgency: "high"
        };
      case 'detailed':
        return {
          text: "Explore Complete Benefits Guide",
          style: "bg-green-600 hover:bg-green-700",
          urgency: "low"
        };
      case 'social':
        return {
          text: "Join 2M+ Veterans Who Found Help",
          style: "bg-purple-600 hover:bg-purple-700",
          urgency: "social"
        };
      case 'logical':
        return {
          text: "Calculate Your Eligible Benefits",
          style: "bg-blue-600 hover:bg-blue-700",
          urgency: "logical"
        };
      default:
        return {
          text: "Find Your Benefits",
          style: "bg-blue-600 hover:bg-blue-700",
          urgency: "normal"
        };
    }
  };

  const renderContent = () => {
    const section = sections[currentSection];
    
    switch (currentSection) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                {section.title}
              </h1>
              <p className="text-2xl text-blue-200 mb-8">
                {section.subtitle}
              </p>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-lg font-medium mb-8">
                Interactive Gesture Experience
              </div>
              <p className="text-lg text-blue-300">
                Touch anywhere to begin your journey through our interactive platform
              </p>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="relative z-10">
            <VetNav />
          </div>
        );
      
      case 2:
        return (
          <div className="relative z-10">
            <JetsStats />
          </div>
        );
      
      case 3:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 relative z-10">
            <div className="space-y-8 w-full max-w-4xl">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
                <p className="text-xl text-yellow-200 mb-8">{section.subtitle}</p>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Enter ZIP code"
                    className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/70"
                  />
                  <button className="w-full p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-bold">
                    Search Available Pets
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 relative z-10">
            <div className="space-y-8 w-full max-w-4xl">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
                <p className="text-xl text-purple-200 mb-8">{section.subtitle}</p>
                <div className="grid gap-6">
                  <div className="bg-purple-500/20 p-4 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">Historical Tariff Rates</h3>
                    <p className="text-purple-200">Analyze trade policy impacts over time</p>
                  </div>
                  <div className="bg-purple-500/20 p-4 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">Economic Indicators</h3>
                    <p className="text-purple-200">GDP, employment, and trade correlations</p>
                  </div>
                  <button className="w-full p-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-bold">
                    Explore Trade Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br ${sections[currentSection].color} via-blue-800 to-teal-700 relative overflow-hidden transition-colors duration-1000`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
      style={{ touchAction: 'none' }}
    >
      {/* Universal Gesture Overlays - Work on ALL sections */}
      
      {/* Ripples overlay */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full border-2 border-white pointer-events-none z-20"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
            transform: `scale(${ripple.scale})`,
            opacity: ripple.opacity,
            transition: 'none'
          }}
        />
      ))}

      {/* Particles overlay */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none z-20"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Swipe trail */}
      {swipeTrail.map((point, index) => (
        <div
          key={index}
          className="absolute w-3 h-3 bg-white/60 rounded-full pointer-events-none z-20"
          style={{
            left: point.x,
            top: point.y,
            opacity: index / swipeTrail.length,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Magnetic elements */}
      {magneticElements.map(elem => (
        <div
          key={elem.id}
          className="absolute bg-white/20 backdrop-blur-sm rounded-full pointer-events-none z-20"
          style={{
            left: elem.x,
            top: elem.y,
            width: elem.size,
            height: elem.size,
            transform: 'translate(-50%, -50%)',
            transition: 'none'
          }}
        />
      ))}

      {/* Debug panel */}
      {renderProfileDebug()}

      {/* Main content */}
      {renderContent()}

      {/* Progress visualization */}
      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2">
          {sections.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSection 
                  ? 'bg-white w-8' 
                  : index < currentSection
                  ? 'bg-white/60 w-6'
                  : 'bg-white/30 w-4'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic instructions */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-center z-50">
        <p className="text-sm text-blue-300 bg-black/50 backdrop-blur-md rounded-full px-4 py-3 shadow-lg border border-white/20">
          {currentSection === 0 ? 'Touch anywhere to create ripples and particles' :
           currentSection === 1 ? 'Swipe up/down to navigate • Touch creates effects' :
           currentSection === 2 ? 'Interactive gestures work throughout' :
           currentSection === 3 ? 'All gesture effects active' :
           'Gesture playground active on all sections'}
        </p>
      </div>
    </div>
  );
}

