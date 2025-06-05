'use client';
import React, { useState } from 'react';

// Simplified legacy version for accessibility
const VetNavLegacy: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'screening' | 'results'>('welcome');

  const mythBusters = [
    {
      myth: "I make too much money to be eligible",
      fact: "Income only affects certain benefits like VA Pension. Most VA healthcare and disability compensation don't have income limits."
    },
    {
      myth: "I've been out too long to apply", 
      fact: "Most VA benefits have no time limit. You can apply years after discharge."
    }
  ];

  const benefits = [
    {
      id: "va-healthcare",
      title: "VA Health Care",
      description: "Comprehensive healthcare services including preventive, primary, and specialty care.",
      processing: "30-60 days"
    },
    {
      id: "disability-comp",
      title: "Disability Compensation", 
      description: "Monthly tax-free payment for veterans with service-connected disabilities.",
      processing: "131-141 days"
    },
    {
      id: "education",
      title: "Post-9/11 GI Bill",
      description: "Education benefits for tuition, housing, and books.",
      processing: "30 days"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Veterans Benefits Finder
          </h1>
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium mb-6">
            State & Federal
          </div>
          <p className="text-xl text-blue-100">
            Made by a Veteran for Veterans
          </p>
        </header>

        {step === 'welcome' && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Common Myths Debunked</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {mythBusters.map((myth, index) => (
                  <div key={index} className="bg-red-500/20 p-4 rounded-lg">
                    <div className="font-semibold text-red-200 mb-2">
                      Myth: {myth.myth}
                    </div>
                    <div className="text-green-200">
                      Fact: {myth.fact}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep('screening')}
                className="w-64 h-64 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center hover:scale-105 transition-transform duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-teal-300"
                aria-label="Find My Benefits"
              >
                <span className="text-2xl font-medium">Find My Benefits</span>
              </button>
            </div>
          </div>
        )}

        {step === 'screening' && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Screening</h2>
            <div className="space-y-4">
              <button
                onClick={() => setStep('results')}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                I'm a Veteran - Show My Benefits
              </button>
              <button
                onClick={() => setStep('results')}
                className="w-full p-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                I'm a Family Member - Show Benefits
              </button>
              <button
                onClick={() => setStep('welcome')}
                className="w-full p-2 text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Benefits</h2>
            <div className="grid gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-blue-200">{benefit.title}</h3>
                  <p className="text-white/90 mb-3">{benefit.description}</p>
                  <p className="text-blue-200 text-sm mb-4">Processing Time: {benefit.processing}</p>
                  <div className="flex gap-4">
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Learn More
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <button
                onClick={() => setStep('welcome')}
                className="w-full p-2 text-blue-200 hover:text-white mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ← Start Over
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-red-600 text-white p-4 rounded-lg text-center">
          <strong>Need immediate help?</strong> Veterans Crisis Line: 988, Press 1 | Text: 838255
        </div>
      </div>
    </div>
  );
};

export default VetNavLegacy;
