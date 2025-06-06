'use client';
import React, { useState, useEffect, useMemo } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight, OrthographicView } from '@deck.gl/core';
import { feature as topojsonFeature } from 'topojson-client';
import { benefitsMapService } from './BenefitsMapService';
import { StateInfoCard } from './StateInfoCard';

const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 0.5 });
const directionalLight = new DirectionalLight({ color: [255, 255, 255], intensity: 1.0, direction: [-5, -5, -5] });
const lightingEffect = new LightingEffect({ ambientLight, directionalLight });

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  zoom: -3.3,
};

const VetNavMap = ({ onSelectState }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [statesData, setStatesData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  
  useEffect(() => {
    fetch('/data/states-albers-10m.json')
      .then(res => res.json())
      .then(topology => {
        const geojson = topojsonFeature(topology, topology.objects.states);
        setStatesData(geojson);
      })
      .catch(error => console.error('Error loading map data:', error));
  }, []);

  const selectedStateData = useMemo(() => {
    return selectedState ? statesData?.features.find(f => f.properties.id === selectedState) : null;
  }, [selectedState, statesData]);

  const stats = useMemo(() => {
    return selectedState ? benefitsMapService.getStateStats(selectedState) : null;
  }, [selectedState]);

  const layers = [
    new GeoJsonLayer({
      id: 'states-layer',
      data: statesData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      material: { ambient: 0.5, diffuse: 0.5, shininess: 32 },
      getElevation: d => {
        const height = benefitsMapService.getStateElevation(d.properties.id);
        if (d.properties.id === selectedState) return height + 50000;
        if (d.properties.id === hoveredState) return height + 25000;
        return height;
      },
      getFillColor: d => {
        if (d.properties.id === selectedState) return [0, 200, 255, 255]; // Selected color is bright cyan
        if (d.properties.id === hoveredState) return [100, 200, 255, 230];
        return benefitsMapService.getStateColor(d.properties.id);
      },
      getLineColor: [255, 255, 255, 150],
      lineWidthMinPixels: 1,
      onClick: (info) => info.object ? setSelectedState(info.object.properties.id) : setSelectedState(null),
      onHover: (info) => info.object ? setHoveredState(info.object.properties.id) : setHoveredState(null),
      updateTriggers: {
        getFillColor: [selectedState, hoveredState],
        getElevation: [selectedState, hoveredState]
      },
      transitions: {
        getFillColor: { duration: 300 },
        getElevation: { duration: 300 }
      }
    })
  ];

  return (
    <div className="relative w-full h-full">
      <DeckGL
        views={new OrthographicView({ id: 'ortho-view' })}
        layers={layers}
        effects={[lightingEffect]}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        style={{ background: 'transparent' }}
      />
      <StateInfoCard 
        state={selectedStateData} 
        stats={stats}
        onClose={() => setSelectedState(null)} 
        onConfirm={(stateName) => onSelectState && onSelectState(stateName)}
      />
    </div>
  );
};

export default VetNavMap;
