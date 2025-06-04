"use client";
import { enhancedBenefitsData } from '../data/enhancedBenefitsData';

export default function MythBusters() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Common Myths Debunked</h2>
      <p className="text-blue-200 text-center mb-8">
        Don't let misinformation prevent you from getting benefits you've earned
      </p>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {enhancedBenefitsData.eligibilityMyths.map((item, index) => (
          <div key={index} className="bg-gradient-to-r from-red-500/20 to-green-500/20 p-6 rounded-lg border-l-4 border-red-400">
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold mr-2">MYTH</span>
                <span className="text-red-200 font-semibold">{item.myth}</span>
              </div>
              <div className="flex items-start">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold mr-2 mt-1">FACT</span>
                <div>
                  <p className="text-green-200 mb-2">{item.fact}</p>
                  <p className="text-blue-300 text-xs italic">Source: {item.source}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-500/20 rounded-lg">
        <p className="text-yellow-200 text-center">
          <strong>Remember:</strong> These myths prevent thousands of veterans from accessing earned benefits. 
          Share accurate information to help fellow veterans.
        </p>
      </div>
    </div>
  );
}
