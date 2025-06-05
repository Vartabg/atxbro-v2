import React from 'react';
import JetsStats from './JetsStats';

interface JetsHomeInterfaceProps {
  onClose?: () => void;
}

const JetsHomeInterface: React.FC<JetsHomeInterfaceProps> = ({ onClose }) => {
  return (
    <div className="min-h-[60vh] bg-gradient-to-br from-green-800 to-green-600">
      <JetsStats />
    </div>
  );
};

export default JetsHomeInterface;
