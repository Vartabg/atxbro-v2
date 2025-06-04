'use client';

import React from 'react';
import { X, ExternalLink, Filter, Award, Heart, GraduationCap, Home, Briefcase, Building } from 'lucide-react';
import { Benefit, BenefitCategory } from '../types/benefits'; // Added BenefitCategory

interface BenefitsOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  benefits: Benefit[];
  loading: boolean;
  selectedState: string | null;
  onCategoryFilter: (category: string) => void;
  activeFilter: string | null;
  onClearFilter: () => void;
}

const categoryIcons: Record<BenefitCategory, React.ElementType> = { // Typed with BenefitCategory
  disability: Award,
  healthcare: Heart,
  education: GraduationCap,
  housing: Home,
  employment: Briefcase,
  business: Building,
  family: Heart, // Assuming family can also use Heart or a different icon if preferred
  burial: Award  // Assuming burial can also use Award or a different icon if preferred
};

const categoryColors: Record<BenefitCategory, string> = { // Typed with BenefitCategory
  disability: 'bg-red-100 text-red-800 border-red-200',
  healthcare: 'bg-blue-100 text-blue-800 border-blue-200',
  education: 'bg-green-100 text-green-800 border-green-200',
  housing: 'bg-purple-100 text-purple-800 border-purple-200',
  employment: 'bg-orange-100 text-orange-800 border-orange-200',
  business: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  family: 'bg-pink-100 text-pink-800 border-pink-200',
  burial: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default function BenefitsOverlay({
  isVisible,
  onClose,
  benefits,
  loading,
  selectedState,
  onCategoryFilter,
  activeFilter,
  onClearFilter
}: BenefitsOverlayProps) {
  if (!isVisible) return null;

  const categories = Array.from(new Set(benefits.map(b => b.category))) as BenefitCategory[]; // Type assertion

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">
              Veterans Benefits
              {selectedState && (
                <span className="ml-2 text-blue-100">• {selectedState}</span>
              )}
            </h2>
            <p className="text-blue-100 mt-1">
              Federal and state benefits available to you
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onClearFilter}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                !activeFilter 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-1" />
              All Benefits
            </button>
            {categories.map(category => {
              const Icon = categoryIcons[category];
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => onCategoryFilter(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-1" />
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Benefits List */}
        <div className="overflow-y-auto flex-grow p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading benefits...</span>
            </div>
          ) : benefits.length === 0 ? (
            <div className="text-center py-12 text-gray-500 h-full flex flex-col justify-center items-center">
              <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No benefits found for the selected criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {benefits.map(benefit => {
                const Icon = categoryIcons[benefit.category];
                return (
                  <div
                    key={benefit.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          <h3 className="font-semibold text-lg text-gray-900">
                            {benefit.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full border ${categoryColors[benefit.category]}`}>
                            {benefit.category}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            benefit.level === 'federal' 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            {benefit.level}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3 text-sm">{benefit.description}</p>
                        
                        {benefit.estimatedValue && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                              💰 {benefit.estimatedValue}
                            </span>
                          </div>
                        )}

                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">Key Requirements:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {benefit.eligibilityRequirements.slice(0, 3).map((req, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2 flex-shrink-0">✓</span>
                                <span>{req}</span>
                              </li>
                            ))}
                            {benefit.eligibilityRequirements.length > 3 && (
                              <li className="text-gray-500 text-xs">
                                +{benefit.eligibilityRequirements.length - 3} more requirements
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                      <div className="flex flex-wrap gap-1">
                        {benefit.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <a
                        href={benefit.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-600">
          <p>
            Always verify eligibility and requirements on official government websites. 
            This information is for guidance only.
          </p>
        </div>
      </div>
    </div>
  );
} 