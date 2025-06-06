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

// Final Lighting Pass: More "top-down"
const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 0.3 });
const directionalLight = new DirectionalLight({ color: [255, 255, 255], intensity: 0.8, direction: [-2, -4, -2] });
const lightingEffect = new LightingEffect({ ambientLight, directionalLight });

const albersProjection = geoAlbersUsa().scale(1300).translate([487.5, 305]);
const unproject = albersProjection.invert;

const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 3.5,
  pitch: 55,
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
      .then(response => response.json())
      .then(topology => {
        const geojson = topojsonFeature(topology, topology.objects.states);
        geojson.features.forEach(feature => transformCoordinates(feature.geometry));
        setStatesData(geojson);
      });
  }, []);

  const handleStateClick = (info) => {
    if (info.object) {
      const stateCode = info.object.properties.iso_3166_2;
      const stats = benefitsMapService.getStateStats(stateCode);
      setSelectedState(info.object);
      setSelectedStateStats(stats);
      
      const [minLng, minLat, maxLng, maxLat] = bbox(info.object);
      const { longitude, latitude, zoom } = new WebMercatorViewport(viewState).fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 40 }
      );
      
      setViewState({
        ...viewState,
        longitude,
        latitude,
        zoom: zoom * 0.9,
        transitionDuration: 1200,
        transitionInterpolator: new FlyToInterpolator({speed: 1.5})
      });

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
      opacity: 1,
      stroked: true,
      filled: true,
      extruded: true,
      pickable: true,
      material: {
        ambient: 0.5,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [100, 120, 130]
      },
      getElevation: d => {
        const baseHeight = benefitsMapService.getStateElevation(d);
        return selectedState && d.properties.iso_3166_2 === selectedState.properties.iso_3166_2 ? baseHeight + 50000 : baseHeight;
      },
      getFillColor: (d) => (selectedState && d.properties.iso_3166_2 === selectedState.properties.iso_3166_2) ? [0, 255, 255, 255] : benefitsMapService.getStateColor(d),
      getLineColor: [255, 255, 255, 150],
      getLineWidth: 1,
      lineWidthMinPixels: 1,
      onClick: handleStateClick,
      updateTriggers: {
        getFillColor: [selectedState],
        getElevation: [selectedState]
      },
      transitions: {
        getFillColor: 500,
        getElevation: 500
      }
    })
  ];

  return (
    <div className="relative w-full h-full">
      <DeckGL
        layers={layers}
        effects={[lightingEffect]}
        viewState={viewState}
        controller={true}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'}}
      />
      <StateInfoCard 
        state={selectedState} 
        stats={selectedStateStats}
        onClose={() => {
          setSelectedState(null);
          setViewState(INITIAL_VIEW_STATE);
        }}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
};

export default VetNavMap;
