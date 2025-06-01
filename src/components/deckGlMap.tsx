'use client';
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight } from '@deck.gl/core';
import { feature as topojsonFeature } from 'topojson-client';
import { geoAlbersUsa } from 'd3-geo';

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
    fetch('/data/states-albers-10m.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(topology => {
        const geojson = topojsonFeature(topology, topology.objects.states);
        
        // Transform Albers coordinates to WGS84
        const albers = geoAlbersUsa();
        const inverse = albers.invert;
        
        geojson.features.forEach(feature => {
          if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates = feature.geometry.coordinates.map(ring =>
              ring.map(coord => {
                const inverted = inverse(coord);
                return inverted || coord; // fallback if inversion fails
              })
            );
          }
          if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates = feature.geometry.coordinates.map(polygon =>
              polygon.map(ring =>
                ring.map(coord => {
                  const inverted = inverse(coord);
                  return inverted || coord; // fallback if inversion fails
                })
              )
            );
          }
        });
        
        console.log('Loaded states:', geojson.features.length);
        setData(geojson);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading data:', err);
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
      getFillColor: [30, 144, 255, 180], // Semi-transparent DodgerBlue
      getLineColor: [255, 255, 255, 200], // White outline
      getElevation: 2000,
      elevationScale: 1,
      material: {
        ambient: 0.4,
        diffuse: 0.8,
        shininess: 32,
        specularColor: [255, 255, 255]
      },
      onClick: info => {
        if (info.object) {
          console.log('Clicked state:', info.object.properties.name);
          // Add click handler logic here
        }
      },
      onHover: info => {
        // Add hover handler logic here if needed
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
