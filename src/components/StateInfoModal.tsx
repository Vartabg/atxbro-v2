'use client';

import React, { useEffect, useState } from 'react';
import { X, Users, DollarSign, Award, MapPin, ChevronRight } from 'lucide-react';

interface StateInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onViewBenefits: () => void;
  stateInfo: {
    name: string;
    code: string;
    stats: {
      veteranPopulation: number;
      beneficiariesCount: number;
      averageBenefit: string;
      topBenefit: string;
    };
  } | null;
  spawnPosition?: { x: number; y: number };
}

export default function StateInfoModal({
  isVisible,
  onClose,
  onViewBenefits,
  stateInfo,
  spawnPosition = { x: 50, y: 50 }
}: StateInfoModalProps) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setMounted(true);
      // Smooth linear progress from 0 to 1
      const duration = 600; // ms
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function - much more fluid
        const eased = newProgress < 0.5 
          ? 2 * newProgress * newProgress 
          : 1 - Math.pow(-2 * newProgress + 2, 3) / 2;
        
        setProgress(eased);
        
        if (newProgress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else if (mounted) {
      // Quick fade out
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.max(1 - (elapsed / 200), 0);
        setProgress(newProgress);
        
        if (newProgress > 0) {
          requestAnimationFrame(animate);
        } else {
          setMounted(false);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible, mounted]);

  if (!mounted || !stateInfo) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Smooth transformations based on progress
  const modalScale = 0.3 + (progress * 0.7); // 0.3 to 1.0
  const modalOpacity = progress;
  const backdropOpacity = progress * 0.4;
  
  // Smooth position interpolation
  const startX = spawnPosition.x;
  const startY = spawnPosition.y;
  const endX = 50; // Center
  const endY = 50; // Center
  
  const currentX = startX + (endX - startX) * progress;
  const currentY = startY + (endY - startY) * progress;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" style={{ perspective: '1000px' }}>
      {/* Smooth backdrop */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-200 ease-out"
        style={{ 
          opacity: backdropOpacity,
          pointerEvents: progress > 0.5 ? 'auto' : 'none',
          backdropFilter: `blur(${progress * 8}px)`
        }}
        onClick={onClose}
      />
      
      {/* Fluid modal */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          transform: `translate(-50%, -50%) scale(${modalScale})`,
          opacity: modalOpacity,
          transformOrigin: 'center center',
          transition: 'none' // We handle animation manually for smoothness
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-80 overflow-hidden">
          {/* Header with subtle gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm"
                  style={{
                    transform: `translateY(${(1 - progress) * 20}px)`,
                    opacity: progress
                  }}
                >
                  <MapPin className="w-5 h-5" />
                </div>
                <div
                  style={{
                    transform: `translateX(${(1 - progress) * 30}px)`,
                    opacity: progress
                  }}
                >
                  <h2 className="text-xl font-bold">{stateInfo.name}</h2>
                  <p className="text-blue-100 text-sm">Veterans Overview</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                style={{
                  transform: `rotate(${(1 - progress) * 180}deg)`,
                  opacity: progress
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats with staggered smooth entrance */}
          <div className="p-6 space-y-3">
            {[
              { icon: Users, value: formatNumber(stateInfo.stats.veteranPopulation), label: 'Total Veterans', bg: 'bg-blue-50', iconBg: 'bg-blue-500', delay: 0 },
              { icon: Award, value: formatNumber(stateInfo.stats.beneficiariesCount), label: 'Receiving Benefits', bg: 'bg-green-50', iconBg: 'bg-green-500', delay: 0.1 },
              { icon: DollarSign, value: stateInfo.stats.averageBenefit, label: 'Average Benefit', bg: 'bg-yellow-50', iconBg: 'bg-yellow-500', delay: 0.2 },
              { icon: Award, value: stateInfo.stats.topBenefit, label: 'Top State Benefit', bg: 'bg-purple-50', iconBg: 'bg-purple-500', delay: 0.3 }
            ].map((stat, index) => {
              const Icon = stat.icon;
              const itemProgress = Math.max(0, Math.min(1, (progress - stat.delay) / 0.4));
              
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${stat.bg} transition-colors duration-300 hover:shadow-sm`}
                  style={{
                    transform: `translateX(${(1 - itemProgress) * 40}px)`,
                    opacity: itemProgress,
                    transition: 'box-shadow 0.2s ease'
                  }}
                >
                  <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{stat.value}</div>
                    <div className="text-sm text-gray-600 truncate">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons with smooth entrance */}
          <div className="p-6 pt-0 space-y-3">
            <button
              onClick={onViewBenefits}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 group"
              style={{
                transform: `translateY(${(1 - Math.max(0, Math.min(1, (progress - 0.3) / 0.3))) * 20}px)`,
                opacity: Math.max(0, Math.min(1, (progress - 0.3) / 0.3))
              }}
            >
              <span>Explore All Benefits</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
              style={{
                transform: `translateY(${(1 - Math.max(0, Math.min(1, (progress - 0.4) / 0.3))) * 20}px)`,
                opacity: Math.max(0, Math.min(1, (progress - 0.4) / 0.3))
              }}
            >
              Close
            </button>
          </div>

          {/* Tip with final entrance */}
          <div className="px-6 pb-6">
            <p
              className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3"
              style={{
                opacity: Math.max(0, Math.min(1, (progress - 0.5) / 0.3))
              }}
            >
              💡 Click the same state again for quick access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 