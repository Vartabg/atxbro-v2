import React from 'react';
import InteractiveUSMap from './components/InteractiveUSMap';

export default function TestMap() {
  const handleStateSelect = (stateId: string) => {
    console.log('Selected state:', stateId);
    // Here we could filter benefits by state
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        VetNav 3D State Map Prototype
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <InteractiveUSMap onStateSelect={handleStateSelect} />
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Click on states to select them. Hover to see highlight effects.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Prototype shows TX, CA, FL, NY with sample benefit counts.
          </p>
        </div>
      </div>
    </div>
  );
}
