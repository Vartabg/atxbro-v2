"use client";
import { useState } from 'react';
import VetNav from '../components/VetNav';
import JetsStats from '../components/JetsStats';

export default function Home() {
  const [activeProgram, setActiveProgram] = useState('home');

  const programs = [
    {
      id: 'vetnav',
      title: 'VetNav',
      subtitle: 'Veterans Benefits Guide',
      description: 'Find and apply for federal and state benefits',
      color: 'from-blue-600 to-blue-800',
      icon: '🎖️'
    },
    {
      id: 'jets-stats',
      title: 'Jets Stats',
      subtitle: 'NY Jets Analytics Hub',
      description: 'Complete franchise statistics and analysis',
      color: 'from-green-600 to-green-800',
      icon: '🏈'
    },
    {
      id: 'pet-radar',
      title: 'Pet Adoption Radar',
      subtitle: 'Find Your Perfect Pet',
      description: 'Search adoptable pets in your area',
      color: 'from-yellow-600 to-yellow-800',
      icon: '🐕'
    },
    {
      id: 'tariff-explorer',
      title: 'Tariff Explorer',
      subtitle: 'Economic Trade Analysis',
      description: 'Analyze historical trade policies and impacts',
      color: 'from-purple-600 to-purple-800',
      icon: '📊'
    }
  ];

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">ATX Bro</h1>
          <p className="text-2xl text-blue-200 mb-12">
            Multi-Program Platform Suite
          </p>
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-3 rounded-full text-lg font-medium">
            4 Powerful Applications
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {programs.map((program) => (
            <div
              key={program.id}
              onClick={() => setActiveProgram(program.id)}
              className={`bg-gradient-to-br ${program.color} p-8 rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="text-6xl mb-4 text-center">{program.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{program.title}</h3>
              <p className="text-lg text-white/80 mb-4">{program.subtitle}</p>
              <p className="text-sm text-white/70 mb-6">{program.description}</p>
              <button className="w-full bg-white/20 backdrop-blur-md py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
                Launch {program.title}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => setActiveProgram('gesture-adventure')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform"
          >
            🎮 Try Gesture Adventure Mode
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgram = () => {
    switch (activeProgram) {
      case 'vetnav':
        return (
          <div className="min-h-screen">
            <div className="fixed top-4 left-4 z-50">
              <button
                onClick={() => setActiveProgram('home')}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium"
              >
                ← Back to Home
              </button>
            </div>
            <VetNav />
          </div>
        );
      
      case 'jets-stats':
        return (
          <div className="min-h-screen">
            <div className="fixed top-4 left-4 z-50">
              <button
                onClick={() => setActiveProgram('home')}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium"
              >
                ← Back to Home
              </button>
            </div>
            <JetsStats />
          </div>
        );

      case 'pet-radar':
        return (
          <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-800 to-orange-700 text-white">
            <div className="fixed top-4 left-4 z-50">
              <button
                onClick={() => setActiveProgram('home')}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-white font-medium"
              >
                ← Back to Home
              </button>
            </div>
            <div className="container mx-auto px-4 py-20">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">Pet Adoption Radar</h1>
                <p className="text-xl text-yellow-200 mb-12">Find Your Perfect Companion</p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
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
          </div>
        );

      case 'tariff-explorer':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-700 text-white">
            <div className="fixed top-4 left-4 z-50">
              <button
                onClick={() => setActiveProgram('home')}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-medium"
              >
                ← Back to Home
              </button>
            </div>
            <div className="container mx-auto px-4 py-20">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-6">Tariff Explorer</h1>
                <p className="text-xl text-purple-200 mb-12">Economic Trade Analysis Dashboard</p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
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
          </div>
        );

      case 'gesture-adventure':
        // Import and use the gesture adventure component here
        return (
          <div className="min-h-screen">
            <div className="fixed top-4 left-4 z-50">
              <button
                onClick={() => setActiveProgram('home')}
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg text-white font-medium"
              >
                ← Back to Home
              </button>
            </div>
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-900 to-purple-900 text-white">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Gesture Adventure Mode</h1>
                <p className="text-xl">Coming Soon - Interactive Gesture Playground</p>
              </div>
            </div>
          </div>
        );

      default:
        return renderHome();
    }
  };

  return renderProgram();
}
