'use client';
import { useState, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight } from '@deck.gl/core';
import statesData from '../data/usStatesComplete.json';
import benefitsData from '../data/benefitsData.json';

export default function DeckGlMap() {
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [debug, setDebug] = useState('Ready - Enhanced 3D Map with Mobile Support');
  const [viewState, setViewState] = useState({
    longitude: -95.7129,
    latitude: 39.0902,
    zoom: 4,
    pitch: 50,
    bearing: 0
  });

  // Mobile optimizations
  const mobileOptimizations = useMemo(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return {
      touchAction: mobile ? 'manipulation' : 'auto',
      pixelRatio: mobile ? Math.min(window.devicePixelRatio, 2) : undefined
    };
  }, []);

  const controllerOptions = useMemo(() => ({
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    doubleClickZoom: true,
    inertia: 500
  }), []);

  const lightingEffect = useMemo(() => new LightingEffect({
    ambientLight: new AmbientLight({
      color: [255, 255, 255],
      intensity: 0.6
    }),
    directionalLights: [
      new DirectionalLight({
        color: [255, 255, 255],
        intensity: 1.0,
        direction: [-3, -9, -1]
      })
    ]
  }), []);

  const layers = useMemo(() => [
    new GeoJsonLayer({
      id: 'us-states',
      data: statesData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: false,
      lineWidthMinPixels: 1,
      material: {
        ambient: 0.35,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [255, 255, 255]
      },
      getFillColor: d => {
        if (selectedState === d.properties.id) return [255, 140, 0, 240];
        if (hoveredState === d.properties.id) return [100, 200, 255, 200];
        const benefits = d.properties.benefits;
        if (benefits > 170) return [46, 125, 50, 180];
        if (benefits > 150) return [70, 130, 180, 180];
        return [156, 39, 176, 180];
      },
      getLineColor: [255, 255, 255, 120],
      getElevation: d => {
        const baseHeight = d.properties.benefits * 1000;
        if (selectedState === d.properties.id) return baseHeight * 1.8;
        if (hoveredState === d.properties.id) return baseHeight * 1.2;
        return baseHeight;
      },
      updateTriggers: {
        getFillColor: [selectedState, hoveredState],
        getElevation: [selectedState, hoveredState]
      },
      onClick: (info) => {
        if (info && info.object && info.object.properties) {
          const stateName = info.object.properties.name;
          const stateId = info.object.properties.id;
          setDebug('Selected: ' + stateName + ' - Enhanced 3D view');
          setSelectedState(stateId);
          setShowDetails(false);
        } else {
          setDebug('Clicked empty space - selection cleared');
          setSelectedState(null);
          setShowDetails(false);
        }
      },
      onHover: (info) => {
        if (info && info.object && info.object.properties) {
          const stateName = info.object.properties.name;
          const benefits = info.object.properties.benefits;
          setDebug('Hovering: ' + stateName + ' (' + benefits + ' benefits)');
          setHoveredState(info.object.properties.id);
        } else {
          setDebug('Ready - Enhanced 3D Map with Mobile Support');
          setHoveredState(null);
        }
      },
      transitions: {
        getElevation: 400,
        getFillColor: 250
      }
    })
  ], [selectedState, hoveredState]);

  const selectedStateData = selectedState ? 
    statesData.features.find(f => f.properties.id === selectedState) : null;
  
  const benefitsDetails = selectedState && benefitsData[selectedState] ? 
    benefitsData[selectedState] : null;

  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      position: 'relative',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f766e 100%)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
    }}>
      <div style={{
        position: 'absolute',
        top: 15,
        left: 15,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        color: 'white',
        padding: '18px',
        borderRadius: '12px',
        zIndex: 1000,
        maxWidth: '360px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '12px' }}>
          <strong>Status:</strong> {debug}
        </div>
        
        {selectedStateData && (
          <div style={{ 
            marginTop: '12px', 
            padding: '16px', 
            background: 'rgba(255,140,0,0.15)', 
            borderRadius: '10px',
            border: '1px solid rgba(255,140,0,0.4)'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '8px' }}>
              {selectedStateData.properties.name}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '12px' }}>
              Benefits Available: <strong style={{ color: '#fbbf24' }}>{selectedStateData.properties.benefits}</strong>
            </div>
            
            {benefitsDetails && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                  Top Categories:
                </div>
                {benefitsDetails.categories.slice(0, 3).map((cat, idx) => (
                  <div key={idx} style={{ 
                    fontSize: '11px', 
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'rgba(255,255,255,0.8)'
                  }}>
                    <span>{cat.name}</span>
                    <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>{cat.count}</span>
                  </div>
                ))}
                
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    marginTop: '12px',
                    background: 'linear-gradient(135deg, #0f766e 0%, #06b6d4 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    width: '100%',
                    fontWeight: '600'
                  }}
                >
                  {showDetails ? 'Hide Details' : 'View All Benefits'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showDetails && benefitsDetails && (
        <div style={{
          position: 'absolute',
          top: 15,
          right: 15,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(16px)',
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          zIndex: 1001,
          width: '420px',
          maxHeight: '560px',
          overflowY: 'auto',
          boxShadow: '0 12px 48px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '22px' }}>{benefitsDetails.state} Benefits</h3>
            <button 
              onClick={() => setShowDetails(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '18px',
                cursor: 'pointer',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%'
              }}
            >
              ✕
            </button>
          </div>
          
          {benefitsDetails.categories.map((category, idx) => (
            <div key={idx} style={{ 
              marginBottom: '16px',
              padding: '16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#fbbf24' }}>{category.name} ({category.count})</h4>
              <p style={{ margin: '0', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
                {category.description}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <DeckGL
        width='100%'
        height='100%'
        initialViewState={viewState}
        controller={controllerOptions}
        layers={layers}
        effects={[lightingEffect]}
        onViewStateChange={({viewState}) => setViewState(viewState)}
        style={{ 
          width: '100%', 
          height: '100%',
          touchAction: mobileOptimizations.touchAction
        }}
      />
    </div>
  );
}
