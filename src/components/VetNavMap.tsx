'use client';
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight } from '@deck.gl/core';
import { benefitsMapService } from './BenefitsMapService';
import { StateInfoCard } from './StateInfoCard';

const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 1.0 });
const directionalLight = new DirectionalLight({ color: [255, 255, 255], intensity: 1.0, direction: [-1, -2, -3] });
const lightingEffect = new LightingEffect({ ambientLight, directionalLight });

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
    fetch('https://d2ad6b4ur77vpj.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson')
      .then(response => response.json())
      .then(data => {
        setStatesData(data);
        console.log(`Loaded ${data.features.length} states.`);
      });
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
    console.log(`Confirmed selection for ${stateName}. Triggering navigation.`);
    if (onSelectState) {
      onSelectState(stateName);
    }
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
      >
        {/* The <Map> component has been removed to isolate the dependency issue */}
      </DeckGL>
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
