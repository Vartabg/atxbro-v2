'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useTexture, Line } from '@react-three/drei';
import * as THREE from 'three';
import { feature as topojsonFeature } from 'topojson-client';

const State = ({ featureData, transform, extrudeSettings, showLabels }) => {
    const { scale, centerX, centerY } = transform;
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [centroid, setCentroid] = useState(null);

    // Load the satellite texture
    const groundTexture = useTexture('/textures/ground.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(0.1, 0.1); // Adjust tiling of the texture

    const { shapes, lines } = useMemo(() => {
        const createdShapes = [];
        const createdLines = [];
        const geomType = featureData.geometry.type;
        const coords = featureData.geometry.coordinates;

        const processPolygon = (polygonCoords) => {
            const shape = new THREE.Shape();
            const linePoints = [];
            polygonCoords.forEach((coord, i) => {
                const x = (coord[0] - centerX) * scale;
                const y = -((coord[1] - centerY) * scale);
                linePoints.push(x, y, extrudeSettings.depth + 0.01);

                if (i === 0) shape.moveTo(x, y);
                else shape.lineTo(x, y);
            });
            return { shape, linePoints };
        };

        if (geomType === 'Polygon') {
            const { shape, linePoints } = processPolygon(coords[0]);
            createdShapes.push(shape);
            createdLines.push(linePoints);
        } else if (geomType === 'MultiPolygon') {
            coords.forEach(polygon => {
                const { shape, linePoints } = processPolygon(polygon[0]);
                createdShapes.push(shape);
                createdLines.push(linePoints);
            });
        }
        return { shapes: createdShapes, lines: createdLines };
    }, [featureData, scale, centerX, centerY, extrudeSettings.depth]);

    useEffect(() => {
        if (meshRef.current) {
            const box = new THREE.Box3().setFromObject(meshRef.current);
            const center = new THREE.Vector3();
            box.getCenter(center);
            setCentroid([center.x, center.y, extrudeSettings.depth + 0.05]);
        }
    }, [shapes, extrudeSettings.depth]);

    const stateName = featureData.properties?.name || featureData.id || 'Unknown State';

    return (
        <group>
            {/* The main 3D state mesh with the satellite texture */}
            <mesh
                ref={meshRef}
                castShadow
                receiveShadow
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
                onPointerOut={() => setHovered(false)}
            >
                <extrudeGeometry args={[shapes, extrudeSettings]} />
                <meshStandardMaterial
                    map={groundTexture}
                    color={hovered ? '#ffffff' : '#cccccc'} // Tint the texture on hover
                />
            </mesh>

            {/* The glowing border lines */}
            {lines.map((points, i) => (
                <Line
                    key={i}
                    points={points}
                    color={'#00ffff'} // Cyan color for the border
                    lineWidth={hovered ? 2.5 : 1.5}
                    transparent
                    opacity={0.8}
                />
            ))}
            
            {showLabels && centroid && (
                <Html position={centroid} center occlude={[meshRef]}>
                    <div style={{
                        padding: '4px 8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '10px',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        border: '1px solid rgba(0, 255, 255, 0.5)',
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}>
                        {stateName}
                    </div>
                </Html>
            )}
        </group>
    );
};

const VetNavMap = ({ topoJsonPath = '/data/states-albers-10m.json', targetDisplayWidth = 10, showLabels = false }) => {
    // ... (The rest of the VetNavMap component remains the same)
    const [processedFeatures, setProcessedFeatures] = useState([]);
    const [transformParams, setTransformParams] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(topoJsonPath)
            .then(response => { if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return response.json(); })
            .then(usTopoData => {
                if (!usTopoData.objects || !usTopoData.objects.states) throw new Error('TopoJSON is missing "objects.states"');
                const geoJson = topojsonFeature(usTopoData, usTopoData.objects.states);
                if (!geoJson || !geoJson.features) throw new Error('Failed to convert TopoJSON');
                const geoJsonFeatures = geoJson.features;

                let allCoords = [];
                geoJsonFeatures.forEach(f => {
                    if (f.geometry?.coordinates) {
                        const coords = f.geometry.coordinates;
                        if (f.geometry.type === 'Polygon') {
                            if(coords[0]) coords[0].forEach(c => allCoords.push(c));
                        } else if (f.geometry.type === 'MultiPolygon') {
                            coords.forEach(polygon => {
                                if(polygon[0]) polygon[0].forEach(c => allCoords.push(c));
                            });
                        }
                    }
                });

                if (allCoords.length === 0) {
                    setTransformParams({ scale: 1, centerX: 0, centerY: 0 });
                } else {
                    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                    allCoords.forEach(coord => {
                        if (coord && typeof coord[0] === 'number' && typeof coord[1] === 'number') {
                            minX = Math.min(minX, coord[0]);
                            maxX = Math.max(maxX, coord[0]);
                            minY = Math.min(minY, coord[1]);
                            maxY = Math.max(maxY, coord[1]);
                        }
                    });
                    if (!isFinite(minX)) throw new Error("Failed to calculate valid data bounds.");
                    const dataWidth = maxX - minX;
                    setTransformParams({
                        scale: dataWidth === 0 ? 1 : targetDisplayWidth / dataWidth,
                        centerX: minX + dataWidth / 2,
                        centerY: minY + (maxY - minY) / 2,
                    });
                }
                setProcessedFeatures(geoJsonFeatures);
                setLoading(false);
            })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [topoJsonPath, targetDisplayWidth]);

    const extrudeSettings = useMemo(() => ({
        steps: 1, depth: 0.2, bevelEnabled: true,
        bevelThickness: 0.02, bevelSize: 0.01, bevelSegments: 1,
    }), []);

    if (loading) return <div><p>Loading Map Data...</p></div>;
    if (error) return <div><p>Error loading map: {error}</p></div>;
    if (!transformParams) return <div><p>No map data to display.</p></div>;

    return (
        <Canvas camera={{ position: [0, 0, 12], fov: 50 }} shadows>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />
            <group>
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

export default VetNavMap;
