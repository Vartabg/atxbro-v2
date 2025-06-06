import React, { forwardRef } from 'react';
import { X, BarChart, Landmark, Globe, CheckCircle } from 'lucide-react';

export const StateInfoCard = forwardRef(({ state, stats, onClose, onConfirm }, ref) => {
  if (!state || !stats) return null;

  return (
    // Added inset-x-4 and removed rounded-b-none for mobile floating effect
    <div ref={ref} className="fixed bottom-4 inset-x-4 sm:left-auto sm:right-4 sm:w-96 bg-black/90 backdrop-blur-xl text-white rounded-2xl border border-sky-500/30 shadow-2xl z-50 animate-fade-in-up">
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <div>
          <h3 className="text-xl font-bold text-sky-300">{state.properties.name}</h3>
          <p className="text-sm text-gray-400">State Data Overview</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <BarChart className="w-6 h-6 mx-auto mb-1 text-sky-400" />
          <p className="text-2xl font-semibold">{stats.count}</p>
          <p className="text-xs text-gray-400">Total Benefits</p>
        </div>
        {/* Other stats divs removed for brevity as they are always 0 in the current data */}
      </div>
      <div className="p-4 border-t border-gray-700/50">
        <button
          onClick={() => onConfirm(state.properties.name)}
          className="w-full flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
        >
          <CheckCircle className="w-5 h-5" />
          <span>View State Details</span>
        </button>
      </div>
    </div>
  );
});

StateInfoCard.displayName = 'StateInfoCard';
