"use client";

import React, { useState } from 'react';
import InteractiveUSMap from '../../components/InteractiveUSMap';

const benefitData = {
  TX: {
    name: 'Texas',
    benefits: [
      {
        title: 'VA Healthcare',
        description: 'Comprehensive medical care at VA facilities',
        eligibility: 'Honorably discharged veterans'
      }
    ]
  },
  CA: {
    name: 'California', 
    benefits: [
      {
        title: 'CalVet Home Loans',
        description: 'Low-interest home loans for veterans',
        eligibility: 'CA resident veterans'
      }
    ]
  },
  NY: {
    name: 'New York',
    benefits: [
      {
        title: 'NY State Veterans Benefits',
        description: 'Property tax exemptions and educational assistance', 
        eligibility: 'NY resident veterans'
      }
    ]
  },
  FL: {
    name: 'Florida',
    benefits: [
      {
        title: 'Homestead Exemption',
        description: 'Property tax exemption for disabled veterans',
        eligibility: 'Veterans with service-connected disabilities'
      }
    ]
  }
};

export default function TestMap() {
  const [selectedState, setSelectedState] = useState(null);
  const [showBenefits, setShowBenefits] = useState(false);

  const handleStateSelect = (stateId) => {
    setSelectedState(stateId);
    setShowBenefits(false);
  };

  const handleViewBenefits = () => {
    setShowBenefits(true);
  };

  const handleApplyNow = () => {
    alert(`Apply Now clicked for ${selectedState}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        VetNav 3D State Map Prototype
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <InteractiveUSMap 
          onStateSelect={handleStateSelect}
          onViewBenefits={handleViewBenefits}
          onApplyNow={handleApplyNow}
        />

        {showBenefits && selectedState && benefitData[selectedState] && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-900">
                    {benefitData[selectedState].name} Veterans Benefits
                  </h2>
                  <button 
                    onClick={() => setShowBenefits(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  {benefitData[selectedState].benefits.map((benefit, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-bold text-blue-800 mb-2">{benefit.title}</h3>
                      <p className="text-gray-700 mb-2">{benefit.description}</p>
                      <p className="text-sm text-green-600"><strong>Eligibility:</strong> {benefit.eligibility}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
