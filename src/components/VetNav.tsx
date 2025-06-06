"use client";
import { useState, useMemo } from 'react';
import { benefitsData, type Benefit } from '../data/benefitsData';

export default function VetNav() {
  const [currentView, setCurrentView] = useState('welcome');
  const [selectedState, setSelectedState] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBenefits = useMemo(() => {
    let filtered = benefitsData;

    if (selectedState) {
      filtered = filtered.filter(benefit =>
        benefit.state === selectedState || benefit.jurisdiction === 'Federal'
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(benefit =>
        benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        benefit.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [selectedState, searchTerm]);

  const WelcomeView = () => (
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Veterans Benefits Finder
      </h1>
      <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium mb-8">
        State & Federal
      </div>
      <p className="text-xl text-blue-100 mb-12">
        Made by a Veteran for Veterans
      </p>

      <button
        onClick={() => setCurrentView('screening')}
        className="group relative w-64 h-64 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-2xl"
      >
        <span className="text-2xl font-medium">Find My Benefits</span>
      </button>
    </div>
  );

  const ScreeningView = () => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Quick Screening</h2>
      <div className="space-y-4">
        <button
          onClick={() => setCurrentView('benefits')}
          className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
        >
          I'm a Veteran - Show My Benefits
        </button>
        <button
          onClick={() => setCurrentView('benefits')}
          className="w-full p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
        >
          I'm a Family Member - Show Benefits
        </button>
        <button
          onClick={() => setCurrentView('welcome')}
          className="w-full p-2 text-blue-200 hover:text-white"
        >
          ← Back
        </button>
      </div>
    </div>
  );

  const BenefitsView = () => (
    <div className="space-y-6">
      <button onClick={() => setCurrentView('welcome')} className="text-blue-400 hover:text-blue-300">
        ← Back
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Your Benefits</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search benefits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20"
        />
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="p-3 rounded-lg bg-white/10 text-white border border-white/20"
        >
          <option value="">All States</option>
          <option value="TX">Texas</option>
          <option value="CA">California</option>
          <option value="FL">Florida</option>
          <option value="NY">New York</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredBenefits.map((benefit) => (
          <div key={benefit.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-left">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-blue-200">{benefit.name}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                benefit.priority === 'High' ? 'bg-red-500' : 
                benefit.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`}>
                {benefit.priority}
              </span>
            </div>
            <p className="text-white/90 mb-3">{benefit.description}</p>
            {benefit.amount && (
              <p className="text-green-200 text-sm mb-2">Amount: {benefit.amount}</p>
            )}
            {benefit.processingTime && (
              <p className="text-blue-200 text-sm mb-4">Processing Time: {benefit.processingTime}</p>
            )}
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                Learn More
              </button>
              <a 
                href={benefit.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
              >
                Apply Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="vetnav" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white">
      <div className="container mx-auto px-4">
        {currentView === 'welcome' && <WelcomeView />}
        {currentView === 'screening' && <ScreeningView />}
        {currentView === 'benefits' && <BenefitsView />}

        <div className="mt-16 bg-red-600 text-white p-4 rounded-lg text-center">
          <strong>Need immediate help?</strong> Veterans Crisis Line: 988, Press 1 | Text: 838255
        </div>
      </div>
    </section>
  );
}
