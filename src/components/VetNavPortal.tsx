"use client";
import { useState } from 'react';
import { ShieldCheck, MapPin, FileText, Users, ArrowRight, Star } from 'lucide-react';

interface VetNavPortalProps {
  isActive: boolean;
  onClose: () => void;
}

export function VetNavPortal({ isActive, onClose }: VetNavPortalProps) {
  const [currentView, setCurrentView] = useState('overview');

  if (!isActive) return null;

  const benefitCategories = [
    {
      id: 'healthcare',
      title: 'VA Healthcare',
      description: 'Comprehensive medical services and mental health support',
      urgency: 'high',
      processingTime: '30-60 days'
    },
    {
      id: 'disability',
      title: 'Disability Compensation',
      description: 'Monthly tax-free payments for service-connected conditions',
      urgency: 'critical',
      processingTime: '131-141 days'
    },
    {
      id: 'education',
      title: 'Education Benefits',
      description: 'GI Bill, scholarships, and vocational training programs',
      urgency: 'medium',
      processingTime: '30 days'
    },
    {
      id: 'housing',
      title: 'Housing Assistance',
      description: 'Home loans, adaptive housing grants, and homeless prevention',
      urgency: 'high',
      processingTime: '15-45 days'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-500/30 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">VetNav Command Center</h1>
                <p className="text-blue-200">Your mission-critical benefits navigator</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <span className="sr-only">Close</span>
              ✕
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex border-b border-blue-500/30">
          {['overview', 'benefits', 'locations', 'resources'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                currentView === view
                  ? 'text-white border-b-2 border-blue-400 bg-blue-800/50'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/30'
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {currentView === 'overview' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white mb-2">Welcome to VetNav</h2>
                <p className="text-blue-200">Navigate your benefits with military precision</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {benefitCategories.map((category) => (
                  <div key={category.id} className="bg-blue-800/30 p-4 rounded-lg border border-blue-500/30">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white">{category.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        category.urgency === 'critical' ? 'bg-red-600 text-white' :
                        category.urgency === 'high' ? 'bg-orange-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}>
                        {category.urgency}
                      </span>
                    </div>
                    <p className="text-blue-200 text-sm mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-300">⏱ {category.processingTime}</span>
                      <button className="text-blue-400 hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-red-600/20 border border-red-500/30 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-red-400">🚨</span>
                  <h3 className="font-semibold text-white">Crisis Support</h3>
                </div>
                <p className="text-red-200 text-sm">
                  Veterans Crisis Line: <strong>988, Press 1</strong> | Text: <strong>838255</strong>
                </p>
              </div>
            </div>
          )}

          {currentView === 'benefits' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Benefits Scanner</h2>
              <div className="bg-blue-800/30 p-6 rounded-lg">
                <p className="text-blue-200 mb-4">Quick eligibility assessment based on your service profile</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-700/30 rounded">
                    <span className="text-white">VA Healthcare Eligibility</span>
                    <span className="text-green-400">✓ Eligible</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-700/30 rounded">
                    <span className="text-white">Education Benefits (GI Bill)</span>
                    <span className="text-yellow-400">⚠ Pending Verification</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-700/30 rounded">
                    <span className="text-white">Home Loan Guarantee</span>
                    <span className="text-green-400">✓ Available</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'locations' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Nearby Resources</h2>
              <div className="grid gap-4">
                <div className="bg-blue-800/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">Dallas VA Medical Center</h3>
                      <p className="text-blue-200 text-sm">4500 S Lancaster Rd, Dallas, TX 75216</p>
                      <p className="text-blue-300 text-xs">2.3 miles away • Open until 4:30 PM</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-800/30 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">Vet Center Dallas</h3>
                      <p className="text-blue-200 text-sm">5232 Forest Ln, Dallas, TX 75244</p>
                      <p className="text-blue-300 text-xs">4.1 miles away • Counseling services</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'resources' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Quick Resources</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-800/30 p-4 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Forms & Applications</h3>
                  <p className="text-blue-200 text-sm">Download and submit VA forms</p>
                </div>
                <div className="bg-blue-800/30 p-4 rounded-lg">
                  <Star className="w-6 h-6 text-blue-400 mb-2" />
                  <h3 className="font-semibold text-white mb-1">Claim Status</h3>
                  <p className="text-blue-200 text-sm">Track your benefit applications</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue-500/30 bg-blue-900/50">
          <div className="text-center">
            <p className="text-blue-200 text-sm">
              Made by a Veteran for Veterans • Secure • Confidential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
