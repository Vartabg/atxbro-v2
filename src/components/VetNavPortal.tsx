'use client';

import VetNavMap from './VetNavMap';

const VetNavPortal = ({ onNavigateToApp }) => {
  return (
    // This div will now have a bright red border for debugging
    <div className="w-full h-full bg-gray-900" style={{ border: '5px solid red' }}>
      <VetNavMap onSelectState={onNavigateToApp} />
    </div>
  );
};

export default VetNavPortal;
