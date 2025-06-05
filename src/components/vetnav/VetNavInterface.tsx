'use client';
import React, { useState, useEffect } from 'react';
import DeckGlMap from './DeckGlMap';
import VetNavLegacy from './VetNavLegacy';

interface VetNavInterfaceProps {
  onClose?: () => void;
}

const VetNavInterface: React.FC<VetNavInterfaceProps> = ({ onClose }) => {
  const [useMap, setUseMap] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Device capability detection with security checks
  useEffect(() => {
    const detectCapabilities = async () => {
      try {
        // Check for WebGL2 support (required for DeckGL)
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        // Check for hardware acceleration
        const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        // Memory estimation (rough)
        const memoryInfo = (performance as any).memory;
        const hasEnoughMemory = !memoryInfo || memoryInfo.usedJSHeapSize < 50 * 1024 * 1024; // 50MB threshold
        
        // Device checks
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEndDevice = renderer?.toLowerCase().includes('intel') && renderer?.toLowerCase().includes('hd');
        
        // Final capability decision
        const canRunMap = !!(gl && hasEnoughMemory && !isLowEndDevice);
        
        // Cleanup
        canvas.remove();
        
        setUseMap(canRunMap);
        setLoading(false);
        
        console.log('VetNav Capability Check:', {
          webgl: !!gl,
          memory: hasEnoughMemory,
          mobile: isMobile,
          lowEnd: isLowEndDevice,
          decision: canRunMap
        });
        
      } catch (error) {
        console.warn('Capability detection failed, defaulting to legacy:', error);
        setUseMap(false);
        setLoading(false);
      }
    };

    detectCapabilities();
    
    // Memory cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && window.gc) {
        window.gc(); // Force garbage collection if available
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing VetNav...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[80vh] bg-gray-900">
      {/* Accessibility Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {useMap && (
          <button
            onClick={() => setUseMap(false)}
            className="px-3 py-2 bg-gray-800 text-white rounded-md text-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Switch to accessible mode"
          >
            Accessible Mode
          </button>
        )}
        {!useMap && (
          <button
            onClick={() => setUseMap(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Switch to 3D map mode"
          >
            3D Map Mode
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Close VetNav"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      {useMap ? (
        <div className="w-full h-full">
          <DeckGlMap />
        </div>
      ) : (
        <div className="w-full h-full bg-white">
          <VetNavLegacy />
        </div>
      )}

      {/* Accessibility Notice */}
      <div className="sr-only">
        Veterans Benefits Navigator - {useMap ? '3D Interactive Map Mode' : 'Accessible Legacy Mode'}
        Use Tab to navigate, Space or Enter to activate buttons.
      </div>
    </div>
  );
};

export default VetNavInterface;
