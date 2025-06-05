"use client";
import { enhancedBenefitsData } from '../../data/enhancedBenefitsData';

export default function ProcessingTimeline() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Expected Processing Times</h2>
      <p className="text-blue-200 text-center mb-8">
        Know what to expect - times vary based on complexity and completeness
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Object.entries(enhancedBenefitsData.processingTimes).map(([benefit, time], index) => (
          <div key={index} className="bg-gradient-to-r from-blue-600/20 to-teal-600/20 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-200 mb-2">{benefit}</h3>
            <p className="text-white text-lg font-bold">{time}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Common Rejection Reasons */}
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/30">
          <h3 className="text-xl font-bold text-red-300 mb-4">Common Rejection Reasons</h3>
          <ul className="space-y-3">
            {enhancedBenefitsData.commonRejectionReasons.map((reason, index) => (
              <li key={index} className="flex items-start text-red-200">
                <svg className="w-4 h-4 mr-2 mt-1 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Faster Processing Tips */}
        <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/30">
          <h3 className="text-xl font-bold text-green-300 mb-4">Tips for Faster Processing</h3>
          <ul className="space-y-3">
            {enhancedBenefitsData.fasterProcessingTips.map((tip, index) => (
              <li key={index} className="flex items-start text-green-200">
                <svg className="w-4 h-4 mr-2 mt-1 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-blue-500/20 p-4 rounded-lg">
        <p className="text-blue-200 text-center">
          <strong>Pro Tip:</strong> Submit a Fully Developed Claim (FDC) with all evidence upfront. 
          This can significantly reduce processing time compared to standard claims.
        </p>
      </div>
    </div>
  );
}
