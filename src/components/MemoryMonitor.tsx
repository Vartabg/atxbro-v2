import { useEffect, useState } from 'react';

export function MemoryMonitor() {
  const [memory, setMemory] = useState<any>(null);
  
  useEffect(() => {
    const updateMemory = () => {
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        setMemory({
          used: Math.round(mem.usedJSHeapSize / 1048576), // MB
          total: Math.round(mem.totalJSHeapSize / 1048576), // MB
          limit: Math.round(mem.jsHeapSizeLimit / 1048576) // MB
        });
      }
    };
    
    updateMemory();
    const interval = setInterval(updateMemory, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!memory) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-black/70 text-white p-3 rounded-lg text-xs z-50 font-mono">
      <div>Memory: {memory.used}MB / {memory.total}MB</div>
      <div>Limit: {memory.limit}MB</div>
      <div className={memory.used > memory.limit * 0.8 ? 'text-red-400' : 'text-green-400'}>
        Usage: {Math.round((memory.used / memory.limit) * 100)}%
      </div>
    </div>
  );
}
