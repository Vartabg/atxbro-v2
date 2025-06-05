import React from 'react';

interface TariffInterfaceProps {
  onClose?: () => void;
}

const TariffInterface: React.FC<TariffInterfaceProps> = ({ onClose }) => {
  return (
    <div className="p-8 min-h-[60vh] bg-gradient-to-br from-green-900 to-emerald-700 text-white">
      <h1 className="text-4xl font-bold mb-6">Tariff Explorer</h1>
      <p className="text-xl mb-4">Trade Insights & Data Analysis</p>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <p>Coming Soon: Interactive tariff data visualization and trade analysis tools.</p>
      </div>
    </div>
  );
};

export default TariffInterface;
