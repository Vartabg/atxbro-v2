'use client';
import React, { useState, useEffect, useRef } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { LightingEffect, AmbientLight, DirectionalLight, FlyToInterpolator, WebMercatorViewport } from '@deck.gl/core';
import { feature as topojsonFeature } from 'topojson-client';
import { geoAlbersUsa } from 'd3-geo';
import bbox from '@turf/bbox';
import { benefitsMapService } from './BenefitsMapService';
import { StateInfoCard } from './StateInfoCard';

const ambientLight = new AmbientLight({ color: [255, 255, 255], intensity: 0.5 });
const directionalLight = new DirectionalLight({ color: [255, 255, 255], intensity: 1.0, direction: [-5, -5, -5] });
const lightingEffect = new LightingEffect({ ambientLight, directionalLight });

const albersProjection = geoAlbersUsa().scale(1300).translate([487.5, 305]);
const unproject = albersProjection.invert;

const INITIAL_VIEW_STATE = { longitude: -105, latitude: 40, zoom: 3, pitch: 45, bearing: 0, transitionDuration: 1000, transitionInterpolator: new FlyToInterpolator() };

const transformCoordinates = (geometry) => {
  if (!geometry) return;
  if (geometry.type === 'Polygon') geometry.coordinates = geometry.coordinates.map(ring => ring.map(coord => unproject(coord) || [0,0]));
  if (geometry.type === 'MultiPolygon') geometry.coordinates = geometry.coordinates.map(polygon => polygon.map(ring => ring.map(coord => unproject(coord) || [0,0])));
};

const VetNavMap = ({ onSelectState }) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [statesData, setStatesData] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedStateStats, setSelectedStateStats] = useState(null);
  const cardRef = useRef(null);

  // Click outside to close logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        // Only close if a state is selected and the click was outside the card
        if (selectedState) {
          setSelectedState(null);
          setViewState(INITIAL_VIEW_STATE);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cardRef, selectedState]);

  useEffect(() => {
    fetch('/data/states-albers-10m.json')
      .then(res => res.json())
      .then(topology => {
        const geojson = topojsonFeature(topology, topology.objects.states);
        geojson.features.forEach(feature => transformCoordinates(feature.geometry));
        setStatesData(geojson);
      })
      .catch(error => console.error('Error loading map data:', error));
  }, []);

  const handleStateClick = (info, event) => {
    // Stop the event from bubbling up to the document listener
    event.srcEvent.stopPropagation();
    
    if (info.object) {
      const fipsCode = info.object.properties.id;
      const stats = benefitsMapService.getStateStats(fipsCode);
      setSelectedState(info.object);
      setSelectedStateStats(stats);
      
      const [minLng, minLat, maxLng, maxLat] = bbox(info.object);
      const { longitude, latitude, zoom } = new WebMercatorViewport(viewState).fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40 });
      
      setViewState({ ...viewState, longitude, latitude, zoom: zoom * 0.9, transitionDuration: 1200, transitionInterpolator: new FlyToInterpolator({speed: 1.5}) });
    }
  };
  
  const layers = [
    new GeoJsonLayer({
      id: 'states-layer',
      data: statesData,
      opacity: 0.9,
      stroked: true,
      filled: true,
      extruded: true,
      pickable: true,
      getElevation: d => (selectedState && d.properties.id === selectedState.properties.id ? 75000 : 50000),
      getFillColor: d => selectedState && d.properties.id === selectedState.properties.id ? [0, 255, 255, 255] : benefitsMapService.getStateColor(), // Uniform initial color
      getLineColor: [0, 255, 255, 200],
      getLineWidth: 1,
      lineWidthMinPixels: 2,
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
      <DeckGL layers={layers} viewState={viewState} controller={false} style={{background: 'transparent'}} />
      <StateInfoCard ref={cardRef} state={selectedState} stats={selectedStateStats} onClose={() => { setSelectedState(null); setViewState(INITIAL_VIEW_STATE); }} onConfirm={(stateName) => onSelectState && onSelectState(stateName)} />
    </div>
  );
};

export default VetNavMap;
