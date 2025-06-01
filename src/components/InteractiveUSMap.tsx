"use client";
import React, { useState } from 'react';
import USAMap from './usaMap';

interface InteractiveUSMapProps {
  onStateSelect?: (stateId: string) => void;
}

const InteractiveUSMap: React.FC<InteractiveUSMapProps> = ({ onStateSelect }) => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleStateSelection = (stateId: string) => {
    setSelectedState(stateId);
    if (onStateSelect) {
      onStateSelect(stateId);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <USAMap 
        targetDisplayWidth={12}
        showLabels={true}
      />
      {selectedState && (
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          background: 'white', 
          padding: '10px', 
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          Selected: {selectedState}
        </div>
      )}
    </div>
  );
};

export default InteractiveUSMap;
