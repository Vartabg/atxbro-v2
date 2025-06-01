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
  const gestureStartTime = useRef(0);

  const { profile, analyzeGesture, metrics } = useGestureProfiler();

  const sections = [
    { id: 'welcome', title: 'ATX Bro', subtitle: 'Interactive Experience', color: 'from-blue-900' },
    { id: 'tap-ripple', title: 'Tap Ripples', subtitle: 'Create expanding ripples', color: 'from-purple-900' },
    { id: 'drag-physics', title: 'Drag Physics', subtitle: 'Drag with momentum', color: 'from-green-900' },
    { id: 'elastic', title: 'Elastic Elements', subtitle: 'Stretch and bounce', color: 'from-pink-900' },
    { id: 'magnetic', title: 'Magnetic Fields', subtitle: 'Elements attract to touch', color: 'from-orange-900' },
    { id: 'particle-system', title: 'Particle System', subtitle: 'Touch creates particles', color: 'from-red-900' },
    { id: 'multitouch-orchestra', title: 'Touch Orchestra', subtitle: 'Multiple fingers create music', color: 'from-indigo-900' },
    { id: 'gesture-drawing', title: 'Gesture Canvas', subtitle: 'Draw with your fingers', color: 'from-cyan-900' },
    { id: 'vetnav', title: 'VetNav', subtitle: 'Veterans Benefits Guide', color: 'from-blue-900' },
    { id: 'jets-stats', title: 'Jets Stats', subtitle: 'NY Jets Analytics Hub', color: 'from-green-900' },
    { id: 'pet-radar', title: 'Pet Radar', subtitle: 'Find Your Perfect Pet', color: 'from-yellow-900' },
    { id: 'tariff-explorer', title: 'Tariff Explorer', subtitle: 'Economic Trade Analysis', color: 'from-purple-900' }
  ];
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

  const renderProfileDebug = () => {
    if (!profile) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs">
        <div>Personality: {profile.personality}</div>
        <div>Confidence: {(profile.confidence * 100).toFixed(0)}%</div>
        <div>CTA Type: {profile.preferredCTA}</div>
        <div>Tap Speed: {metrics.tapSpeed.toFixed(1)}</div>
        <div>Swipe Force: {metrics.swipeForce.toFixed(1)}</div>
        <div>Hesitation: {metrics.hesitationTime.toFixed(0)}ms</div>
      </div>
    );
  };

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

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.2,
        life: particle.life - 0.02,
        vx: particle.vx * 0.99
      })).filter(particle => particle.life > 0));

      if (particles.some(p => p.life > 0)) {
        requestAnimationFrame(animateParticles);
      }
    };
    requestAnimationFrame(animateParticles);
  }, [particles]);
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    gestureStartTime.current = Date.now();
    setDragStart({ x, y });
    setDragPosition({ x, y });
    setIsDragging(true);
    setFingerCount(e.touches.length);
    lastTouchRef.current = { x, y, time: Date.now() };

    if (currentSection === 1) createRipple(x, y);
    if (currentSection === 5) createParticles(x, y);

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

    const deltaTime = Date.now() - lastTouchRef.current.time;
    const deltaX = x - lastTouchRef.current.x;
    const deltaY = y - lastTouchRef.current.y;
    
    setVelocity({
      x: deltaX / deltaTime * 16,
      y: deltaY / deltaTime * 16
    });

    setDragPosition({ x, y });
    setSwipeTrail(prev => [...prev.slice(-20), { x, y, time: Date.now() }]);

    if (currentSection === 4) {
      setMagneticElements(prev => prev.map(elem => ({
        ...elem,
        targetX: x,
        targetY: y
      })));
    }

    lastTouchRef.current = { x, y, time: Date.now() };

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

    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      setPinchScale(Math.max(0.5, Math.min(3, distance / 200)));

      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      ) * 180 / Math.PI;
      setRotateAngle(angle);
    }
  };

  const handleTouchEnd = () => {
    const duration = Date.now() - gestureStartTime.current;
    const totalDistance = Math.sqrt(
      Math.pow(dragPosition.x - dragStart.x, 2) + 
      Math.pow(dragPosition.y - dragStart.y, 2)
    );
    
    analyzeGesture({
      type: totalDistance < 10 ? 'tap' : 'swipe',
      velocity: Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y),
      duration,
      fingerCount,
      hesitation: longPressProgress > 0 ? longPressProgress * 1000 : 0
    });

    setIsDragging(false);
    setSwipeDirection('');
    setLongPressActive(false);
    setLongPressProgress(0);
    setFingerCount(0);
    
    handleSwipe();setTimeout(() => setSwipeTrail([]), 1000);
  };

    const handleTap = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setTapCount(prev => prev + 1);
    
    setTimeout(() => {
      if (tapCount === 0) {
        // Navigate to next section on tap
        setCurrentSection(prev => (prev + 1) % sections.length);
        createRipple(x, y);
      }
      setTapCount(0);
    }, 300);
  };

  // Add swipe navigation
  const handleSwipe = () => {
    if (Math.abs(velocity.x) > Math.abs(velocity.y)) {
      // Horizontal swipe
      if (velocity.x > 5) {
        // Swipe right - previous section
        setCurrentSection(prev => Math.max(0, prev - 1));
      } else if (velocity.x < -5) {
        // Swipe left - next section
        setCurrentSection(prev => Math.min(sections.length - 1, prev + 1));
      }
    } else {
      // Vertical swipe
      if (velocity.y < -5) {
        // Swipe up - next section
        setCurrentSection(prev => Math.min(sections.length - 1, prev + 1));
      } else if (velocity.y > 5) {
        // Swipe down - previous section
        setCurrentSection(prev => Math.max(0, prev - 1));
      }
    }
  };

  useEffect(() => {
    if (currentSection === 4) {
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

  useEffect(() => {
    const animate = () => {
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
    
    if (currentSection === 8) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
          <div className="space-y-8 w-full max-w-4xl">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
              <p className="text-xl text-blue-200 mb-8">{section.subtitle}</p>
              
              {profile && profile.confidence > 0.5 && (
                <div className="mb-6 p-4 bg-yellow-500/20 rounded-lg">
                  <p className="text-sm text-yellow-200">
                    Based on your interaction style, we recommend a {profile.personality} approach
                  </p>
                </div>
              )}

              <div className="grid gap-4 mb-8">
                <div className="bg-red-500/20 p-4 rounded-lg text-left">
                  <div className="font-semibold text-red-200 mb-2">
                    Myth: I make too much money to be eligible
                  </div>
                  <div className="text-green-200">
                    Fact: Income only affects certain benefits like VA Pension
                  </div>
                </div>
                <div className="bg-red-500/20 p-4 rounded-lg text-left">
                  <div className="font-semibold text-red-200 mb-2">
                    Myth: I have been out too long to apply
                  </div>
                  <div className="text-green-200">
                    Fact: Most VA benefits have no time limit
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.open('/vetnav', '_blank')}
                className={`w-full p-6 rounded-xl text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 ${getPersonalizedCTA().style}`}
              >
                {getPersonalizedCTA().text}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentSection === 9) {
      return <JetsStats />;
    }

    if (currentSection === 10) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
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
    }

    if (currentSection === 11) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
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
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 relative">
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

        {currentSection === 2 && (
          <div 
            className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl"
            style={{
              transform: `translate(${dragPosition.x - window.innerWidth/2}px, ${dragPosition.y - window.innerHeight/2}px)`,
              transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }}
          >
            <span className="text-2xl">??</span>
          </div>
        )}

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

                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-center z-50">
          <p className="text-sm text-blue-300 bg-black/50 backdrop-blur-md rounded-full px-4 py-3 shadow-lg border border-white/20">
            {currentSection === 0 ? 'Tap to begin the journey' :
             currentSection === 1 ? 'Tap anywhere to create ripples' :
             currentSection === 2 ? 'Drag the target around' :
             currentSection === 3 ? 'Stretch and release elements' :
             currentSection === 4 ? 'Touch to attract magnetic fields' :
             currentSection === 5 ? 'Tap to explode particles' :
             currentSection === 6 ? 'Use multiple fingers to play' :
             currentSection === 7 ? 'Draw with your gestures' :
             currentSection === 8 ? 'Explore VetNav benefits' :
             currentSection === 9 ? 'Browse Jets statistics' :
             currentSection === 10 ? 'Search for pets' :
             'Analyze tariff data'}
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
      {renderProfileDebug()}
      {renderSection()}
    </div>
  );
}



