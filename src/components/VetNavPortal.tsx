'use client';
import VetNavMap from './VetNavMap';

const VetNavPortal = ({ onNavigateToApp }) => {
  return (
    <div className="w-full h-full bg-gray-900">
      <VetNavMap onSelectState={onNavigateToApp} />
    </div>
  );
};

export default VetNavPortal;
