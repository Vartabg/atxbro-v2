"use client";
import VetNav from '../components/VetNav';
import JetsStats from '../components/JetsStats';
import Landing3D from '../components/Landing3D';
import Landing3DMobile from "../components/Landing3DMobile";
import PetRadar from '../components/PetRadar';
import TariffExplorer from '../components/TariffExplorer';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, BarChart3, PawPrint, TrendingUp } from 'lucide-react';
import { useGestureProfiler } from '../hooks/useGestureProfiler';

export default function Home() {
  const [currentView, setCurrentView] = useState('landing3d');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const { profile } = useGestureProfiler();

  const services = [
    {
      id: 'vetnav',
      title: 'VetNav',
      subtitle: 'Benefits Navigator',
      position3D: [-3, 2, 0] as [number, number, number],
      color: 'from-blue-600 to-blue-800',
      icon: ShieldCheck,
      description: 'Discover veteran benefits with intelligent guidance'
    },
    {
      id: 'jets-stats',
      title: 'JetsHome',
      subtitle: 'Sports Analytics',
      position3D: [3, 2, 0] as [number, number, number],
      color: 'from-green-600 to-green-800',
      icon: BarChart3,
      description: 'Comprehensive NFL team analysis and metrics'
    },
    {
      id: 'pet-radar',
      title: 'Pet Radar',
      subtitle: 'Adoption Search',
      position3D: [-3, -2, 0] as [number, number, number],
      color: 'from-yellow-600 to-yellow-800',
      icon: PawPrint,
      description: 'Find your perfect companion through smart matching'
    },
    {
      id: 'tariff-explorer',
      title: 'Trade Explorer',
      subtitle: 'Economic Analysis',
      position3D: [3, -2, 0] as [number, number, number],
      color: 'from-purple-600 to-purple-800',
      icon: TrendingUp,
      description: 'Interactive economic policy visualization'
    }
  ];

  const renderServiceView = () => {
    return (
      <div className="min-h-screen relative">
        {currentView !== 'landing3d' && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={() => setCurrentView('landing3d')}
              className="bg-black/50 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/70 transition-all flex items-center text-sm shadow-lg"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Menu
            </button>
          </div>
        )}

        <div className={currentView !== 'landing3d' ? "pt-16 md:pt-0" : ""}>
          {currentView === 'vetnav' && <VetNav />}
          {currentView === 'jets-stats' && <JetsStats />}
          {currentView === 'pet-radar' && (
            <div className="py-12 md:py-20 bg-gradient-to-br from-yellow-700 via-yellow-600 to-orange-500 text-white min-h-screen flex items-center justify-center">
              <div className="container mx-auto px-4 text-center max-w-2xl">
                <PawPrint size={64} className="mx-auto mb-6 text-yellow-200"/>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Pet Adoption Radar</h1>
                <p className="text-lg md:text-xl text-yellow-100 mb-8">Find Your Perfect Companion</p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
                  <div className="space-y-4">
                    <input type="text" placeholder="Enter ZIP code" className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-yellow-400 focus:outline-none"/>
                    <button className="w-full p-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white font-bold transition-colors"> Search Available Pets </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentView === 'tariff-explorer' && (
            <div className="py-12 md:py-20 bg-gradient-to-br from-purple-800 via-purple-700 to-indigo-600 text-white min-h-screen flex items-center justify-center">
              <div className="container mx-auto px-4 text-center max-w-3xl">
                <TrendingUp size={64} className="mx-auto mb-6 text-purple-300"/>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Trade Policy Explorer</h1>
                <p className="text-lg md:text-xl text-purple-200 mb-8">Interactive Economic Analysis Dashboard</p>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-black/20 p-4 rounded-lg"> 
                      <h3 className="text-lg font-bold mb-2 text-purple-200">Historical Tariff Rates</h3> 
                      <p className="text-purple-300 text-sm">Analyze trade policy impacts over time.</p> 
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg"> 
                      <h3 className="text-lg font-bold mb-2 text-purple-200">Economic Indicators</h3> 
                      <p className="text-purple-300 text-sm">GDP, employment, and trade correlations.</p> 
                    </div>
                  </div>
                  <button className="mt-6 w-full p-4 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-bold transition-colors"> Explore Trade Data </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="font-sans antialiased">
      <div 
        className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-800 relative overflow-hidden"
        style={{ touchAction: 'none' }} 
      >
        {currentView === 'landing3d' ? 
          isMobile ? <Landing3DMobile /> : <Landing3D /> : 
          renderServiceView()
        }
        
        {profile && profile.personality !== 'default' && (
          <div className="fixed top-4 right-4 bg-black/70 text-white p-3 rounded-lg text-xs z-50 shadow-xl">
            <div>Gesture Profile: <span className="font-semibold text-blue-300">{profile.personality}</span></div>
          </div>
        )}
      </div>
    </main>
  );
}
