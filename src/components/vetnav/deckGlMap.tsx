'use client';
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight } from '@deck.gl/core';
import { benefitsMapService } from './BenefitsMapService';

const DeckGlMap = () => {
  const [viewState, setViewState] = useState({
    longitude: -96,
    latitude: 38,
    zoom: 3.7,
    pitch: 35,
    bearing: -10
  });
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Setup lighting
  const ambientLight = new AmbientLight({
    color: [255, 255, 255],
    intensity: 0.3
  });
  
  const directionalLight = new DirectionalLight({
    color: [255, 255, 255],
    intensity: 0.8,
    direction: [-1, -2, -1]
  });
  
  const lightingEffect = new LightingEffect({
    ambientLight,
    directionalLight
  });

  useEffect(() => {
    setLoading(true);
    fetch('/data/us-states-realistic.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(geojson => {
        console.log('Loaded states:', geojson.features?.length || 'No features found');
        setData(geojson);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading map data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading Veterans Benefits Map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f0f0',
        color: 'red'
      }}>
        <p>Error loading map: {error}</p>
      </div>
    );
  }

  const layers = [
    new GeoJsonLayer({
      id: 'states-3d',
      data,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: false,
      lineWidthUnits: 'pixels',
      lineWidthMinPixels: 1.5,
      getFillColor: d => {
        const stateName = d.properties?.name || d.properties?.NAME || d.properties?.STATE_NAME;
        if (!stateName) return [100, 100, 100, 160];
        
        // Use real benefits data for colors
        return benefitsMapService.getStateColor(stateName);
      },
      getLineColor: d => {
        const stateName = d.properties?.name || d.properties?.NAME || d.properties?.STATE_NAME;
        const isSelected = selectedState === stateName;
        return isSelected ? [255, 255, 0, 255] : [255, 255, 255, 200]; // Yellow if selected
      },
      getElevation: d => {
        const stateName = d.properties?.name || d.properties?.NAME || d.properties?.STATE_NAME;
        if (!stateName) return 1000;
        
        // Use real benefits data for elevation
        return benefitsMapService.getStateElevation(stateName);
      },
      elevationScale: 1,
      material: {
        ambient: 0.4,
        diffuse: 0.8,
        shininess: 32,
        specularColor: [255, 255, 255]
      },
      onClick: info => {
        if (info.object) {
          const stateName = info.object.properties?.name || info.object.properties?.NAME || info.object.properties?.STATE_NAME;
          console.log('Clicked state:', stateName);
          setSelectedState(stateName);
          
          // Log benefits data for the state
          const stateBenefits = benefitsMapService.getStateBenefits(stateName);
          console.log(`${stateName} benefits:`, stateBenefits.length, 'available');
        }
      },
      onHover: info => {
        // TODO: Add hover tooltip with benefits preview
      }
    })
  ];

  return (
    <div className="relative w-full h-full">
      <DeckGL
        initialViewState={viewState}
        controller={{ 
          dragRotate: true, 
          scrollZoom: true,
          touchRotate: true,
          touchZoom: true
        }}
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        layers={layers}
        effects={[lightingEffect]}
        glOptions={{ antialias: true }}
        parameters={{ 
          depthTest: true,
          clearColor: [0.1, 0.1, 0.2, 1.0]
        }}
        style={{ width: '100%', height: '100vh' }}
      />
      
      {/* Benefits Info Overlay */}
      {selectedState && (
        <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 max-w-sm shadow-lg">
          <h3 className="text-lg font-bold text-blue-800 mb-2">{selectedState}</h3>
          <div className="text-sm space-y-1">
            <p><strong>Available Benefits:</strong> {benefitsMapService.getStateBenefits(selectedState).length}</p>
            <p><strong>Federal Benefits:</strong> {benefitsMapService.getStateBenefitsData().get(selectedState)?.federalBenefits || 0}</p>
            <p><strong>State Benefits:</strong> {benefitsMapService.getStateBenefitsData().get(selectedState)?.stateBenefits || 0}</p>
            <button 
              onClick={() => setSelectedState(null)}
              className="mt-2 text-blue-600 hover:text-blue-800 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-lg">
        <h4 className="text-sm font-bold mb-2">Benefits Density</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-red-500"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-yellow-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-green-500"></div>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckGlMap;
