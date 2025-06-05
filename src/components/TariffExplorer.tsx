"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Globe, DollarSign, Package } from 'lucide-react';

interface TariffData {
  country: string;
  product: string;
  rate: number;
  change: number;
  volume: number;
  revenue: number;
}

interface ChartData {
  year: number;
  rate: number;
  volume: number;
}

export default function TariffExplorer() {
  const [selectedCountry, setSelectedCountry] = useState('China');
  const [selectedProduct, setSelectedProduct] = useState('Steel');
  const [timeRange, setTimeRange] = useState('1Y');
  const [loading, setLoading] = useState(false);

  const mockTariffData: TariffData[] = [
    { country: 'China', product: 'Steel', rate: 25.0, change: 5.2, volume: 15.4, revenue: 2.1 },
    { country: 'China', product: 'Electronics', rate: 15.5, change: -2.1, volume: 42.8, revenue: 8.7 },
    { country: 'Mexico', product: 'Automotive', rate: 0.0, change: 0.0, volume: 28.3, revenue: 12.4 },
    { country: 'Canada', product: 'Lumber', rate: 8.2, change: 1.8, volume: 18.7, revenue: 3.2 },
    { country: 'EU', product: 'Machinery', rate: 12.8, change: -0.5, volume: 32.1, revenue: 15.6 }
  ];

  const mockChartData: ChartData[] = [
    { year: 2020, rate: 18.5, volume: 245.8 },
    { year: 2021, rate: 22.1, volume: 198.4 },
    { year: 2022, rate: 24.8, volume: 167.2 },
    { year: 2023, rate: 25.0, volume: 154.3 },
    { year: 2024, rate: 25.0, volume: 142.7 }
  ];

  const countries = ['China', 'Mexico', 'Canada', 'EU', 'Japan', 'South Korea'];
  const products = ['Steel', 'Electronics', 'Automotive', 'Lumber', 'Machinery', 'Textiles'];

  const currentData = mockTariffData.find(
    item => item.country === selectedCountry && item.product === selectedProduct
  ) || mockTariffData[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <TrendingUp size={64} className="mx-auto mb-4 text-purple-600"/>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Trade Policy Explorer</h1>
          <p className="text-gray-600 text-lg">Interactive economic analysis and tariff insights</p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="inline w-4 h-4 mr-1"/>
                  Country/Region
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="inline w-4 h-4 mr-1"/>
                  Product Category
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  {products.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range
                </label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option value="1M">1 Month</option>
                  <option value="3M">3 Months</option>
                  <option value="1Y">1 Year</option>
                  <option value="5Y">5 Years</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setLoading(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <BarChart3 className="w-4 h-4 mr-2"/>
                  Analyze
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Current Tariff Rate</h3>
                <DollarSign className="w-4 h-4 text-purple-600"/>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800">{currentData.rate}%</span>
                <span className={`text-sm font-medium flex items-center ${
                  currentData.change >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {currentData.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1"/> : <TrendingDown className="w-3 h-3 mr-1"/>}
                  {Math.abs(currentData.change)}%
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Trade Volume</h3>
                <Package className="w-4 h-4 text-blue-600"/>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800">${currentData.volume}B</span>
                <span className="text-sm text-gray-500">annual</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Tariff Revenue</h3>
                <TrendingUp className="w-4 h-4 text-green-600"/>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800">${currentData.revenue}B</span>
                <span className="text-sm text-gray-500">collected</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Economic Impact</h3>
                <BarChart3 className="w-4 h-4 text-orange-600"/>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gray-800">-{(currentData.volume * 0.08).toFixed(1)}%</span>
                <span className="text-sm text-gray-500">trade flow</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tariff Rate Trend */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Tariff Rate Trend - {selectedCountry} {selectedProduct}
              </h3>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Chart background */}
                  <defs>
                    <linearGradient id="tariffGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  {[0, 50, 100, 150, 200].map(y => (
                    <line key={y} x1="50" y1={y} x2="350" y2={y} stroke="#E5E7EB" strokeWidth="1"/>
                  ))}
                  {[50, 125, 200, 275, 350].map(x => (
                    <line key={x} x1={x} y1="20" x2={x} y2="180" stroke="#E5E7EB" strokeWidth="1"/>
                  ))}
                  
                  {/* Chart line */}
                  <polyline
                    fill="url(#tariffGradient)"
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    points={mockChartData.map((d, i) => `${50 + (i * 75)},${180 - (d.rate * 5)}`).join(' ')}
                  />
                  
                  {/* Data points */}
                  {mockChartData.map((d, i) => (
                    <circle
                      key={i}
                      cx={50 + (i * 75)}
                      cy={180 - (d.rate * 5)}
                      r="4"
                      fill="#8B5CF6"
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  <text x="40" y="185" textAnchor="end" fontSize="12" fill="#6B7280">0%</text>
                  <text x="40" y="135" textAnchor="end" fontSize="12" fill="#6B7280">10%</text>
                  <text x="40" y="85" textAnchor="end" fontSize="12" fill="#6B7280">20%</text>
                  <text x="40" y="35" textAnchor="end" fontSize="12" fill="#6B7280">30%</text>
                  
                  {/* X-axis labels */}
                  {mockChartData.map((d, i) => (
                    <text key={i} x={50 + (i * 75)} y="195" textAnchor="middle" fontSize="12" fill="#6B7280">
                      {d.year}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Trade Volume Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Trade Volume Impact
              </h3>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  {[0, 50, 100, 150, 200].map(y => (
                    <line key={y} x1="50" y1={y} x2="350" y2={y} stroke="#E5E7EB" strokeWidth="1"/>
                  ))}
                  
                  {/* Bars */}
                  {mockChartData.map((d, i) => (
                    <rect
                      key={i}
                      x={60 + (i * 60)}
                      y={180 - (d.volume * 0.6)}
                      width="40"
                      height={d.volume * 0.6}
                      fill="#3B82F6"
                      rx="4"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  <text x="40" y="185" textAnchor="end" fontSize="12" fill="#6B7280">0</text>
                  <text x="40" y="135" textAnchor="end" fontSize="12" fill="#6B7280">100B</text>
                  <text x="40" y="85" textAnchor="end" fontSize="12" fill="#6B7280">200B</text>
                  <text x="40" y="35" textAnchor="end" fontSize="12" fill="#6B7280">300B</text>
                  
                  {/* X-axis labels */}
                  {mockChartData.map((d, i) => (
                    <text key={i} x={80 + (i * 60)} y="195" textAnchor="middle" fontSize="12" fill="#6B7280">
                      {d.year}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Current Tariff Overview
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Country/Region</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Product</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Tariff Rate</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Change</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Trade Volume</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTariffData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.country}</td>
                      <td className="py-3 px-4">{item.product}</td>
                      <td className="py-3 px-4 text-right font-medium">{item.rate}%</td>
                      <td className={`py-3 px-4 text-right font-medium ${
                        item.change >= 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.change >= 0 ? '+' : ''}{item.change}%
                      </td>
                      <td className="py-3 px-4 text-right">${item.volume}B</td>
                      <td className="py-3 px-4 text-right">${item.revenue}B</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
