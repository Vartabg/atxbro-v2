"use client";
﻿"use client";
import { useState } from 'react';
import { enhancedBenefitsData } from '../data/enhancedBenefitsData';

export default function BarriersEducation() {
  const [activeBarrier, setActiveBarrier] = useState(0);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Overcoming Common Barriers</h2>
      <p className="text-blue-200 text-center mb-8">
        Understanding challenges helps you navigate the system more effectively
      </p>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Barrier Navigation */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {enhancedBenefitsData.commonBarriers.map((barrier, index) => (
              <button
                key={index}
                onClick={() => setActiveBarrier(index)}
                className={w-full text-left p-4 rounded-lg transition-all }
              >
                <h3 className="font-semibold">{barrier.barrier}</h3>
                <p className="text-sm opacity-80 mt-1">{barrier.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Barrier Details */}
        <div className="lg:col-span-2">
          <div className="bg-blue-600/20 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-blue-200 mb-4">
              {enhancedBenefitsData.commonBarriers[activeBarrier].barrier}
            </h3>
            <p className="text-white mb-6">
              {enhancedBenefitsData.commonBarriers[activeBarrier].description}
            </p>
            
            <h4 className="font-semibold text-green-300 mb-3">How VetNav Helps:</h4>
            <ul className="space-y-2">
              {enhancedBenefitsData.commonBarriers[activeBarrier].solutions.map((solution, index) => (
                <li key={index} className="flex items-center text-green-200">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {solution}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-orange-500/20 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-200 mb-2">Need Personal Help?</h4>
          <p className="text-orange-100 text-sm">
            Contact an accredited Veterans Service Organization (VSO) for free, personalized assistance with your claims.
          </p>
        </div>
        <div className="bg-purple-500/20 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-200 mb-2">Still Having Issues?</h4>
          <p className="text-purple-100 text-sm">
            Many barriers are systemic. VetNav provides workarounds, but advocacy for system improvements continues.
          </p>
        </div>
      </div>
    </div>
  );
}
