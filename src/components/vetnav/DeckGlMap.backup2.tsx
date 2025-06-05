'use client';
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight } from '@deck.gl/core';

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

  // Setup lighting - restored original
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
        background: '#f0f0f0'
      }}>
        <p>Loading 3D Map...</p>
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
      // Restored original optimized colors
      getFillColor: d => {
        // Color by benefits density (placeholder - will integrate real data)
        const stateName = d.properties?.name || d.properties?.NAME;
        if (!stateName) return [100, 100, 100, 160];
        
        // Mock benefits density - TODO: Replace with real VetNav data
        const benefitsDensity = Math.random();
        const red = Math.floor(255 * benefitsDensity);
        const green = Math.floor(255 * (1 - benefitsDensity));
        const blue = 100;
        return [red, green, blue, 180];
      },
      getLineColor: [255, 255, 255, 200], // White outlines
      getElevation: d => {
        // Height by veteran population (placeholder)
        return Math.random() * 3000 + 1000;
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
          const stateName = info.object.properties?.name || info.object.properties?.NAME;
          console.log('Clicked state:', stateName);
          // TODO: Show benefits overlay for this state
        }
      },
      onHover: info => {
        // TODO: Add hover tooltip with benefits preview
      }
    })
  ];

  return (
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
        clearColor: [0.9, 0.9, 0.9, 1.0]
      }}
      style={{ width: '100%', height: '100vh' }}
    />
  );
};

export default DeckGlMap;
