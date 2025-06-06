'use client';
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight } from '@deck.gl/core';
import { feature as topojsonFeature } from 'topojson-client';
import { geoAlbersUsa } from 'd3-geo';
import { benefitsMapService } from './BenefitsMapService';
import { StateInfoCard } from './StateInfoCard';

const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 1.0 });
const directionalLight = new DirectionalLight({ color: [255, 255, 255], intensity: 1.0, direction: [-1, -2, -3] });
const lightingEffect = new LightingEffect({ ambientLight, directionalLight });

// This function will invert AlbersUSA projection back to WGS84 (lng, lat)
const albersProjection = geoAlbersUsa().scale(1300).translate([487.5, 305]);
const unproject = albersProjection.invert;

const transformCoordinates = (geometry) => {
  if (!geometry) return;

  if (geometry.type === 'Polygon') {
    geometry.coordinates = geometry.coordinates.map(ring =>
      ring.map(coord => unproject(coord) || [0,0])
    );
  } else if (geometry.type === 'MultiPolygon') {
    geometry.coordinates = geometry.coordinates.map(polygon =>
      polygon.map(ring =>
        ring.map(coord => unproject(coord) || [0,0])
      )
    );
  }
};

const VetNavMap = ({ onSelectState }) => {
  const [viewState, setViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 3.5,
    pitch: 45,
    bearing: 0
  });
  const [statesData, setStatesData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateStats, setSelectedStateStats] = useState(null);

  useEffect(() => {
    fetch('/data/states-albers-10m.json')
      .then(response => response.json())
      .then(topology => {
        const geojson = topojsonFeature(topology, topology.objects.states);
        
        // Transform coordinates for each feature
        geojson.features.forEach(feature => transformCoordinates(feature.geometry));
        
        setStatesData(geojson);
        console.log(`Loaded and transformed ${geojson.features.length} states.`);
      })
      .catch(error => console.error('Error loading map data:', error));
  }, []);

  const handleStateClick = (info) => {
    if (info.object) {
      const stateCode = info.object.properties.iso_3166_2;
      const stats = benefitsMapService.getStateStats(stateCode);
      setSelectedState(info.object);
      setSelectedStateStats(stats);
    } else {
      setSelectedState(null);
      setSelectedStateStats(null);
    }
  };
  
  const handleConfirmSelection = (stateName) => {
    if (onSelectState) onSelectState(stateName);
  };

  const layers = [
    new GeoJsonLayer({
      id: 'states-layer',
      data: statesData,
      opacity: 1,
      stroked: true,
      filled: true,
      extruded: true,
      pickable: true,
      getElevation: benefitsMapService.getStateElevation,
      getFillColor: (d) => (selectedState && d.properties.iso_3166_2 === selectedState.properties.iso_3166_2) ? [0, 255, 255, 255] : benefitsMapService.getStateColor(d),
      getLineColor: [255, 255, 255, 150],
      getLineWidth: 1,
      lineWidthMinPixels: 1,
      onClick: handleStateClick
    })
  ];

  return (
    <div className="relative w-full h-full">
      <DeckGL
        layers={layers}
        effects={[lightingEffect]}
        initialViewState={viewState}
        controller={true}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'}}
      />
      <StateInfoCard 
        state={selectedState} 
        stats={selectedStateStats}
        onClose={() => setSelectedState(null)}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
};

export default VetNavMap;
