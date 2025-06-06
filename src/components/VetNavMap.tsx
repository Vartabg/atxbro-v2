'use client';
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight, FlyToInterpolator, WebMercatorViewport } from '@deck.gl/core';
import { feature as topojsonFeature } from 'topojson-client';
import { geoAlbersUsa } from 'd3-geo';
import bbox from '@turf/bbox';
import { benefitsMapService } from './BenefitsMapService';
import { StateInfoCard } from './StateInfoCard';

// Futuristic Lighting
const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 0.3 });
const directionalLight = new DirectionalLight({ color: [255, 255, 255], intensity: 1.0, direction: [-5, -5, -5] });
const lightingEffect = new LightingEffect({ ambientLight, directionalLight });

const albersProjection = geoAlbersUsa().scale(1300).translate([487.5, 305]);
const unproject = albersProjection.invert;

const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 3.5,
  pitch: 45,
  bearing: 0,
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator()
};

const transformCoordinates = (geometry) => {
  if (!geometry) return;
  if (geometry.type === 'Polygon') {
    geometry.coordinates = geometry.coordinates.map(ring => ring.map(coord => unproject(coord) || [0,0]));
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates = geometry.coordinates.map(polygon => polygon.map(ring => ring.map(coord => unproject(coord) || [0,0])));
  }
};

const VetNavMap = ({ onSelectState }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [statesData, setStatesData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateStats, setSelectedStateStats] = useState(null);

  useEffect(() => {
    fetch('/data/states-albers-10m.json')
      .then(response => { if (!response.ok) throw new Error('Network response was not ok'); return response.json(); })
      .then(topology => {
        const geojson = topojsonFeature(topology, topology.objects.states);
        geojson.features.forEach(feature => transformCoordinates(feature.geometry));
        setStatesData(geojson);
      })
      .catch(error => console.error('Error loading or processing map data:', error));
  }, []);

  const handleStateClick = (info) => {
    if (info.object) {
      const fipsCode = info.object.properties.id;
      const stats = benefitsMapService.getStateStats(fipsCode);
      setSelectedState(info.object);
      setSelectedStateStats(stats);
      
      const [minLng, minLat, maxLng, maxLat] = bbox(info.object);
      const { longitude, latitude, zoom } = new WebMercatorViewport(viewState).fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 40 }
      );
      
      setViewState({ ...viewState, longitude, latitude, zoom: zoom * 0.75, transitionDuration: 1200, transitionInterpolator: new FlyToInterpolator({speed: 1.5}) });
    } else {
      setSelectedState(null);
      setSelectedStateStats(null);
      setViewState(INITIAL_VIEW_STATE);
    }
  };
  
  const handleConfirmSelection = (stateName) => {
    if (onSelectState) onSelectState(stateName);
  };

  const layers = [
    new GeoJsonLayer({
      id: 'states-layer',
      data: statesData,
      opacity: 0.8,
      stroked: true,
      filled: true,
      extruded: true,
      pickable: true,
      material: { ambient: 0.5, diffuse: 0.5, shininess: 32, specularColor: [60, 64, 70] },
      getElevation: d => selectedState && d.properties.id === selectedState.properties.id ? 75000 : 50000,
      getFillColor: [25, 40, 60, 220], // Dark, semi-transparent space-blue
      getLineColor: [0, 255, 255, 255], // Glowing cyan border
      getLineWidth: 1,
      lineWidthMinPixels: 2,
      onClick: handleStateClick,
      updateTriggers: {
        getElevation: [selectedState]
      },
      transitions: {
        getElevation: { duration: 500 }
      }
    })
  ];

  return (
    <div className="relative w-full h-full">
      <DeckGL
        layers={layers}
        effects={[lightingEffect]}
        viewState={viewState}
        controller={!selectedState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        style={{background: 'transparent'}}
      />
      <StateInfoCard 
        state={selectedState} 
        stats={selectedStateStats}
        onClose={() => { setSelectedState(null); setViewState(INITIAL_VIEW_STATE); }}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
};

export default VetNavMap;
