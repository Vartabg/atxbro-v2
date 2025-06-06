"use client";
import { benefitsData } from "../data/benefitsData";
import { useState, useMemo, useEffect } from 'react';

export default function VetNav() {
  const [currentView, setCurrentView] = useState('main');
  const [filters, setFilters] = useState({
    state: '',
    category: '',
    eligibility: ''
  });

  const filteredBenefits = useMemo(() => {
    return benefitsData.filter(benefit => {
      const matchesState = !filters.state || benefit.state === filters.state;
      const matchesCategory = !filters.category || benefit.category === filters.category;
      const matchesEligibility = !filters.eligibility || benefit.eligibility?.includes(filters.eligibility);
      return matchesState && matchesCategory && matchesEligibility;
    });
  }, [filters]);

  const MainMenu = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-200">Veterans Benefits Navigator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => setCurrentView('search')} className="p-4 bg-blue-600 rounded">
          Search Benefits
        </button>
        <button onClick={() => setCurrentView('categories')} className="p-4 bg-green-600 rounded">
          Browse Categories
        </button>
      </div>
    </div>
  );

  const SearchView = () => (
    <div className="space-y-4">
      <button onClick={() => setCurrentView('main')} className="text-blue-400">← Back</button>
      <h2 className="text-xl font-bold">Search Benefits</h2>
      <div className="space-y-2">
        {filteredBenefits.slice(0, 5).map(benefit => (
          <div key={benefit.id} className="p-3 bg-gray-800 rounded">
            <h3 className="font-bold">{benefit.name}</h3>
            <p className="text-sm text-gray-300">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const CategoriesView = () => (
    <div className="space-y-4">
      <button onClick={() => setCurrentView('main')} className="text-blue-400">← Back</button>
      <h2 className="text-xl font-bold">Categories</h2>
      <div className="grid grid-cols-2 gap-2">
        <button className="p-2 bg-blue-500 rounded">Education</button>
        <button className="p-2 bg-green-500 rounded">Healthcare</button>
        <button className="p-2 bg-purple-500 rounded">Disability</button>
        <button className="p-2 bg-orange-500 rounded">Housing</button>
      </div>
    </div>
  );

  const StatesView = () => (
    <div className="space-y-4">
      <button onClick={() => setCurrentView('main')} className="text-blue-400">← Back</button>
      <h2 className="text-xl font-bold">State Benefits</h2>
      <p>State-specific benefits coming soon...</p>
    </div>
  );

  const MythsView = () => (
    <div className="space-y-4">
      <button onClick={() => setCurrentView('main')} className="text-blue-400">← Back</button>
      <h2 className="text-xl font-bold">Common Myths</h2>
      <p>Benefits myths debunked coming soon...</p>
    </div>
  );

  return (
    <div className="p-4 text-white">
      {currentView === 'main' && <MainMenu />}
      {currentView === 'search' && <SearchView />}
      {currentView === 'categories' && <CategoriesView />}
      {currentView === 'states' && <StatesView />}
      {currentView === 'myths' && <MythsView />}
    </div>
  );
}
