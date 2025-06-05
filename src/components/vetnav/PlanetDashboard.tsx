"use client";
import { useState } from 'react';

interface DashboardFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface PlanetDashboardProps {
  planetName: string;
  features: DashboardFeature[];
  onFeatureSelect: (featureId: string) => void;
  onBackToPlanet: () => void;
}

export function PlanetDashboard({ planetName, features, onFeatureSelect, onBackToPlanet }: PlanetDashboardProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{planetName}</h1>
          <p className="text-blue-200">Select your mission</p>
        </div>
        <button
          onClick={onBackToPlanet}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          ← Back to Orbit
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => onFeatureSelect(feature.id)}
            className={`bg-black bg-opacity-40 backdrop-blur-md p-6 rounded-xl border-2 border-transparent hover:border-blue-400 cursor-pointer transition-all duration-300 hover:scale-105 ${feature.color}`}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-200 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
