"use client";
import { useState } from 'react';

export default function JetsStats() {
  const [activeCategory, setActiveCategory] = useState('passing');
  const [viewMode, setViewMode] = useState('season');

  const statsData = {
    passing: {
      season: [
        { player: "Zach Wilson", year: "2022", yards: 1688, tds: 6, ints: 7, attempts: 251, completions: 149 },
        { player: "Mike White", year: "2021", yards: 953, tds: 3, ints: 8, attempts: 135, completions: 82 },
        { player: "Sam Darnold", year: "2019", yards: 3024, tds: 19, ints: 13, attempts: 441, completions: 273 }
      ],
      career: [
        { player: "Joe Namath", yards: 27057, tds: 170, ints: 215, attempts: 3762, completions: 1886 },
        { player: "Ken O'Brien", yards: 25094, tds: 124, ints: 95, attempts: 3602, completions: 2110 },
        { player: "Ryan Fitzpatrick", yards: 10731, tds: 69, ints: 58, attempts: 1563, completions: 979 }
      ]
    },
    rushing: {
      season: [
        { player: "Breece Hall", year: "2022", yards: 463, tds: 4, attempts: 80, avg: 5.8 },
        { player: "Michael Carter", year: "2021", yards: 639, tds: 4, attempts: 147, avg: 4.3 },
        { player: "Le'Veon Bell", year: "2019", yards: 789, tds: 3, attempts: 245, avg: 3.2 }
      ],
      career: [
        { player: "Curtis Martin", yards: 10302, tds: 58, attempts: 2370, avg: 4.3 },
        { player: "Freeman McNeil", yards: 8074, tds: 38, attempts: 1798, avg: 4.5 },
        { player: "John Riggins", yards: 2875, tds: 25, attempts: 748, avg: 3.8 }
      ]
    },
    receiving: {
      season: [
        { player: "Garrett Wilson", year: "2022", yards: 1103, tds: 4, receptions: 83, avg: 13.3 },
        { player: "Corey Davis", year: "2021", yards: 492, tds: 4, receptions: 34, avg: 14.5 },
        { player: "Robby Anderson", year: "2019", yards: 779, tds: 5, receptions: 52, avg: 15.0 }
      ],
      career: [
        { player: "Don Maynard", yards: 11733, tds: 88, receptions: 627, avg: 18.7 },
        { player: "Wayne Chrebet", yards: 7365, tds: 41, receptions: 580, avg: 12.7 },
        { player: "Al Toon", yards: 6605, tds: 30, receptions: 517, avg: 12.8 }
      ]
    }
  };

  const categories = [
    { id: 'passing', name: 'Passing', icon: '🏈' },
    { id: 'rushing', name: 'Rushing', icon: '🏃' },
    { id: 'receiving', name: 'Receiving', icon: '🙌' }
  ];

  const renderStatsTable = () => {
    const data = statsData[activeCategory][viewMode];
    
    if (activeCategory === 'passing') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full bg-white/10 backdrop-blur-md rounded-lg">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-4 text-left">Player</th>
                {viewMode === 'season' && <th className="p-4 text-left">Year</th>}
                <th className="p-4 text-left">Yards</th>
                <th className="p-4 text-left">TDs</th>
                <th className="p-4 text-left">INTs</th>
                <th className="p-4 text-left">Comp</th>
                <th className="p-4 text-left">Att</th>
                <th className="p-4 text-left">Comp%</th>
              </tr>
            </thead>
            <tbody>
              {data.map((stat, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 font-semibold text-green-300">{stat.player}</td>
                  {viewMode === 'season' && <td className="p-4">{stat.year}</td>}
                  <td className="p-4">{stat.yards.toLocaleString()}</td>
                  <td className="p-4">{stat.tds}</td>
                  <td className="p-4">{stat.ints}</td>
                  <td className="p-4">{stat.completions}</td>
                  <td className="p-4">{stat.attempts}</td>
                  <td className="p-4">{((stat.completions / stat.attempts) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeCategory === 'rushing') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full bg-white/10 backdrop-blur-md rounded-lg">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-4 text-left">Player</th>
                {viewMode === 'season' && <th className="p-4 text-left">Year</th>}
                <th className="p-4 text-left">Yards</th>
                <th className="p-4 text-left">TDs</th>
                <th className="p-4 text-left">Attempts</th>
                <th className="p-4 text-left">Avg</th>
              </tr>
            </thead>
            <tbody>
              {data.map((stat, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 font-semibold text-green-300">{stat.player}</td>
                  {viewMode === 'season' && <td className="p-4">{stat.year}</td>}
                  <td className="p-4">{stat.yards.toLocaleString()}</td>
                  <td className="p-4">{stat.tds}</td>
                  <td className="p-4">{stat.attempts}</td>
                  <td className="p-4">{stat.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeCategory === 'receiving') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full bg-white/10 backdrop-blur-md rounded-lg">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-4 text-left">Player</th>
                {viewMode === 'season' && <th className="p-4 text-left">Year</th>}
                <th className="p-4 text-left">Yards</th>
                <th className="p-4 text-left">TDs</th>
                <th className="p-4 text-left">Rec</th>
                <th className="p-4 text-left">Avg</th>
              </tr>
            </thead>
            <tbody>
              {data.map((stat, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="p-4 font-semibold text-green-300">{stat.player}</td>
                  {viewMode === 'season' && <td className="p-4">{stat.year}</td>}
                  <td className="p-4">{stat.yards.toLocaleString()}</td>
                  <td className="p-4">{stat.tds}</td>
                  <td className="p-4">{stat.receptions}</td>
                  <td className="p-4">{stat.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            New York Jets Stats
          </h1>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-medium mb-8">
            Franchise History
          </div>
          <p className="text-xl text-green-100 mb-12">
            Complete statistical analysis and historical data
          </p>

          {/* Category Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'text-green-200 hover:bg-white/10'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 flex gap-2">
              <button
                onClick={() => setViewMode('season')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === 'season'
                    ? 'bg-green-600 text-white'
                    : 'text-green-200 hover:bg-white/10'
                }`}
              >
                Season Leaders
              </button>
              <button
                onClick={() => setViewMode('career')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  viewMode === 'career'
                    ? 'bg-green-600 text-white'
                    : 'text-green-200 hover:bg-white/10'
                }`}
              >
                Career Leaders
              </button>
            </div>
          </div>

          {/* Stats Table */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 capitalize">
              {activeCategory} - {viewMode === 'season' ? 'Season' : 'Career'} Leaders
            </h2>
            {renderStatsTable()}
          </div>

          <div className="mt-12 text-center">
            <p className="text-green-200 text-sm">
              Stats compiled from official NFL records • Updated for 2022 season
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
