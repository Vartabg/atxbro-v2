interface StateInfoCardProps {
  state: any;
  stats: any;
  onClose: () => void;
  onConfirm: (stateName: string) => void;
}

export const StateInfoCard = ({ state, stats, onClose, onConfirm }: StateInfoCardProps) => {
  if (!state || !stats) return null;

  return (
    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-lg p-4 min-w-64 shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-800">{state.properties.name}</h3>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">×</button>
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Total Benefits:</strong> {stats.totalBenefits}</p>
        <p><strong>Avg Processing:</strong> {stats.averageProcessingTime}</p>
      </div>
      <button 
        onClick={() => onConfirm(state.properties.name)}
        className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Explore Benefits
      </button>
    </div>
  );
};
