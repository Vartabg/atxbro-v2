"use client";
import { useState, useEffect, useCallback } from 'react';

export interface GestureProfile {
  personality: 'impulsive' | 'analytical' | 'creative' | 'methodical';
  confidence: number;
  preferredCTA: 'urgent' | 'detailed' | 'social' | 'logical';
}

export interface GestureMetrics {
  tapSpeed: number;
  swipeForce: number;
  hesitationTime: number;
  gestureComplexity: number;
  multiTouchUsage: number;
}

export const useGestureProfiler = () => {
  const [profile, setProfile] = useState<GestureProfile | null>(null);
  const [metrics, setMetrics] = useState<GestureMetrics>({
    tapSpeed: 0,
    swipeForce: 0,
    hesitationTime: 0,
    gestureComplexity: 0,
    multiTouchUsage: 0
  });

  const analyzeGesture = useCallback((gestureData: any) => {
    const { type, velocity, duration, fingerCount, hesitation } = gestureData;
    
    setMetrics(prev => {
      const updated = {
        tapSpeed: type === 'tap' ? (prev.tapSpeed + (1000 / duration)) / 2 : prev.tapSpeed,
        swipeForce: type === 'swipe' ? (prev.swipeForce + velocity) / 2 : prev.swipeForce,
        hesitationTime: (prev.hesitationTime + hesitation) / 2,
        gestureComplexity: fingerCount > 1 ? prev.gestureComplexity + 0.1 : prev.gestureComplexity,
        multiTouchUsage: fingerCount > 1 ? prev.multiTouchUsage + 1 : prev.multiTouchUsage
      };

      const personality = determinePersonality(updated);
      const confidence = calculateConfidence(updated);
      const preferredCTA = determinePreferredCTA(personality, updated);

      setProfile({ personality, confidence, preferredCTA });
      
      return updated;
    });
  }, []);

  const determinePersonality = (m: GestureMetrics): GestureProfile['personality'] => {
    if (m.tapSpeed > 5 && m.hesitationTime < 500) return 'impulsive';
    if (m.hesitationTime > 2000 && m.gestureComplexity < 1) return 'analytical';
    if (m.multiTouchUsage > 3 && m.gestureComplexity > 2) return 'creative';
    return 'methodical';
  };

  const calculateConfidence = (m: GestureMetrics): number => {
    const totalSamples = m.tapSpeed + m.swipeForce + m.gestureComplexity;
    return Math.min(totalSamples / 10, 1);
  };

  const determinePreferredCTA = (
    personality: GestureProfile['personality'], 
    m: GestureMetrics
  ): GestureProfile['preferredCTA'] => {
    switch (personality) {
      case 'impulsive': return 'urgent';
      case 'analytical': return 'detailed';
      case 'creative': return 'social';
      case 'methodical': return 'logical';
      default: return 'logical';
    }
  };

  return { profile, analyzeGesture, metrics };
};
