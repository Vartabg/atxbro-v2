'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line, Points, Point } from '@react-three/drei';
import * as THREE from 'three';
import { feature as topojsonFeature } from 'topojson-client';
import { csvParse } from 'd3-dsv';
import pointInPolygon from '@turf/boolean-point-in-polygon';
import { point as turfPoint, polygon as turfPolygon } from '@turf/helpers';

// State Component: Now renders particles instead of a solid mesh
const State = ({ featureData, points, transform, showLabels }) => {
    const { scale, centerX, centerY } = transform;
    const [hovered, setHovered] = useState(false);

    // Memoize the line and point data for performance
    const { outline, particlePositions } = useMemo(() => {
        const linePoints = [];
        const geomType = featureData.geometry.type;
        const coords = featureData.geometry.coordinates;

        const processPolygon = (polygonCoords) => {
            polygonCoords.forEach((coord, i) => {
                const x = (coord[0] - centerX) * scale;
                const y = -((coord[1] - centerY) * scale);
                linePoints.push(new THREE.Vector3(x, y, 0));
            });
        };

        if (geomType === 'Polygon') {
            processPolygon(coords[0]);
        } else if (geomType === 'MultiPolygon') {
            coords.forEach(polygon => processPolygon(polygon[0]));
        }

        const transformedPoints = points.map(p => {
            const x = (p.x - centerX) * scale;
            const y = -((p.y - centerY) * scale);
            return new THREE.Vector3(x, y, 0);
        });

        return { outline: linePoints, particlePositions: transformedPoints };
    }, [featureData, points, scale, centerX, centerY]);

    return (
        <group onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
            {/* The particle cloud representing the state */}
            <Points positions={particlePositions}>
                <pointsMaterial
                    size={0.03}
                    color={hovered ? '#00ffff' : 'white'}
                    sizeAttenuation
                    transparent
                    opacity={0.75}
                />
            </Points>

            {/* The constellation border */}
            <Line
                points={outline}
                color={'#00ffff'}
                lineWidth={hovered ? 2.0 : 1.0}
                dashed={true}
                dashScale={10}
                gapSize={5}
                transparent
                opacity={hovered ? 0.7 : 0.25}
            />
        </group>
    );
};

// Main Map Component: Now loads and processes both datasets
const VetNavMap = ({ topoJsonPath = '/data/states-albers-10m.json', citiesDataPath = '/data/uscities.csv', targetDisplayWidth = 10 }) => {
    const [states, setStates] = useState([]);
    const [transformParams, setTransformParams] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(topoJsonPath).then(res => res.json()),
            fetch(citiesDataPath).then(res => res.text())
        ]).then(([topology, citiesCsv]) => {
            // Process State Shapes
            if (!topology.objects?.states) throw new Error('TopoJSON is missing "objects.states"');
            const geoJson = topojsonFeature(topology, topology.objects.states);
            
            // Process City Points
            const cities = csvParse(citiesCsv, (d) => ({
                x: +d.lng, // Using lng/lat as projected coords for simplicity
                y: +d.lat,
                population: +d.population
            }));

            // Calculate map bounds from shapes
            let allCoords = [];
            geoJson.features.forEach(f => {
                if(f.geometry?.type === 'Polygon') allCoords.push(...f.geometry.coordinates[0]);
                if(f.geometry?.type === 'MultiPolygon') f.geometry.coordinates.forEach(p => allCoords.push(...p[0]));
            });

            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            allCoords.forEach(c => {
                minX = Math.min(minX, c[0]);
                maxX = Math.max(maxX, c[0]);
                minY = Math.min(minY, c[1]);
                maxY = Math.max(maxY, c[1]);
            });

            const dataWidth = maxX - minX;
            const params = {
                scale: dataWidth === 0 ? 1 : targetDisplayWidth / dataWidth,
                centerX: minX + dataWidth / 2,
                centerY: minY + (maxY - minY) / 2
            };
            setTransformParams(params);

            // Assign cities to states (this is computationally intensive)
            const statesWithPoints = geoJson.features.map(feature => {
                const statePolygon = turfPolygon(feature.geometry.coordinates);
                const pointsInState = cities.filter(city => {
                    const cityPoint = turfPoint([city.x, city.y]);
                    return pointInPolygon(cityPoint, statePolygon);
                });
                return { ...feature, properties: {...feature.properties, points: pointsInState } };
            });

            setStates(statesWithPoints);
            setLoading(false);
        }).catch(err => {
            setError(err.message);
            setLoading(false);
        });
    }, [topoJsonPath, citiesDataPath, targetDisplayWidth]);

    if (loading) return <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><p>Loading Constellation Data...</p></div>;
    if (error) return <div style={{height: '100%', color: 'red', padding: '20px' }}><p>Error: {error}</p></div>;

    return (
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <group>
                {states.map((feature) => (
                    <State
                        key={feature.properties.id || feature.id}
                        featureData={feature}
                        points={feature.properties.points}
                        transform={transformParams}
                        showLabels={false} // Labels can be re-enabled later
                    />
                ))}
            </group>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
    );
};

export default VetNavMap;
