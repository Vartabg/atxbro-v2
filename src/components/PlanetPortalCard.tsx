import { useState } from 'react';
import { X, Map, Zap, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface PlanetPortalCardProps {
  planet: {
    id: string;
    name: string;
    app: string;
    description: string;
    features: string[];
    atmosphereColor: string;
  };
  onClose: () => void;
  onLaunchApp: (appType: string) => void;
  onShowMap: () => void;
}

export function PlanetPortalCard({ planet, onClose, onLaunchApp, onShowMap }: PlanetPortalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-black/90 backdrop-blur-xl text-white rounded-xl border border-blue-500/30 shadow-2xl z-50 transition-all duration-300">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: planet.atmosphereColor }}
          />
          <div>
            <h3 className="text-lg font-bold text-blue-300">{planet.name}</h3>
            <p className="text-xs text-gray-400">Planet Locked</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 border-b border-gray-700/50">
          <p className="text-gray-300 text-sm mb-3">{planet.description}</p>
          <div className="space-y-1">
            {planet.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <span className="text-gray-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons - Always Visible */}
      <div className="p-4 space-y-2">
        <button
          onClick={onShowMap}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium"
        >
          <Map className="w-4 h-4" />
          <span>Interactive Map</span>
        </button>
        
        <button
          onClick={() => onLaunchApp(planet.app)}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg transition-colors text-sm font-medium"
        >
          <Zap className="w-4 h-4" />
          <span>Enter Portal</span>
        </button>
      </div>
    </div>
  );
}
