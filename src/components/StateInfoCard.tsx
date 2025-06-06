import { X, BarChart, Landmark, Globe, CheckCircle } from 'lucide-react';

export function StateInfoCard({ state, stats, onClose, onConfirm }) {
  if (!state || !stats) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-black/90 backdrop-blur-xl text-white rounded-2xl border border-sky-500/30 shadow-2xl z-50 animate-fade-in-up">
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
        <div>
          <Landmark className="w-6 h-6 mx-auto mb-1 text-green-400" />
          <p className="text-2xl font-semibold">{stats.stateCount}</p>
          <p className="text-xs text-gray-400">State-Level</p>
        </div>
        <div>
          <Globe className="w-6 h-6 mx-auto mb-1 text-blue-400" />
          <p className="text-2xl font-semibold">{stats.federalCount}</p>
          <p className="text-xs text-gray-400">Federal</p>
        </div>
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
}
