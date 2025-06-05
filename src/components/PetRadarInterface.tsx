import React from 'react';

interface PetRadarInterfaceProps {
  onClose?: () => void;
}

const PetRadarInterface: React.FC<PetRadarInterfaceProps> = ({ onClose }) => {
  return (
    <div className="p-8 min-h-[60vh] bg-gradient-to-br from-purple-900 to-violet-700 text-white">
      <h1 className="text-4xl font-bold mb-6">Pet Radar</h1>
      <p className="text-xl mb-4">Lost & Found Pets</p>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <p>Coming Soon: Pet finding and adoption platform with location-based search.</p>
      </div>
    </div>
  );
};

export default PetRadarInterface;
