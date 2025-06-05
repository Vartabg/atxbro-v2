"use client";
import { useState } from 'react';
import { Html } from '@react-three/drei';

interface PlanetInfo {
  name: string;
  description: string;
  capabilities: string[];
  color: string;
}

interface PlanetSelectionInterfaceProps {
  planetInfo: PlanetInfo;
  onEnterPlanet: () => void;
  onCancel: () => void;
}

export function PlanetSelectionInterface({ planetInfo, onEnterPlanet, onCancel }: PlanetSelectionInterfaceProps) {
  return (
    <Html position={[0, 0, 0]} center>
      <div className="bg-black bg-opacity-90 text-white p-6 rounded-lg max-w-md border-2 border-blue-500">
        {/* Planet Header */}
        <div className="text-center mb-4">
          <div className={`w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br ${planetInfo.color}`}></div>
          <h2 className="text-2xl font-bold text-blue-300">{planetInfo.name}</h2>
          <p className="text-gray-300 text-sm mt-1">{planetInfo.description}</p>
        </div>

        {/* Capabilities */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-200">Available Systems:</h3>
          <div className="space-y-2">
            {planetInfo.capabilities.map((capability, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">{capability}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onEnterPlanet}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors font-semibold"
          >
            Enter Planet
          </button>
        </div>
      </div>
    </Html>
  );
}
