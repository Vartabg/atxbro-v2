"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [swipeDirection, setSwipeDirection] = useState('');
  const [pinchScale, setPinchScale] = useState(1);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [longPressActive, setLongPressActive] = useState(false);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [fingerCount, setFingerCount] = useState(0);
  const [ripples, setRipples] = useState([]);
  const [particles, setParticles] = useState([]);
  const [magneticElements, setMagneticElements] = useState([]);
  const [elasticElements, setElasticElements] = useState([]);
  const [swipeTrail, setSwipeTrail] = useState([]);
  
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTouchRef = useRef({ x: 0, y: 0, time: 0 });

  const sections = [
    { id: 'welcome', title: 'ATX Bro', subtitle: 'Interactive Experience', color: 'from-blue-900' },
    { id: 'tap-ripple', title: 'Tap Ripples', subtitle: 'Create expanding ripples', color: 'from-purple-900' },
    { id: 'drag-physics', title: 'Drag Physics', subtitle: 'Drag with momentum', color: 'from-green-900' },
    { id: 'elastic', title: 'Elastic Elements', subtitle: 'Stretch and bounce', color: 'from-pink-900' },
    { id: 'magnetic', title: 'Magnetic Fields', subtitle: 'Elements attract to touch', color: 'from-orange-900' },
    { id: 'particle-system', title: 'Particle System', subtitle: 'Touch creates particles', color: 'from-red-900' },
    { id: 'multitouch-orchestra', title: 'Touch Orchestra', subtitle: 'Multiple fingers create music', color: 'from-indigo-900' },
    { id: 'gesture-drawing', title: 'Gesture Canvas', subtitle: 'Draw with your fingers', color: 'from-cyan-900' },
    { id: 'vetnav', title: 'VetNav', subtitle: 'Veterans Benefits Guide', color: 'from-blue-900' }
  ];

  // Create ripple effect
  const createRipple = useCallback((x, y) => {
    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y,
      scale: 0,
      opacity: 1
    };
    setRipples(prev => [...prev, newRipple]);

    // Animate ripple
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

  // Create particle explosion
  const createParticles = useCallback((x, y, count = 20) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1,
      size: Math.random() * 8 + 2,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Animate particles
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.2, // gravity
        life: particle.life - 0.02,
        vx: particle.vx * 0.99 // friction
      })).filter(particle => particle.life > 0));

      if (particles.some(p => p.life > 0)) {
        requestAnimationFrame(animateParticles);
      }
    };
    requestAnimationFrame(animateParticles);
  }, [particles]);

  // Enhanced touch handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setDragStart({ x, y });
    setDragPosition({ x, y });
    setIsDragging(true);
    setFingerCount(e.touches.length);
    lastTouchRef.current = { x, y, time: Date.now() };

    // Section-specific interactions
    if (currentSection === 1) { // Ripples
      createRipple(x, y);
    }
    
    if (currentSection === 5) { // Particles
      createParticles(x, y);
    }

    // Long press with progress
    let progress = 0;
    const longPressTimer = setInterval(() => {
      progress += 0.05;
      setLongPressProgress(progress);
      if (progress >= 1) {
        setLongPressActive(true);
        clearInterval(longPressTimer);
      }
    }, 50);

    const clearLongPress = () => {
      clearInterval(longPressTimer);
      setLongPressProgress(0);
      setLongPressActive(false);
    };

    document.addEventListener('touchend', clearLongPress, { once: true });
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Calculate velocity
    const deltaTime = Date.now() - lastTouchRef.current.time;
    const deltaX = x - lastTouchRef.current.x;
    const deltaY = y - lastTouchRef.current.y;
    
    setVelocity({
      x: deltaX / deltaTime * 16,
      y: deltaY / deltaTime * 16
    });

    setDragPosition({ x, y });
    
    // Add to swipe trail
    setSwipeTrail(prev => [...prev.slice(-20), { x, y, time: Date.now() }]);

    // Update magnetic elements
    if (currentSection === 4) {
      setMagneticElements(prev => prev.map(elem => ({
        ...elem,
        targetX: x,
        targetY: y
      })));
    }

    lastTouchRef.current = { x, y, time: Date.now() };

    // Determine swipe direction with magnitude
    const totalDeltaX = x - dragStart.x;
    const totalDeltaY = y - dragStart.y;
    const magnitude = Math.sqrt(totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY);
    
    if (magnitude > 50) {
      if (Math.abs(totalDeltaX) > Math.abs(totalDeltaY)) {
        setSwipeDirection(totalDeltaX > 0 ? 'right' : 'left');
      } else {
        setSwipeDirection(totalDeltaY > 0 ? 'down' : 'up');
      }
    }

    // Handle pinch/zoom and rotation
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Pinch
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setPinchScale(Math.max(0.5, Math.min(3, distance / 200)));

      // Rotation
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * 180 / Math.PI;
      setRotateAngle(angle);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setSwipeDirection('');
    setLongPressActive(false);
    setLongPressProgress(0);
    setFingerCount(0);
    
    // Apply momentum to draggable elements
    if (currentSection === 2 && Math.abs(velocity.x) > 2 || Math.abs(velocity.y) > 2) {
      // Momentum animation would go here
    }

    // Clear swipe trail
    setTimeout(() => setSwipeTrail([]), 1000);
  };

  // Tap detection with sophisticated timing
  const handleTap = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setTapCount(prev => prev + 1);
    
    setTimeout(() => {
      if (tapCount === 0) { // Single tap
        if (currentSection === 0) {
          setCurrentSection(1);
        }
        createRipple(x, y);
      }
      setTapCount(0);
    }, 300);
  };

  // Initialize elements for different sections
  useEffect(() => {
    if (currentSection === 4) { // Magnetic elements
      setMagneticElements(Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        targetX: Math.random() * window.innerWidth,
        targetY: Math.random() * window.innerHeight,
        size: 20 + Math.random() * 30
      })));
    }
  }, [currentSection]);

  // Animation loop for physics
  useEffect(() => {
    const animate = () => {
      // Update magnetic elements
      setMagneticElements(prev => prev.map(elem => ({
        ...elem,
        x: elem.x + (elem.targetX - elem.x) * 0.1,
        y: elem.y + (elem.targetY - elem.y) * 0.1
      })));

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    if (currentSection === 4) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentSection]);

  const renderSection = () => {
    const section = sections[currentSection];
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
        {/* Ripples overlay */}
        {ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute rounded-full border-2 border-white pointer-events-none"
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
            className="absolute rounded-full pointer-events-none"
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
            className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
            style={{
              left: point.x,
              top: point.y,
              opacity: index / swipeTrail.length,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}

        {/* Magnetic elements */}
        {currentSection === 4 && magneticElements.map(elem => (
          <div
            key={elem.id}
            className="absolute bg-white/30 backdrop-blur-md rounded-full pointer-events-none"
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

        {/* Main content */}
        <div 
          className="mb-8 transition-all duration-500 ease-out"
          style={{ 
            transform: `scale(${currentSection === 2 ? pinchScale : 1}) rotate(${currentSection === 6 ? rotateAngle : 0}deg)`,
          }}
        >
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            {section.title}
          </h1>
          <p className="text-2xl text-blue-200">
            {section.subtitle}
          </p>
        </div>

        {/* Long press progress indicator */}
        {longPressProgress > 0 && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 relative">
              <div 
                className="absolute inset-0 rounded-full border-4 border-white"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(longPressProgress * 2 * Math.PI - Math.PI/2)}% ${50 + 50 * Math.sin(longPressProgress * 2 * Math.PI - Math.PI/2)}%, 50% 50%)`
                }}
              />
            </div>
          </div>
        )}

        {/* Interactive elements based on section */}
        {currentSection === 2 && ( // Drag physics
          <div 
            className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl"
            style={{
              transform: `translate(${dragPosition.x - window.innerWidth/2}px, ${dragPosition.y - window.innerHeight/2}px)`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }}
          >
            <span className="text-2xl">🎯</span>
          </div>
        )}

        {/* Progress visualization */}
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            {sections.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentSection 
                    ? 'bg-white w-8' 
                    : index < currentSection
                    ? 'bg-white/50 w-4'
                    : 'bg-white/20 w-2'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic instructions */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm text-blue-300 bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
            {currentSection === 0 ? 'Tap to begin the journey' :
             currentSection === 1 ? 'Tap anywhere to create ripples' :
             currentSection === 2 ? 'Drag the target around' :
             currentSection === 3 ? 'Stretch and release elements' :
             currentSection === 4 ? 'Touch to attract magnetic fields' :
             currentSection === 5 ? 'Tap to explode particles' :
             currentSection === 6 ? 'Use multiple fingers to play' :
             currentSection === 7 ? 'Draw with your gestures' :
             'Swipe up to continue or explore VetNav'}
          </p>
        </div>
      </div>
    );
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
      {renderSection()}
    </div>
  );
}
