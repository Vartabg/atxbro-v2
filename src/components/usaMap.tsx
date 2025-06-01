import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { feature as topojsonFeature } from 'topojson-client';

const State = ({ featureData, transform, extrudeSettings, showLabels }) => {
    const { scale, centerX, centerY } = transform;
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [centroid, setCentroid] = useState(null);

    const shapes = useMemo(() => {
        const createdShapes = [];
        const geomType = featureData.geometry.type;
        const coords = featureData.geometry.coordinates;
        let allShapePoints = [];

        const createShapeFromCoords = (polygonCoords) => {
            const shape = new THREE.Shape();
            polygonCoords.forEach((coord, i) => {
                const x = (coord[0] - centerX) * scale;
                const y = -((coord[1] - centerY) * scale);
                
                allShapePoints.push({x, y});

                if (i === 0) {
                    shape.moveTo(x, y);
                } else {
                    shape.lineTo(x, y);
                }
            });
            return shape;
        };

        if (geomType === 'Polygon') {
            createdShapes.push(createShapeFromCoords(coords[0]));
        } else if (geomType === 'MultiPolygon') {
            coords.forEach(polygon => {
                createdShapes.push(createShapeFromCoords(polygon[0]));
            });
        }
        
        if (allShapePoints.length > 0) {
            let sumX = 0, sumY = 0;
            allShapePoints.forEach(p => { sumX += p.x; sumY += p.y; });
            setCentroid([sumX / allShapePoints.length, sumY / allShapePoints.length, extrudeSettings.depth + 0.05]);
        }

        return createdShapes;
    }, [featureData, scale, centerX, centerY, extrudeSettings.depth]);

    const stateName = featureData.properties?.name || featureData.id || 'Unknown State';

    return (
        <group>
            {shapes.map((shape, index) => (
                <mesh
                    key={`${featureData.id || 'state'}-${index}`}
                    ref={meshRef}
                    castShadow
                    receiveShadow
                    onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                    onPointerOut={() => setHovered(false)}
                >
                    <extrudeGeometry args={[shape, extrudeSettings]} />
                    <meshStandardMaterial
                        color={hovered ? '#ff8800' : '#4a90e2'}
                        transparent
                        opacity={hovered ? 1 : 0.85}
                    />
                </mesh>
            ))}
            {showLabels && centroid && (
                <Html
                    position={centroid}
                    center
                    occlude={[meshRef]}
                    style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                >
                    <div style={{
                        padding: '4px 8px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontFamily: 'Arial, sans-serif',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontWeight: '500',
                    }}>
                        {stateName}
                    </div>
                </Html>
            )}
        </group>
    );
};

const USAMap = ({ topoJsonPath = '/data/states-albers-10m.json', targetDisplayWidth = 10, showLabels = false }) => {
    const [processedFeatures, setProcessedFeatures] = useState([]);
    const [transformParams, setTransformParams] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(topoJsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for ${topoJsonPath}`);
                }
                return response.json();
            })
            .then(usTopoData => {
                if (!usTopoData.objects || !usTopoData.objects.states) {
                     throw new Error('TopoJSON data is missing "objects.states"');
                }
                const geoJson = topojsonFeature(usTopoData, usTopoData.objects.states);
                
                if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
                    throw new Error('Failed to convert TopoJSON to GeoJSON features or no features found.');
                }
                const geoJsonFeatures = geoJson.features;

                let allCoords = [];
                geoJsonFeatures.forEach(f => {
                    if (f.geometry && f.geometry.coordinates) {
                        const geomType = f.geometry.type;
                        const coords = f.geometry.coordinates;
                        if (geomType === 'Polygon') {
                            if(coords[0]) coords[0].forEach(c => allCoords.push(c));
                        } else if (geomType === 'MultiPolygon') {
                            coords.forEach(polygon => {
                                if(polygon[0]) polygon[0].forEach(c => allCoords.push(c));
                            });
                        }
                    }
                });

                if (allCoords.length === 0) {
                    console.warn("No coordinates found to calculate bounds.");
                    setTransformParams({
                        scale: 0.01, 
                        centerX: 0,
                        centerY: 0,
                    });
                    setProcessedFeatures(geoJsonFeatures);
                    setLoading(false);
                    return;
                }

                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                allCoords.forEach(coord => {
                    if (coord && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                        minX = Math.min(minX, coord[0]);
                        maxX = Math.max(maxX, coord[0]);
                        minY = Math.min(minY, coord[1]);
                        maxY = Math.max(maxY, coord[1]);
                    }
                });
                
                if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) {
                    throw new Error("Failed to calculate valid data bounds.");
                }

                const dataWidth = maxX - minX;
                const dataCenterX = minX + dataWidth / 2;
                const dataCenterY = minY + (maxY - minY) / 2;
                const calculatedScale = dataWidth === 0 ? 0.01 : targetDisplayWidth / dataWidth;

                setTransformParams({
                    scale: calculatedScale,
                    centerX: dataCenterX,
                    centerY: dataCenterY,
                });
                setProcessedFeatures(geoJsonFeatures);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading TopoJSON:', err);
                setError(err.message);
                setLoading(false);
            });
    }, [topoJsonPath, targetDisplayWidth]);

    const extrudeSettings = useMemo(() => ({
        steps: 1,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.01,
        bevelSegments: 1,
    }), []);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><p>Loading Map Data...</p></div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}><p>Error loading map: {error}</p></div>;
    }
    
    if (!transformParams || processedFeatures.length === 0) {
         return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><p>No map data to display.</p></div>;
    }

    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }} shadows>
            <ambientLight intensity={0.6} />
            <directionalLight 
                position={[10, 10, 10]} 
                intensity={1.5} 
                castShadow 
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <group rotation={[0, 0, 0]}>
                {processedFeatures.map((feature, index) => (
                    <State
                        key={feature.id || `state-${index}`}
                        featureData={feature}
                        transform={transformParams}
                        extrudeSettings={extrudeSettings}
                        showLabels={showLabels}
                    />
                ))}
            </group>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
    );
};

export default USAMap;
