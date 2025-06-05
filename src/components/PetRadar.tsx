"use client";

import React, { useState } from 'react';
import { PawPrint, MapPin, Heart, Search, Filter } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  size: string;
  location: string;
  description: string;
  image: string;
  distance: number;
}

export default function PetRadar() {
  const [zipCode, setZipCode] = useState('');
  const [searchRadius, setSearchRadius] = useState(25);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    size: 'all',
    age: 'all'
  });

  const mockPets: Pet[] = [
    {
      id: '1',
      name: 'Luna',
      breed: 'Golden Retriever',
      age: '2 years',
      size: 'Large',
      location: 'Austin Animal Center',
      description: 'Friendly and energetic dog looking for an active family.',
      image: '/api/placeholder/300/200',
      distance: 2.3
    },
    {
      id: '2',
      name: 'Whiskers',
      breed: 'Domestic Shorthair',
      age: '1 year',
      size: 'Medium',
      location: 'SPCA of Central Texas',
      description: 'Playful kitten who loves to cuddle and chase toys.',
      image: '/api/placeholder/300/200',
      distance: 5.7
    },
    {
      id: '3',
      name: 'Max',
      breed: 'Labrador Mix',
      age: '3 years',
      size: 'Large',
      location: 'Austin Humane Society',
      description: 'Gentle giant who gets along well with kids and other pets.',
      image: '/api/placeholder/300/200',
      distance: 8.1
    }
  ];

  const handleSearch = async () => {
    if (!zipCode) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPets(mockPets);
      setLoading(false);
    }, 1500);
  };

  const filteredPets = pets.filter(pet => {
    if (filters.type !== 'all' && !pet.breed.toLowerCase().includes(filters.type)) return false;
    if (filters.size !== 'all' && pet.size.toLowerCase() !== filters.size) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <PawPrint size={64} className="mx-auto mb-4 text-yellow-600"/>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pet Adoption Radar</h1>
          <p className="text-gray-600 text-lg">Find your perfect companion nearby</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Search Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1"/>
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter ZIP code"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Radius: {searchRadius} miles
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  disabled={!zipCode || loading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2"/>
                      Search Pets
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Filters */}
            {pets.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-4">
                  <Filter className="w-4 h-4 text-gray-600"/>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="dog">Dogs</option>
                    <option value="cat">Cats</option>
                  </select>
                  <select
                    value={filters.size}
                    onChange={(e) => setFilters({...filters, size: e.target.value})}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All Sizes</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {filteredPets.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Found {filteredPets.length} pets near {zipCode}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <div key={pet.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <PawPrint size={48}/>
                      </div>
                      <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                        {pet.distance} mi
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{pet.name}</h3>
                      <p className="text-gray-600 mb-1">{pet.breed} • {pet.age} • {pet.size}</p>
                      <p className="text-sm text-gray-500 mb-3 flex items-center">
                        <MapPin className="w-3 h-3 mr-1"/>
                        {pet.location}
                      </p>
                      <p className="text-gray-700 text-sm mb-4">{pet.description}</p>
                      <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center">
                        <Heart className="w-4 h-4 mr-2"/>
                        Contact Shelter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {pets.length === 0 && !loading && (
            <div className="text-center py-12">
              <PawPrint size={96} className="mx-auto text-gray-300 mb-4"/>
              <h3 className="text-xl font-medium text-gray-500 mb-2">No search yet</h3>
              <p className="text-gray-400">Enter your ZIP code to find adoptable pets in your area</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
