'use client';
import React, { useState } from 'react';
import { StateInfoCard } from './StateInfoCard';
import { benefitsMapService } from './BenefitsMapService';

const VetNavMap = ({ onSelectState }) => {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);

  const states = [
    { id: 'TX', name: 'Texas', x: 400, y: 350, w: 120, h: 80 },
    { id: 'CA', name: 'California', x: 50, y: 250, w: 80, h: 120 },
    { id: 'FL', name: 'Florida', x: 550, y: 400, w: 80, h: 60 },
    { id: 'NY', name: 'New York', x: 580, y: 150, w: 60, h: 40 }
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Interactive Veterans Benefits Map</h2>
        <p className="mb-4">Click on a state below to explore benefits:</p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => onSelectState && onSelectState(state.name)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              {state.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VetNavMap;
